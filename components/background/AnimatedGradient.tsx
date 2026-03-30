'use client';

import { motion } from 'framer-motion';
import type { Emotion } from '@/lib/emotionThemes';

interface AnimatedGradientProps {
  emotion: Emotion;
}

const emotionGradientMap: Record<Emotion, string> = {
  regret:
    'linear-gradient(120deg, rgba(92, 124, 230, 0.2), rgba(40, 51, 95, 0.24), rgba(92, 124, 230, 0.14))',
  silence:
    'linear-gradient(120deg, rgba(166, 172, 198, 0.16), rgba(38, 41, 54, 0.2), rgba(166, 172, 198, 0.12))',
  pain:
    'linear-gradient(120deg, rgba(255, 110, 110, 0.17), rgba(83, 18, 18, 0.24), rgba(255, 110, 110, 0.12))',
  love:
    'linear-gradient(120deg, rgba(255, 136, 197, 0.22), rgba(122, 42, 89, 0.24), rgba(255, 136, 197, 0.15))',
  hope:
    'linear-gradient(120deg, rgba(255, 200, 123, 0.2), rgba(127, 74, 21, 0.22), rgba(255, 200, 123, 0.14))',
  closure:
    'linear-gradient(120deg, rgba(197, 197, 197, 0.16), rgba(61, 61, 61, 0.2), rgba(197, 197, 197, 0.11))',
};

export function AnimatedGradient({ emotion }: AnimatedGradientProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: emotionGradientMap[emotion],
        backgroundSize: '200% 200%',
        mixBlendMode: 'screen',
        opacity: 0.8,
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 18,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      aria-hidden="true"
    />
  );
}
