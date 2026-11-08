import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import type { Phase, SymbolId } from '../game/types';
import { fmt, STRINGS, useI18n } from '../i18n/strings';
import { Medallion } from './art/Medallion';
import { ChipGraphic } from './art/Ornaments';

interface Props {
  symbol: SymbolId;
  index: number;
  bet: number;
  /** Value of the chip shown on the stack (latest placed). */
  topChip: number;
  phase: Phase;
  /** Dice matching this symbol in the revealed round (null when not revealed). */
  matches: number | null;
  payout: number;
  locked: boolean;
  onBet: (symbol: SymbolId) => void;
}

export function SymbolTile({ symbol, index, bet, topChip, phase, matches, payout, locked, onBet }: Props) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const revealed = phase === 'revealed' && matches !== null;
  const hit = revealed && (matches ?? 0) > 0;
  const won = hit && bet > 0;
  const khmer = STRINGS.km.symbols[symbol];

  useEffect(() => {
    if (bet === 0 || reduce) return;
    void controls.start({ scale: [1, 0.95, 1.02, 1], transition: { duration: 0.3 } });
  }, [bet, controls, reduce]);

  useEffect(() => {
    if (!won || reduce) return;
    void controls.start({ y: [0, -10, 0, -4, 0], transition: { duration: 0.7, ease: 'easeOut' } });
  }, [won, controls, reduce]);

  const label = `${t.symbols[symbol]}${lang === 'en' ? ` (${khmer})` : ''}${bet > 0 ? `, ${fmt(bet)}` : ''}${
    revealed ? `, ${t.matched(matches ?? 0)}` : ''
  }`;

  return (
    <motion.button
      type="button"
      data-tile={symbol}
      aria-label={label}
      aria-keyshortcuts={String(index + 1)}
      aria-disabled={locked}
      onClick={() => onBet(symbol)}
      animate={controls}
      whileHover={locked || reduce ? undefined : { y: -4 }}
      whileTap={locked ? undefined : { scale: 0.95 }}
      className={`group relative flex w-full flex-col items-center rounded-xl border-2 bg-white p-2 transition-[opacity,box-shadow] duration-300 sm:rounded-2xl sm:p-3
        ${locked ? 'cursor-wait' : 'cursor-pointer'}
        ${revealed && !hit ? 'opacity-45' : ''}
        ${won ? 'border-[#1f9d5a]' : bet > 0 ? 'border-[#f4c430]' : 'border-[#3a6fc0]/55'}`}
      style={{
        boxShadow: won
          ? '0 0 0 4px #7ee0a8, 0 0 28px 4px rgba(46,200,120,.55), 0 10px 18px -8px rgba(0,0,0,.5)'
          : bet > 0
            ? '0 0 0 3px #ffe58a, 0 10px 18px -8px rgba(0,0,0,.5)'
            : '0 4px 0 #cdd8ea, 0 10px 18px -10px rgba(0,0,0,.5)',
      }}
    >
      <div className="pointer-events-none absolute inset-1 rounded-lg border border-[#3a6fc0]/25 sm:rounded-xl" />
      <Medallion
        symbol={symbol}
        className="relative w-full transition-transform duration-300 group-hover:rotate-[-4deg] group-active:scale-95"
      />
      <span lang="km" className="relative mt-1 font-moul text-xs text-[#9b2a22] sm:text-base" style={{ lineHeight: 1.7 }}>
        {khmer}
      </span>
      {lang === 'en' && (
        <span className="relative -mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-[#3a6fc0] sm:text-xs">
          {t.symbols[symbol]}
        </span>
      )}

      <AnimatePresence>
        {bet > 0 && (
          <motion.div
            key="stack"
            initial={reduce ? false : { y: -30, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="absolute -right-2 -top-2 z-20 flex items-center sm:-right-3 sm:-top-3"
          >
            <ChipGraphic value={topChip} size={30} />
            <motion.span
              key={bet}
              initial={reduce ? false : { scale: 1.4 }}
              animate={{ scale: 1 }}
              className="-ml-2 rounded-full border-2 border-white bg-[#2b1d14] px-1.5 py-0.5 font-display text-[11px] font-bold text-[#ffe58a] shadow sm:text-sm"
            >
              {fmt(bet)}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hit && (
          <motion.div
            key="hit"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 14, delay: 0.1 }}
            className={`absolute -left-2 -top-2 z-20 grid size-9 place-items-center rounded-full border-[3px] border-white font-display text-sm font-bold text-white shadow-lg sm:size-11 sm:text-base ${
              won ? 'bg-[#1f9d5a]' : 'bg-[#3a6fc0]'
            }`}
          >
            {t.matched(matches ?? 0)}
          </motion.div>
        )}
        {won && payout > 0 && (
          <motion.div
            key="payout"
            initial={{ y: 10, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 16 }}
            className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-white bg-[#1f9d5a] px-2.5 py-0.5 font-display text-xs font-bold text-white shadow-lg sm:text-sm"
          >
            +{fmt(payout)}
          </motion.div>
        )}
      </AnimatePresence>

      {won && !reduce && <Sparkles />}
    </motion.button>
  );
}

const SPARKS = [
  { x: '8%', y: '14%', d: 0, s: 14 },
  { x: '84%', y: '10%', d: 0.25, s: 18 },
  { x: '90%', y: '60%', d: 0.5, s: 12 },
  { x: '4%', y: '66%', d: 0.7, s: 16 },
];

function Sparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
      {SPARKS.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={p.s}
          height={p.s}
          className="absolute"
          style={{ left: p.x, top: p.y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 0], rotate: [0, 90], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, delay: p.d, repeat: 2, repeatDelay: 0.3 }}
        >
          <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="#fff6c2" stroke="#f0b93a" strokeWidth="1" />
        </motion.svg>
      ))}
    </div>
  );
}
