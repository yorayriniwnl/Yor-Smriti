'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import { stageVariants, buttonVariants } from '@/lib/animations';
import { SlowRevealText, AccentDivider } from '@/components/ui/SlowRevealText';
import { ACCOUNTABILITY_LINES } from '@/lib/messages';

// ─── AccountabilityStage ──────────────────────────────────────────────────────

export function AccountabilityStage() {
  const advanceStage = useAppStore((s) => s.advanceStage);
  const [allRevealed, setAllRevealed] = useState(false);

  return (
    <motion.div
      key="accountability"
      variants={stageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stage-root"
    >
      <div className="flex w-full max-w-[520px] flex-col items-center gap-10 text-center">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, transition: { duration: 1.5, delay: 0.3 } }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          the hard part
        </motion.div>

        {/* Divider */}
        <AccentDivider delay={0.5} width="2rem" />

        {/* Lines */}
        <SlowRevealText
          lines={ACCOUNTABILITY_LINES}
          initialDelay={1200}
          onAllRevealed={() => setAllRevealed(true)}
          fontSize="clamp(1.25rem, 2.8vw, 2rem)"
          textAlign="center"
        />

        {/* Continue */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              key="continue"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              <button
                onClick={advanceStage}
                className="group flex items-center gap-3 outline-none touch-target"
                aria-label="Continue to next step"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    transition: 'color 0.4s ease',
                  }}
                  className="group-hover:text-[var(--text-secondary)]"
                >
                  there&apos;s more
                </span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: 'var(--accent-dim)', fontSize: '0.7rem', opacity: 0.7 }}
                >
                  →
                </motion.span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
