'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { EASE_SOFT } from '@/components/experiences/director/screens/CinematicApologyScreens/shared';

export function ContinueControls({
  show,
  onPrev,
  onNext,
  nextLabel = 'Next →',
  prevLabel = '← Back',
}: {
  show: boolean;
  onPrev: () => void;
  onNext: () => void;
  nextLabel?: string;
  prevLabel?: string;
}) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="mt-6 flex items-center justify-between gap-3 px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
        >
          <motion.button
            type="button"
            onClick={onPrev}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255, 195, 225, 0.68)',
            }}
          >
            {prevLabel}
          </motion.button>

          <motion.button
            type="button"
            onClick={onNext}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full px-5 py-2.5"
            style={{
              background:
                'linear-gradient(90deg, rgba(232, 80, 153, 0.92), rgba(200, 60, 130, 0.92))',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#fff',
              boxShadow: '0 8px 22px rgba(232, 80, 153, 0.35)',
            }}
          >
            {nextLabel}
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
