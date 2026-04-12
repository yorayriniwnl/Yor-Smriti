'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Emotion } from '@/lib/emotionThemes';
import type { TimingConfig } from '@/lib/timeDistortion';

interface PageTransitionProps {
  transitionKey: string | number;
  emotion?: Emotion;
  timing?: TimingConfig;
  className?: string;
  children: ReactNode;
}

const emotionTransitionConfig: Record<Emotion, {
  blurIn: number;
  enterY: number;
  exitY: number;
  duration: number;
}> = {
  regret: {
    blurIn: 10,
    enterY: 10,
    exitY: -10,
    duration: 0.9,
  },
  silence: {
    blurIn: 6,
    enterY: 6,
    exitY: -6,
    duration: 0.84,
  },
  pain: {
    blurIn: 12,
    enterY: 12,
    exitY: -12,
    duration: 0.95,
  },
  love: {
    blurIn: 8,
    enterY: 8,
    exitY: -8,
    duration: 0.82,
  },
  hope: {
    blurIn: 5,
    enterY: 14,
    exitY: -16,
    duration: 0.88,
  },
  closure: {
    blurIn: 7,
    enterY: 9,
    exitY: -9,
    duration: 0.9,
  },
};

export function PageTransition({
  transitionKey,
  emotion = 'silence',
  timing,
  className,
  children,
}: PageTransitionProps) {
  const transitionConfig = emotionTransitionConfig[emotion];
  const resolvedTiming = timing ?? {
    duration: transitionConfig.duration,
    delay: 0,
    easing: 'easeOut' as const,
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={transitionKey}
        className={className}
        initial={{
          opacity: 0,
          scale: 0.98,
          y: transitionConfig.enterY,
          filter: `blur(${transitionConfig.blurIn}px)`,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
        }}
        exit={{
          opacity: 0,
          scale: 1.02,
          y: transitionConfig.exitY,
          filter: `blur(${Math.max(transitionConfig.blurIn - 2, 2)}px)`,
        }}
        transition={{
          duration: resolvedTiming.duration,
          delay: resolvedTiming.delay,
          ease: resolvedTiming.easing,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
