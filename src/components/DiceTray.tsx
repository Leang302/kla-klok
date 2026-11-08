import { motion, useReducedMotion } from 'motion/react';
import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react';
import { randomSymbol } from '../game/random';
import type { DiceRoll, Phase, SymbolId } from '../game/types';
import { useI18n } from '../i18n/strings';
import { Medallion } from './art/Medallion';

export interface DiceTiming {
  shake: number;
  gap: number;
  land: number;
}

interface TrayProps {
  phase: Phase;
  dice: DiceRoll | null;
  rollKey: number;
  timing: DiceTiming;
  /** Symbols bet on in the shown round, to highlight matching dice. */
  betSymbols: SymbolId[];
  onLand: (index: number) => void;
  children?: ReactNode;
}

const IDLE: DiceRoll = ['tiger', 'gourd', 'rooster'];
const TILTS = [-6, 4, -3];

export const DiceTray = forwardRef<HTMLDivElement, TrayProps>(function DiceTray(
  { phase, dice, rollKey, timing, betSymbols, onLand, children },
  ref,
) {
  const { t } = useI18n();
  const [landed, setLanded] = useState(3);
  const onLandRef = useRef(onLand);
  onLandRef.current = onLand;
  const rolling = phase === 'rolling';

  useEffect(() => {
    if (!rolling) return;
    setLanded(0);
    const timers = [0, 1, 2].map((i) =>
      window.setTimeout(() => {
        setLanded(i + 1);
        onLandRef.current(i);
      }, timing.shake + i * timing.gap),
    );
    return () => timers.forEach(clearTimeout);
  }, [rollKey, rolling]); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = dice ?? IDLE;
  const announce = rolling ? t.shaking : dice ? `${t.lastResult}: ${dice.map((d) => t.symbols[d]).join(', ')}` : '';

  return (
    <div
      ref={ref}
      className="felt relative rounded-3xl px-4 pb-9 pt-8 sm:pb-10 sm:pt-10"
    >
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
      <div className="flex justify-center gap-3 sm:gap-4">
        {shown.map((face, i) => (
          <Die
            key={i}
            index={i}
            face={face}
            shaking={rolling && landed <= i}
            justLanded={rolling && landed > i}
            landKey={`${rollKey}-${rolling && landed > i ? 'landed' : 'idle'}`}
            highlight={phase === 'revealed' && betSymbols.includes(face)}
            dimmed={phase === 'revealed' && betSymbols.length > 0 && !betSymbols.includes(face)}
          />
        ))}
      </div>
      {children}
    </div>
  );
});

interface DieProps {
  index: number;
  face: SymbolId;
  shaking: boolean;
  justLanded: boolean;
  landKey: string;
  highlight: boolean;
  dimmed: boolean;
}

function Die({ index, face, shaking, justLanded, landKey, highlight, dimmed }: DieProps) {
  const reduce = useReducedMotion();
  const [cycling, setCycling] = useState<SymbolId>(face);
  const tilt = TILTS[index];
  const dir = index % 2 === 0 ? 1 : -1;

  useEffect(() => {
    if (!shaking) return;
    const id = window.setInterval(() => setCycling(randomSymbol()), reduce ? 140 : 75);
    return () => clearInterval(id);
  }, [shaking, reduce]);

  const animate = shaking
    ? reduce
      ? { opacity: [1, 0.6, 1], rotate: tilt }
      : {
          y: [0, -24, 0, -12, 0],
          x: [0, 6 * dir, -5 * dir, 3 * dir, 0],
          rotate: [tilt, tilt + 120 * dir, tilt + 250 * dir, tilt + 330 * dir, tilt + 360 * dir],
          scale: [1, 1.08, 0.96, 1.04, 1],
        }
    : justLanded && !reduce
      ? { y: [-60, 0, -14, 0, -4, 0], x: 0, scale: [1.3, 0.92, 1.05, 0.98, 1.02, 1], rotate: [tilt - 90 * dir, tilt], opacity: 1 }
      : { y: 0, x: 0, scale: 1, rotate: tilt, opacity: 1 };

  const transition = shaking
    ? { duration: reduce ? 0.5 : 0.42 + index * 0.05, repeat: Infinity, ease: 'easeInOut' as const }
    : justLanded && !reduce
      ? { duration: 0.6, ease: 'easeOut' as const, rotate: { duration: 0.35, ease: 'easeOut' as const } }
      : { type: 'spring' as const, stiffness: 300, damping: 20 };

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -bottom-2 left-1/2 h-3 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-[4px]" />
      <motion.div
        key={landKey}
        animate={animate}
        transition={transition}
        className={`relative grid size-[76px] place-items-center rounded-2xl bg-white sm:size-[92px] ${
          dimmed ? 'brightness-[.8]' : ''
        }`}
        style={{
          boxShadow: highlight
            ? '0 0 0 4px #7ee0a8, 0 0 22px 6px rgba(126,224,168,.7), 0 6px 0 #c9d3e2'
            : '0 6px 0 #c9d3e2, 0 10px 16px rgba(0,0,0,.3)',
        }}
      >
        <Medallion symbol={shaking ? cycling : face} className="size-[86%]" />
      </motion.div>
    </div>
  );
}
