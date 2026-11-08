import { animate, motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { forwardRef, useEffect, useRef, type ReactNode } from 'react';
import { fmt } from '../i18n/strings';

/** Number that smoothly counts to its new value. */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = prev.current;
    prev.current = value;
    if (reduce || from === value) {
      el.textContent = fmt(value);
      return;
    }
    const controls = animate(from, value, {
      duration: Math.min(1.2, 0.4 + Math.abs(value - from) / 2000),
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {fmt(value)}
    </span>
  );
}

type IconButtonProps = HTMLMotionProps<'button'> & {
  label: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
};

const ICON_SIZES = { sm: 'size-9 rounded-xl', md: 'size-10 rounded-2xl sm:size-11', lg: 'size-14 rounded-2xl' };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, active, size = 'md', children, className = '', ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9, y: 1 }}
      className={`grid ${ICON_SIZES[size]} place-items-center border border-line text-ink transition-colors
        ${active ? 'bg-[#1f7a4a] text-white' : 'bg-surface-solid/90 hover:bg-surface-solid'}
        shadow-[0_3px_0_var(--line)] disabled:opacity-40 ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

type PillButtonProps = HTMLMotionProps<'button'> & {
  tone?: 'plain' | 'gold' | 'coral';
  children: ReactNode;
};

export function PillButton({ tone = 'plain', className = '', children, ...rest }: PillButtonProps) {
  const tones = {
    plain: 'bg-surface-solid text-ink border-line shadow-[0_3px_0_var(--line)] hover:bg-sunk',
    gold: 'bg-gradient-to-b from-[#ffe08a] to-[#f0b93a] text-[#4a2c08] border-[#c98a14] shadow-[0_3px_0_#b87a12]',
    coral: 'bg-gradient-to-b from-[#ff8c6e] to-[#e2553a] text-white border-[#b2402a] shadow-[0_3px_0_#a33522]',
  };
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95, y: 2 }}
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-bold
        transition-[background-color,opacity] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none
        ${tones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

