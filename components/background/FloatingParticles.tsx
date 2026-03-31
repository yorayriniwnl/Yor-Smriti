'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Emotion } from '@/lib/emotionThemes';

interface FloatingParticlesProps {
  emotion: Emotion;
  count?: number;
}

function formatPct(value: number): string {
  return `${value.toFixed(4)}%`;
}

function formatPx(value: number): string {
  return `${value.toFixed(5)}px`;
}

function seededUnit(seed: number): number {
  const raw = Math.sin(seed * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}

const emotionParticleColor: Record<Emotion, string> = {
  regret: 'rgba(159, 189, 255, 0.4)',
  silence: 'rgba(197, 202, 223, 0.35)',
  pain: 'rgba(255, 146, 146, 0.4)',
  love: 'rgba(255, 165, 211, 0.42)',
  hope: 'rgba(255, 210, 143, 0.42)',
  closure: 'rgba(220, 220, 220, 0.33)',
};

export function FloatingParticles({
  emotion,
  count = 28,
}: FloatingParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: `dust-${index}`,
        left: seededUnit(index + count * 1.3) * 100,
        top: seededUnit(index + count * 2.1) * 100,
        size: seededUnit(index + count * 3.7) * 3 + 1,
        driftX: (seededUnit(index + count * 4.9) - 0.5) * 24,
        driftY: -(seededUnit(index + count * 6.2) * 24 + 8),
        delay: seededUnit(index + count * 7.4) * 2.2,
        duration: seededUnit(index + count * 8.8) * 4 + 6,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: formatPct(particle.left),
            top: formatPct(particle.top),
            width: formatPx(particle.size),
            height: formatPx(particle.size),
            backgroundColor: emotionParticleColor[emotion],
            filter: 'blur(0.2px)',
          }}
          animate={{
            x: [0, particle.driftX, 0],
            y: [0, particle.driftY, 0],
            opacity: [0.08, 0.45, 0.1],
          }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
