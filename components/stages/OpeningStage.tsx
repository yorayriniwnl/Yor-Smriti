'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import { stageVariants, textRevealVariants, buttonVariants, EASE_SOFT } from '@/lib/animations';
import { OPENING_CONTENT } from '@/lib/messages';

// ─── OpeningStage ─────────────────────────────────────────────────────────────

export function OpeningStage() {
  const advanceStage = useAppStore((s) => s.advanceStage);
  const markInteractionStarted = useAppStore((s) => s.markInteractionStarted);
  const [clicked, setClicked] = useState(false);

  const handleOkay = () => {
    if (clicked) return;
    setClicked(true);
    markInteractionStarted();

    // Brief pause before advancing
    setTimeout(() => {
      advanceStage();
    }, 900);
  };

  return (
    <motion.div
      key="opening"
      variants={stageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stage-root"
    >
      <div className="flex flex-col items-center gap-12 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 2, delay: 0.5 } }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          a quiet message
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: 1,
            opacity: 0.3,
            transition: { duration: 1.4, delay: 0.8, ease: EASE_SOFT },
          }}
          style={{
            height: '1px',
            width: '2rem',
            background: 'linear-gradient(to right, transparent, var(--accent-dim), transparent)',
            margin: '-2rem auto',
          }}
        />

        {/* Main headline */}
        <motion.h1
          variants={textRevealVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            maxWidth: '24ch',
          }}
        >
          {OPENING_CONTENT.headline}
        </motion.h1>

        {/* CTA Button */}
        <AnimatePresence>
          {!clicked && (
            <motion.div
              key="okay-btn"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
              transition={{ delay: 2.2 }}
            >
              <button
                onClick={handleOkay}
                className="group relative overflow-hidden rounded-sm"
                style={{
                  padding: '0.75rem 2.5rem',
                  border: '1px solid rgba(201,169,110,0.25)',
                  background: 'transparent',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {/* Hover fill */}
                <motion.div
                  className="absolute inset-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: EASE_SOFT }}
                  style={{
                    background: 'rgba(201,169,110,0.06)',
                    transformOrigin: 'left',
                  }}
                />

                <span
                  className="relative"
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.14em',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                  }}
                >
                  {OPENING_CONTENT.buttonLabel}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* After click feedback */}
        <AnimatePresence>
          {clicked && (
            <motion.p
              key="clicked-feedback"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
              style={{
                fontFamily: 'var(--font-crimson)',
                fontStyle: 'italic',
                fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                color: 'var(--text-muted)',
              }}
            >
              Thank you...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom label */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 2, delay: 3 } }}
      >
        <p
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            opacity: 0.4,
          }}
        >
          no pressure · no judgment
        </p>
      </motion.div>
    </motion.div>
  );
}
