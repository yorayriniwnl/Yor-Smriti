'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import { stageVariants } from '@/lib/animations';
import { HoldButton } from '@/components/ui/HoldButton';
import { HOLD_BUTTON_CONFIG } from '@/lib/messages';

// ─── HoldStage ────────────────────────────────────────────────────────────────

export function HoldStage() {
  const advanceStage = useAppStore((s) => s.advanceStage);
  const [revealed, setRevealed] = useState(false);

  const handleComplete = () => {
    setRevealed(true);

    // Auto-advance to ending after a generous pause
    setTimeout(() => {
      advanceStage();
    }, 4000);
  };

  return (
    <motion.div
      key="hold"
      variants={stageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stage-root"
    >
      <div className="flex w-full max-w-[480px] flex-col items-center gap-12 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35, transition: { duration: 1.5, delay: 0.5 } }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          {revealed ? 'I meant it' : 'when you\'re ready'}
        </motion.div>

        {/* Hold button + reveal */}
        <HoldButton
          label={HOLD_BUTTON_CONFIG.label}
          holdDuration={HOLD_BUTTON_CONFIG.holdDuration}
          revealText={HOLD_BUTTON_CONFIG.revealText}
          onComplete={handleComplete}
        />

        {/* Skip option — very subtle */}
        <AnimatePresence>
          {!revealed && (
            <motion.div
              key="skip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 3.5, duration: 1.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            >
              <button
                onClick={advanceStage}
                className="outline-none touch-target"
                aria-label="Skip and continue"
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  opacity: 0.4,
                  transition: 'opacity 0.4s ease',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.opacity = '0.4';
                }}
              >
                skip →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
