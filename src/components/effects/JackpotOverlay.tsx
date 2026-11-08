import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import type { SymbolId } from '../../game/types';
import { fmt, useI18n } from '../../i18n/strings';
import { Medallion } from '../art/Medallion';

export function JackpotOverlay({
  symbol,
  amount,
  onDone,
}: {
  symbol: SymbolId | null;
  amount: number;
  onDone: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    if (!symbol) return;
    const id = window.setTimeout(onDone, 3600);
    return () => clearTimeout(id);
  }, [symbol, onDone]);

  return (
    <AnimatePresence>
      {symbol && (
        <motion.div
          key="jackpot"
          role="alert"
          className="fixed inset-0 z-[58] grid cursor-pointer place-items-center overflow-hidden bg-[#2a0f0c]/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDone}
        >
          <motion.div
            aria-hidden="true"
            className="absolute size-[160vmax]"
            style={{
              background:
                'repeating-conic-gradient(from 0deg, rgba(255,214,90,.28) 0 10deg, transparent 10deg 20deg)',
              maskImage: 'radial-gradient(circle, #000 0%, transparent 45%)',
              WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 45%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <div className="relative flex flex-col items-center px-6 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="flex -space-x-6"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  className="grid size-24 place-items-center rounded-3xl border-4 border-[#ffe08a] bg-white shadow-[0_0_40px_rgba(255,214,90,.8)] sm:size-32"
                >
                  <Medallion symbol={symbol} className="size-[88%]" />
                </motion.div>
              ))}
            </motion.div>
            <motion.h2
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 14 }}
              className="gold-text mt-6 font-display text-6xl font-bold tracking-wide drop-shadow-[0_4px_0_rgba(0,0,0,.35)] sm:text-8xl"
              style={{ WebkitTextStroke: '1.5px #7a3a08', lineHeight: 1.4 }}
            >
              {t.jackpot}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-1 font-display text-xl font-semibold text-[#fff4dc] sm:text-2xl"
            >
              {t.jackpotSub(t.symbols[symbol])} <span className="text-[#ffe08a]">+{fmt(amount)}</span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
