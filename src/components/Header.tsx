import { AnimatePresence, motion } from 'motion/react';
import { CircleHelp, Music, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { Lang } from '../game/storage';
import type { RoundResult } from '../game/types';
import { fmt, useI18n } from '../i18n/strings';
import { Medallion } from './art/Medallion';
import { IconButton } from './ui';

export function Header({
  lang,
  soundOn,
  musicOn,
  onMusic,
  onLang,
  onSound,
  onHelp,
  onRestart,
}: {
  lang: Lang;
  soundOn: boolean;
  musicOn: boolean;
  onMusic: () => void;
  onLang: () => void;
  onSound: () => void;
  onHelp: () => void;
  onRestart: () => void;
}) {
  const { t } = useI18n();
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <Medallion symbol="tiger" className="size-11 shrink-0 drop-shadow-md sm:size-14" />
        <div className="min-w-0">
          <h1
            lang="km"
            className="font-moul text-xl text-[#ffd84a] sm:text-3xl"
            style={{ lineHeight: 1.6, textShadow: '0 2px 0 #1f5a37, 0 0 1px #1f5a37' }}
          >
            ខ្លាឃ្លោក
          </h1>
          <p className="-mt-1 hidden truncate font-display text-sm font-semibold tracking-wide text-[#fbefd9] sm:block">
            Let&apos;s play Kla Klok!
          </p>
        </div>
      </div>
      <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label="Settings">
        <motion.button
          type="button"
          onClick={onLang}
          whileTap={{ scale: 0.92 }}
          aria-label={t.language}
          title={t.language}
          className="flex h-10 items-center rounded-2xl bg-white/95 p-1 shadow-md sm:h-11"
        >
          {(['en', 'km'] as const).map((l) => (
            <span
              key={l}
              lang={l}
              className={`relative grid h-full min-w-8 place-items-center rounded-xl px-1.5 text-sm font-bold sm:min-w-9 ${
                lang === l ? 'text-white' : 'text-ink-soft'
              }`}
            >
              {lang === l && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-xl bg-[#1f7a4a]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative" style={{ lineHeight: 1.3 }}>
                {l === 'en' ? 'EN' : 'ខ្មែរ'}
              </span>
            </span>
          ))}
        </motion.button>
        <IconButton label={musicOn ? t.musicStop : t.music} onClick={onMusic} active={musicOn} aria-pressed={musicOn}>
          <Music className="size-5" />
        </IconButton>
        <IconButton label={t.howToPlay} onClick={onHelp} className="hidden sm:grid">
          <CircleHelp className="size-5" />
        </IconButton>
        <IconButton label={soundOn ? t.soundOff : t.soundOn} onClick={onSound} aria-pressed={soundOn}>
          {soundOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </IconButton>
        <IconButton label={t.restart} onClick={onRestart}>
          <RotateCcw className="size-5" />
        </IconButton>
      </nav>
    </header>
  );
}

export function ResultBanner({ round, visible }: { round: RoundResult | null; visible: boolean }) {
  const { t } = useI18n();
  let text = '';
  let tone = 'bg-[#2b1d14] text-[#fff4dc]';
  if (round) {
    if (round.net > 0) {
      text = t.win(fmt(round.net));
      tone = 'bg-[#ffd84a] text-[#1f5a37]';
    } else if (round.net === 0) {
      text = t.breakEven;
      tone = 'bg-white text-[#2b1d14]';
    } else if (round.totalPayout > 0) {
      text = t.partial(fmt(round.totalPayout), `−${fmt(round.net)}`);
    } else {
      text = t.lose(fmt(round.net));
    }
  }
  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-4 flex justify-center" aria-live="polite">
      <AnimatePresence>
        {visible && round && (
          <motion.div
            key={round.id}
            initial={{ y: 16, scale: 0.5, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 16 }}
            className={`km-tight whitespace-nowrap rounded-full border-2 border-white px-5 py-1.5 font-display text-base font-bold shadow-xl sm:text-lg ${tone}`}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
