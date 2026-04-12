'use client';

import { motion } from 'framer-motion';
import { EASE_SOFT } from '@/components/experiences/director/screens/CinematicApologyScreens/shared';

export function CinematicHeader({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title?: string;
}) {
  return (
    <motion.div
      className="mb-4 px-4 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_SOFT }}
    >
      {eyebrow ? (
        <p
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255, 180, 213, 0.7)',
          }}
        >
          {eyebrow}
        </p>
      ) : null}

      {title ? (
        <h2
          className="mt-1"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            color: 'rgba(255, 237, 248, 0.96)',
          }}
        >
          {title}
        </h2>
      ) : null}
    </motion.div>
  );
}
