'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import { stageVariants, buttonVariants } from '@/lib/animations';
import { SlowRevealText, AccentDivider } from '@/components/ui/SlowRevealText';
import { APOLOGY_LINES } from '@/lib/messages';

// ─── ApologyStage ─────────────────────────────────────────────────────────────

export function ApologyStage() {
  const advanceStage = useAppStore((s) => s.advanceStage);
  const [allRevealed, setAllRevealed] = useState(false);

  return (
    <motion.div
      key="apology"
      variants={stageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stage-root"
    >
      <div className="flex w-full max-w-[480px] flex-col items-center gap-10 text-center">
        {/* Quiet label */}
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
          simply
        </motion.div>

        {/* Top accent */}
        <AccentDivider delay={0.5} width="2rem" />

        {/* Apology lines */}
        <SlowRevealText
          lines={APOLOGY_LINES.map((l) => ({
            id: l.id,
            text: l.text,
            pauseAfter: l.pauseAfter,
            emphasis: (l as typeof l & { emphasis?: boolean }).emphasis,
            italic: l.italic,
          }))}
          initialDelay={1000}
          onAllRevealed={() => setAllRevealed(true)}
          fontSize="clamp(1.25rem, 2.8vw, 2rem)"
          textAlign="center"
        />

        {/* Soft glow pulse when done */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              key="glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 2 } }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Bottom accent */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              key="bottom-accent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1.5 } }}
            >
              <AccentDivider delay={0} width="3rem" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              key="continue"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="mt-2"
            >
              <button
                onClick={advanceStage}
                className="group flex items-center gap-3 outline-none"
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
                  one last thing
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
