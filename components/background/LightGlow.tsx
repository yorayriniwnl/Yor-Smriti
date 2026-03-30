'use client';

import { motion } from 'framer-motion';
import type { Emotion } from '@/lib/emotionThemes';

interface LightGlowProps {
  emotion: Emotion;
}

const emotionGlowColor: Record<Emotion, string> = {
  regret: 'rgba(136, 175, 255, 0.4)',
  silence: 'rgba(192, 199, 226, 0.32)',
  pain: 'rgba(255, 124, 124, 0.38)',
  love: 'rgba(255, 138, 197, 0.42)',
  hope: 'rgba(255, 196, 115, 0.42)',
  closure: 'rgba(195, 195, 195, 0.3)',
};

export function LightGlow({ emotion }: LightGlowProps) {
  const glowColor = emotionGlowColor[emotion];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -left-24 top-16 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: glowColor }}
        animate={{
          x: [0, 48, 0],
          y: [0, 28, 0],
          opacity: [0.16, 0.36, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute -right-24 bottom-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: glowColor }}
        animate={{
          x: [0, -58, 0],
          y: [0, -24, 0],
          opacity: [0.08, 0.3, 0.12],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
