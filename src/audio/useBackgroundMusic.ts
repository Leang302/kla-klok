import { useEffect, useRef } from 'react';

const SRC = `${import.meta.env.BASE_URL}song.App.mp3`;

/**
 * Loops the background song while `enabled`. Browsers block audio until the
 * player interacts with the page, so if playback is refused we retry on the
 * first tap or key press.
 */
export function useBackgroundMusic(enabled: boolean, volume = 0.35) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      audioRef.current?.pause();
      return;
    }
    if (!audioRef.current) {
      const a = new Audio(SRC);
      a.loop = true;
      a.preload = 'auto';
      audioRef.current = a;
    }
    const audio = audioRef.current;
    audio.volume = volume;

    const start = () => {
      audio.play().catch(() => {
        /* still blocked — wait for the next interaction */
      });
    };
    const onInteract = () => {
      audio.play().then(cleanup, () => {
        /* still blocked — keep listening */
      });
    };
    const cleanup = () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
    };

    audio.play().catch(() => {
      window.addEventListener('pointerdown', onInteract);
      window.addEventListener('keydown', onInteract);
    });

    // Pause while the tab is hidden, resume when it comes back.
    const onVisibility = () => {
      if (document.hidden) audio.pause();
      else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, volume]);

  // Stop completely when the app unmounts.
  useEffect(() => () => audioRef.current?.pause(), []);
}
