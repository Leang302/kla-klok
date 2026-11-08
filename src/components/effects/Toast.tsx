import { AnimatePresence, motion } from 'motion/react';
import { Info } from 'lucide-react';

export interface ToastMsg {
  id: number;
  text: string;
}

export function Toast({ toast }: { toast: ToastMsg | null }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4"
      role="status"
      aria-live="assertive"
    >
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: -20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1, x: [0, -6, 6, -3, 3, 0] }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 rounded-full border border-[#c98a14]/40 bg-[#3b2416] px-4 py-2.5 text-sm font-semibold text-[#fff4dc] shadow-xl"
          >
            <Info className="size-4 shrink-0 text-[#ffe08a]" aria-hidden="true" />
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
