'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import { transitionBridgeVariants } from '@/lib/animations';
import { TRANSITION_TEXT } from '@/lib/messages';

// ─── TransitionStage ──────────────────────────────────────────────────────────
// A brief interstitial between chat and memories
// Auto-advances after a pause

export function TransitionStage() {
  const advanceStage = useAppStore((s) => s.advanceStage);

  useEffect(() => {
    const timer = setTimeout(() => {
      advanceStage();
    }, 4200);

    return () => clearTimeout(timer);
  }, [advanceStage]);

  return (
    <motion.div
      key="transition"
      variants={transitionBridgeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stage-root"
    >
      <div className="flex flex-col items-center gap-8 text-center">
        {/* Decorative symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.6, 0.4, 0.6],
            scale: 1,
            transition: { duration: 2, ease: [0.16, 1, 0.3, 1] },
          }}
          style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, transparent, var(--accent-dim), transparent)',
            margin: '0 auto',
          }}
        />

        {/* Primary text */}
        <motion.p
          initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 2.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}
        >
          {TRANSITION_TEXT.primary}
        </motion.p>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.5,
            transition: { duration: 1.6, delay: 1.4, ease: [0.16, 1, 0.3, 1] },
          }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontWeight: 300,
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            color: 'var(--text-secondary)',
            letterSpacing: '0.04em',
          }}
        >
          {TRANSITION_TEXT.sub}
        </motion.p>

        {/* Decorative symbol bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.4, 0.3, 0.4],
            scale: 1,
            transition: { duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
          style={{
            width: '1px',
            height: '32px',
            background: 'linear-gradient(to bottom, var(--accent-dim), transparent)',
            margin: '0 auto',
          }}
        />
      </div>
    </motion.div>
  );
}
