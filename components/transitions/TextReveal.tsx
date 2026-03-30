'use client';

import { motion } from 'framer-motion';
import type { Emotion } from '@/lib/emotionThemes';

interface TextRevealProps {
  text: string;
  emotion?: Emotion;
  delay?: number;
  className?: string;
}

const emotionRevealOffset: Record<Emotion, {
  y: number;
  blur: number;
}> = {
  regret: {
    y: 22,
    blur: 10,
  },
  silence: {
    y: 16,
    blur: 8,
  },
  pain: {
    y: 18,
    blur: 12,
  },
  love: {
    y: 14,
    blur: 7,
  },
  hope: {
    y: 24,
    blur: 6,
  },
  closure: {
    y: 18,
    blur: 7,
  },
};

export function TextReveal({
  text,
  emotion = 'silence',
  delay = 0.3,
  className,
}: TextRevealProps) {
  const config = emotionRevealOffset[emotion];

  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: config.y, filter: `blur(${config.blur}px)` }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.p>
  );
}
