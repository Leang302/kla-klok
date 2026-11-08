import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { CHIP_VALUES, SYMBOLS } from '../../game/types';
import { useI18n } from '../../i18n/strings';
import { Medallion } from '../art/Medallion';
import { ChipGraphic, CoinIcon } from '../art/Ornaments';
import { PillButton } from '../ui';

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  dismissable = true,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  dismissable?: boolean;
}) {
  const { t } = useI18n();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => {
      const el = dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? dialogRef.current;
      el?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissable) onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex="0"]');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, dismissable, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[65] grid place-items-end bg-[#2a170c]/55 p-3 backdrop-blur-[3px] sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && dismissable) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ y: 40, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-[28px] border-[3px] border-[#3a6fc0]/40 bg-surface-solid p-5 shadow-2xl outline-none sm:p-7"
          >
            <div className="mb-4 flex items-start justify-between gap-3 px-4">
              <h2 id={titleId} className="km-tight font-display text-2xl font-bold">
                {title}
              </h2>
              {dismissable && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.close}
                  className="-mr-3 grid size-10 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-sunk"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
            <div className="km-tight text-[15px] leading-relaxed">{children}</div>
            {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.howToPlay}
      footer={
        <PillButton tone="coral" onClick={onClose} data-autofocus>
          {t.letsPlay}
        </PillButton>
      }
    >
      <p>{t.rulesIntro}</p>
      <div className="my-4 grid grid-cols-6 gap-1.5">
        {SYMBOLS.map((s) => (
          <div key={s} className="flex flex-col items-center rounded-xl bg-tile p-1 text-[#3b2416]">
            <Medallion symbol={s} className="size-11" />
            <span className="text-[11px] font-semibold">{t.symbols[s]}</span>
          </div>
        ))}
      </div>
      <table className="w-full overflow-hidden rounded-2xl text-sm">
        <caption className="mb-2 text-left text-xs font-bold uppercase tracking-wider text-ink-soft">{t.rulesTable}</caption>
        <tbody>
          {[0, 1, 2, 3].map((n) => (
            <tr key={n} className="odd:bg-sunk/70">
              <th scope="row" className="px-3 py-2 text-left font-semibold">
                {t.rulesMatches(n)}
              </th>
              <td className={`px-3 py-2 text-right font-bold ${n ? 'text-win' : 'text-lose'}`}>{t.rulesPays(n)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 rounded-2xl border border-dashed border-line p-3 text-sm">{t.rulesExample}</p>
      <p className="mt-3 hidden text-xs text-ink-soft sm:block">{t.rulesKeys}</p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
        <CoinIcon size={16} /> {t.disclaimer}
      </p>
    </Modal>
  );
}

export function TutorialModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);
  const s = t.tutorial[step];
  const last = step === t.tutorial.length - 1;

  const visuals = [
    <div key="chips" className="flex justify-center gap-1">
      {CHIP_VALUES.map((v, i) => (
        <motion.div key={v} initial={{ y: 20, opacity: 0 }} animate={{ y: i === 2 ? -10 : 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
          <ChipGraphic value={v} size={48} />
        </motion.div>
      ))}
    </div>,
    <div key="tiles" className="flex justify-center gap-3">
      {(['tiger', 'crab', 'fish'] as const).map((sym, i) => (
        <motion.div
          key={sym}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="relative grid size-20 place-items-center rounded-2xl border-2 border-[#3a6fc0]/50 bg-white"
        >
          <Medallion symbol={sym} className="size-16" />
          {i === 0 && (
            <motion.span
              className="absolute -right-3 -top-3"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <ChipGraphic value={500} size={34} />
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>,
    <div key="dice" className="flex justify-center gap-3">
      {(['tiger', 'tiger', 'gourd'] as const).map((sym, i) => (
        <motion.div
          key={i}
          initial={{ y: -40, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: [-90, 8, -4, 0][i % 4], opacity: 1 }}
          transition={{ delay: i * 0.25, type: 'spring', stiffness: 260, damping: 12 }}
          className="grid size-16 place-items-center rounded-2xl bg-white shadow-[0_5px_0_#c9d3e2]"
        >
          <Medallion symbol={sym} className="size-14" />
        </motion.div>
      ))}
    </div>,
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${step + 1}. ${s.title}`}
      footer={
        <>
          {!last && (
            <PillButton onClick={onClose} className="mr-auto">
              {t.skip}
            </PillButton>
          )}
          {step > 0 && <PillButton onClick={() => setStep(step - 1)}>{t.back}</PillButton>}
          <PillButton tone="coral" data-autofocus onClick={() => (last ? onClose() : setStep(step + 1))}>
            {last ? t.letsPlay : t.next}
          </PillButton>
        </>
      }
    >
      <div className="mb-5 flex min-h-[110px] items-center justify-center rounded-3xl bg-gradient-to-b from-[#24885a] to-[#1a6a40] p-4">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            {visuals[step]}
          </motion.div>
        </AnimatePresence>
      </div>
      <p>{s.body}</p>
      <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
        {t.tutorial.map((_, i) => (
          <span key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-coral' : 'w-2 bg-line'}`} />
        ))}
      </div>
    </Modal>
  );
}

export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onClose,
  dismissable = true,
  art,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  dismissable?: boolean;
  art?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      dismissable={dismissable}
      footer={
        <>
          {dismissable && <PillButton onClick={onClose}>{t.cancel}</PillButton>}
          <PillButton tone="coral" onClick={onConfirm} data-autofocus>
            {confirmLabel}
          </PillButton>
        </>
      }
    >
      {art && <div className="mb-4 flex justify-center">{art}</div>}
      <p>{body}</p>
    </Modal>
  );
}
