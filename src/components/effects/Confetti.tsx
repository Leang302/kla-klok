import { useEffect, useRef } from 'react';

const COLORS = ['#f0b93a', '#ffe08a', '#ef6b4f', '#3d8fd6', '#2fa27f', '#fff4dc', '#e33b3b'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  shape: 0 | 1 | 2;
  life: number;
}

/** Lightweight canvas confetti. Changing `fireKey` launches a new burst. */
export function Confetti({ fireKey, intensity = 1 }: { fireKey: number; intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    if (!fireKey) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const W = window.innerWidth;
    const H = window.innerHeight;
    const count = Math.round((W < 640 ? 90 : 160) * intensity);
    for (let i = 0; i < count; i++) {
      const fromLeft = i % 2 === 0;
      particles.current.push({
        x: fromLeft ? -10 : W + 10,
        y: H * (0.55 + Math.random() * 0.3),
        vx: (fromLeft ? 1 : -1) * (5 + Math.random() * 9),
        vy: -(11 + Math.random() * 10),
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.floor(Math.random() * 3) as 0 | 1 | 2,
        life: 0,
      });
    }

    const step = () => {
      ctx.clearRect(0, 0, W, H);
      const ps = particles.current;
      for (const p of ps) {
        p.life++;
        p.vy += 0.32;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / 220);
        if (p.shape === 0) ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.life * 0.1)));
        else if (p.shape === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.h / 2);
          ctx.lineTo(p.w / 2, 0);
          ctx.lineTo(0, p.h / 2);
          ctx.lineTo(-p.w / 2, 0);
          ctx.fill();
        }
        ctx.restore();
      }
      particles.current = ps.filter((p) => p.y < H + 40 && p.life < 220);
      if (particles.current.length) raf.current = requestAnimationFrame(step);
      else ctx.clearRect(0, 0, W, H);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [fireKey, intensity]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[60] h-full w-full" aria-hidden="true" />;
}
