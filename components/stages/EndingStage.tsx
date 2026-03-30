'use client';

import { motion } from 'framer-motion';
import { stageVariants, gentleFadeVariants, EASE_SOFT } from '@/lib/animations';
import { ENDING_CONTENT } from '@/lib/messages';

// ─── EndingStage ──────────────────────────────────────────────────────────────

export function EndingStage() {
  return (
    <motion.div
      key="ending"
      variants={stageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stage-root"
    >
      <div className="flex w-full max-w-[440px] flex-col items-center gap-14 text-center">
        {/* Soft decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: 1,
            opacity: 0.3,
            transition: { duration: 1.8, delay: 0.5, ease: EASE_SOFT },
          }}
          style={{
            height: '1px',
            width: '60px',
            background: 'linear-gradient(to right, transparent, var(--accent-dim), transparent)',
          }}
        />

        {/* Main sign-off */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 2, delay: 1, ease: EASE_SOFT },
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
          >
            {ENDING_CONTENT.finalLine}
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45, transition: { duration: 1.6, delay: 2.4 } }}
            style={{
              fontFamily: 'var(--font-crimson)',
              fontWeight: 300,
              fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            — with honesty
          </motion.p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.5, delay: 3.2 } }}
        >
          {ENDING_CONTENT.buttons.map((btn, index) => (
            <motion.button
              key={btn.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1.0,
                  delay: 3.4 + index * 0.4,
                  ease: EASE_SOFT,
                },
              }}
              whileHover={{ opacity: 0.9 }}
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                background: 'none',
                border: '1px solid rgba(201,169,110,0.12)',
                padding: '0.6rem 1.8rem',
                borderRadius: '2px',
                cursor: 'default',
                opacity: 0.55,
              }}
            >
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Very bottom — a small mark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18, transition: { duration: 2, delay: 5 } }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.14em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          this moment was made with care
        </motion.div>
      </div>
    </motion.div>
  );
}
