'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RainLayerProps {
  count?: number;
}

function seededUnit(seed: number): number {
  const raw = Math.sin(seed * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}

export function RainLayer({ count = 64 }: RainLayerProps) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const base = index + 1;
        const left = seededUnit(base * 1.31) * 100;
        const delay = seededUnit(base * 2.07) * 2.6;
        const duration = 0.95 + seededUnit(base * 3.29) * 1.35;
        const length = 12 + seededUnit(base * 4.41) * 24;
        const width = 1 + seededUnit(base * 5.63) * 1.25;
        const opacity = 0.06 + seededUnit(base * 6.91) * 0.16;
        const wind = (seededUnit(base * 7.77) - 0.5) * -34;
        const blur = 0.1 + seededUnit(base * 8.83) * 0.35;
        const angle = 12 + (seededUnit(base * 9.17) - 0.5) * 6;

        return {
          id: `rain-${index}`,
          left,
          delay,
          duration,
          length,
          width,
          opacity,
          wind,
          blur,
          angle,
        };
      }),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {drops.map((drop) => (
        <motion.span
          key={drop.id}
          className="absolute"
          style={{
            left: `${drop.left}%`,
            top: '-25vh',
            width: `${drop.width}px`,
            height: `${drop.length}px`,
            borderRadius: 999,
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0.45) 55%, transparent 100%)',
            opacity: drop.opacity,
            filter: `blur(${drop.blur}px)`,
            rotate: drop.angle,
            willChange: 'transform',
          }}
          animate={{
            y: ['0vh', '140vh'],
            x: [0, drop.wind],
            opacity: [0, drop.opacity, drop.opacity * 0.9],
          }}
          transition={{
            delay: drop.delay,
            duration: drop.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.06), transparent 55%), radial-gradient(circle at 10% 85%, rgba(247,85,144,0.06), transparent 45%)',
          opacity: 0.55,
        }}
      />
    </div>
  );
}
