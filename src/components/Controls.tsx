import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Dices } from 'lucide-react';
import { useRef, type KeyboardEvent } from 'react';
import { Repeat2, Trash2, Undo2 } from 'lucide-react';
import { CHIP_VALUES, type ChipValue } from '../game/types';
import { fmt, useI18n } from '../i18n/strings';
import { ChipGraphic, CoinIcon } from './art/Ornaments';
import { AnimatedNumber, PillButton } from './ui';

export function ChipRack({
  selected,
  available,
  disabled,
  onSelect,
  compact = false,
}: {
  selected: ChipValue;
  available: number;
  disabled: boolean;
  onSelect: (v: ChipValue) => void;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + CHIP_VALUES.length) % CHIP_VALUES.length;
    onSelect(CHIP_VALUES[next]);
    refs.current[next]?.focus();
  };

  const size = compact ? 46 : 58;

  return (
    <div
      role="radiogroup"
      aria-label={t.chips}
      className={`flex items-end justify-between ${compact ? 'gap-1' : 'gap-2'}`}
    >
      {CHIP_VALUES.map((v, i) => {
        const isSel = v === selected;
        const affordable = v <= available;
        return (
          <motion.button
            key={v}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSel}
            aria-label={fmt(v)}
            tabIndex={isSel ? 0 : -1}
            disabled={disabled}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => onSelect(v)}
            animate={{ y: isSel ? (compact ? -6 : -10) : 0, rotate: isSel && !reduce ? 360 : 0 }}
            whileHover={disabled ? undefined : { y: isSel ? -12 : -4 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className={`relative grid shrink-0 place-items-center rounded-full disabled:cursor-not-allowed ${
              affordable ? '' : 'opacity-35 grayscale-[.6]'
            }`}
            style={{ width: size, height: size }}
          >
            {isSel && (
              <motion.span
                layoutId={compact ? 'chip-halo-m' : 'chip-halo'}
                className="absolute -inset-1.5 rounded-full"
                style={{ boxShadow: '0 0 0 3px #ffe08a, 0 0 18px 4px rgba(255,214,90,.75)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <ChipGraphic value={v} size={size} />
          </motion.button>
        );
      })}
    </div>
  );
}

export function ShakeButton({
  onShake,
  rolling,
  totalBet,
  className = '',
}: {
  onShake: () => void;
  rolling: boolean;
  totalBet: number;
  className?: string;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ready = totalBet > 0 && !rolling;
  return (
    <motion.button
      type="button"
      onClick={onShake}
      disabled={!ready}
      aria-keyshortcuts="S"
      aria-label={`${t.shake} ${totalBet > 0 ? `${t.totalBet} ${fmt(totalBet)}` : t.placeFirst}`}
      whileHover={ready ? { scale: 1.03, y: -2 } : undefined}
      whileTap={ready ? { scale: 0.95, y: 4 } : undefined}
      className={`group relative isolate flex items-center justify-center gap-2.5 rounded-full border-2 font-display font-bold
        tracking-wide transition-[filter,box-shadow] disabled:cursor-not-allowed ${className}
        ${
          ready
            ? 'border-[#fff3b0] text-white shadow-[0_6px_0_#a33522,0_14px_24px_-6px_rgba(163,53,34,.6)] active:shadow-[0_2px_0_#a33522]'
            : 'border-line text-ink-soft shadow-[0_4px_0_var(--line)]'
        }`}
      style={{
        background: ready
          ? 'linear-gradient(180deg,#ff9a6b 0%,#ef6b4f 45%,#d4472e 100%)'
          : 'var(--surface-sunk)',
      }}
    >
      {ready && !reduce && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full"
          animate={{ boxShadow: ['0 0 0 0 rgba(239,107,79,.55)', '0 0 0 14px rgba(239,107,79,0)'] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}
      <motion.span
        animate={rolling && !reduce ? { rotate: [0, -25, 25, -15, 15, 0] } : { rotate: 0 }}
        transition={rolling ? { duration: 0.5, repeat: Infinity } : undefined}
      >
        <Dices className="size-6" aria-hidden="true" />
      </motion.span>
      <span className="text-lg sm:text-xl" style={{ lineHeight: 1.5 }}>
        {rolling ? t.shaking : t.shake}
      </span>
      {ready && (
        <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs font-semibold" aria-hidden="true">
          {fmt(totalBet)}
        </span>
      )}
    </motion.button>
  );
}

export interface Delta {
  id: number;
  value: number;
}

export function FloatingDelta({ delta }: { delta: Delta | null }) {
  return (
    <AnimatePresence>
      {delta && (
        <motion.span
          key={delta.id}
          aria-hidden="true"
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{ y: -22, opacity: [0, 1, 1, 0], scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut', times: [0, 0.15, 0.7, 1] }}
          className={`pointer-events-none absolute left-11 -top-3 z-20 font-display text-xl font-bold drop-shadow ${
            delta.value >= 0 ? 'text-win' : 'text-lose'
          }`}
        >
          {delta.value >= 0 ? '+' : '−'}
          {fmt(delta.value)}
        </motion.span>
      )}
    </AnimatePresence>
  );
}


export function ControlPanel({
  available,
  staked,
  chip,
  locked,
  rolling,
  canUndo,
  canRebet,
  delta,
  onChip,
  onUndo,
  onClear,
  onRebet,
  onShake,
  className = '',
}: {
  available: number;
  staked: number;
  chip: ChipValue;
  locked: boolean;
  rolling: boolean;
  canUndo: boolean;
  canRebet: boolean;
  delta: Delta | null;
  onChip: (v: ChipValue) => void;
  onUndo: () => void;
  onClear: () => void;
  onRebet: () => void;
  onShake: () => void;
  className?: string;
}) {
  const { t } = useI18n();
  const showRebet = staked === 0 && canRebet;
  return (
    <section className={`paper rounded-3xl p-3 sm:p-5 ${className}`} aria-label={t.chips}>
      <div className="relative flex items-center justify-between gap-3">
        <FloatingDelta delta={delta} />
        <div className="flex items-center gap-2.5">
          <span data-balance-target>
            <CoinIcon size={34} />
          </span>
          <div className="leading-tight">
            <p className="km-tight text-[11px] font-bold uppercase tracking-wider text-ink-soft">{t.available}</p>
            <AnimatedNumber value={available} className="font-display text-2xl font-bold sm:text-3xl" />
          </div>
        </div>
        <div className="text-right leading-tight">
          <p className="km-tight text-[11px] font-bold uppercase tracking-wider text-ink-soft">{t.totalBet}</p>
          <AnimatedNumber value={staked} className="font-display text-xl font-bold text-[#c98a14] sm:text-2xl" />
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <ChipRack selected={chip} available={available} disabled={locked} onSelect={onChip} compact />
      </div>

      <div className="mt-4 grid grid-cols-[auto_auto_1fr] gap-2">
        <PillButton onClick={onUndo} disabled={locked || !canUndo} aria-label={t.undo} title={t.undo} className="px-3.5">
          <Undo2 className="size-4" aria-hidden="true" />
        </PillButton>
        {showRebet ? (
          <PillButton onClick={onRebet} disabled={locked} aria-label={t.rebet} title={t.rebet} className="px-3.5">
            <Repeat2 className="size-4" aria-hidden="true" />
          </PillButton>
        ) : (
          <PillButton onClick={onClear} disabled={locked || staked === 0} aria-label={t.clear} title={t.clear} className="px-3.5">
            <Trash2 className="size-4" aria-hidden="true" />
          </PillButton>
        )}
        <ShakeButton onShake={onShake} rolling={rolling} totalBet={staked} className="h-12 min-w-0" />
      </div>
    </section>
  );
}
