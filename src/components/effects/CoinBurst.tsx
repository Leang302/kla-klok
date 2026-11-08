import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { CoinIcon } from '../art/Ornaments';

interface Flight {
  id: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  mid: { x: number; y: number };
  delay: number;
}

let nextId = 1;

function center(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function inViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
}

/** Returns the visible balance counter that coins should fly to. */
export function findBalanceTarget(): Element | null {
  const all = Array.from(document.querySelectorAll('[data-balance-target]'));
  return all.find(inViewport) ?? null;
}

export function useCoinBurst() {
  const [flights, setFlights] = useState<Flight[]>([]);

  const launch = useCallback((sources: Element[], perSource: number) => {
    const target = findBalanceTarget();
    if (!target) return;
    const to = center(target);
    const created: Flight[] = [];
    sources.forEach((src, si) => {
      const from = center(src);
      for (let i = 0; i < perSource; i++) {
        const start = { x: from.x + (Math.random() - 0.5) * 50, y: from.y + (Math.random() - 0.5) * 50 };
        created.push({
          id: nextId++,
          from: start,
          to,
          mid: {
            x: (start.x + to.x) / 2 + (Math.random() - 0.5) * 120,
            y: Math.min(start.y, to.y) - 80 - Math.random() * 60,
          },
          delay: si * 0.12 + i * 0.06,
        });
      }
    });
    setFlights((f) => [...f, ...created]);
    window.setTimeout(() => {
      const ids = new Set(created.map((c) => c.id));
      setFlights((f) => f.filter((x) => !ids.has(x.id)));
    }, 1800 + created.length * 60);
  }, []);

  return { flights, launch };
}

export function CoinLayer({ flights }: { flights: Flight[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[55]" aria-hidden="true">
      <AnimatePresence>
        {flights.map((f) => {
          const { x: midX, y: midY } = f.mid;
          return (
            <motion.div
              key={f.id}
              className="absolute left-0 top-0"
              initial={{ x: f.from.x - 14, y: f.from.y - 14, scale: 0, opacity: 0 }}
              animate={{
                x: [f.from.x - 14, midX - 14, f.to.x - 14],
                y: [f.from.y - 14, midY - 14, f.to.y - 14],
                scale: [0.4, 1.25, 0.6],
                opacity: [0, 1, 1, 0],
                rotate: [0, 200, 360],
              }}
              transition={{ duration: 0.95, delay: f.delay, ease: [0.45, 0, 0.3, 1], times: [0, 0.45, 1] }}
            >
              <CoinIcon size={28} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
