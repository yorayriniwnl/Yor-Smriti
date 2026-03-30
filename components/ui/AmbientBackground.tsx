'use client';

import { memo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { StageId } from '@/types';
import { STAGE_AMBIENT_CONFIG } from '@/lib/stages';

// ─── AmbientBackground ────────────────────────────────────────────────────────

interface AmbientBackgroundProps {
  stage: StageId;
}

interface OrbConfig {
  x: string;
  y: string;
  size: number;
  color: string;
  blur: number;
  delay: number;
  duration: number;
}

const ORB_CONFIGS: OrbConfig[] = [
  {
    x: '20%',
    y: '30%',
    size: 480,
    color: 'rgba(247, 85, 144, 1)',
    blur: 120,
    delay: 0,
    duration: 14,
  },
  {
    x: '65%',
    y: '55%',
    size: 360,
    color: 'rgba(255, 133, 179, 1)',
    blur: 100,
    delay: 3,
    duration: 18,
  },
  {
    x: '40%',
    y: '70%',
    size: 300,
    color: 'rgba(255, 179, 207, 1)',
    blur: 90,
    delay: 6,
    duration: 22,
  },
];

const STAGE_MESH: Record<StageId, string> = {
  opening:
    'radial-gradient(ellipse 80% 60% at 20% 10%, #ffd6e760 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 80%, #ffb3cf40 0%, transparent 60%)',
  chat:
    'radial-gradient(ellipse 78% 58% at 25% 12%, #ffe4ee66 0%, transparent 62%), radial-gradient(ellipse 58% 64% at 78% 72%, #ffb3cf33 0%, transparent 60%)',
  transition:
    'radial-gradient(ellipse 90% 72% at 10% 45%, #ffd6e750 0%, transparent 62%), radial-gradient(ellipse 58% 60% at 84% 20%, #ff85b32e 0%, transparent 62%)',
  memory:
    'radial-gradient(ellipse 70% 80% at 50% 0%, #ffd6e74d 0%, transparent 62%), radial-gradient(ellipse 62% 50% at 20% 82%, #ffb3cf38 0%, transparent 62%)',
  accountability:
    'radial-gradient(ellipse 82% 62% at 82% 10%, #ffeaf266 0%, transparent 62%), radial-gradient(ellipse 66% 68% at 10% 72%, #f755901f 0%, transparent 62%)',
  apology:
    'radial-gradient(ellipse 82% 64% at 16% 14%, #ffe4ef66 0%, transparent 62%), radial-gradient(ellipse 62% 64% at 80% 78%, #ffb3cf38 0%, transparent 62%)',
  hold:
    'radial-gradient(ellipse 84% 60% at 50% 5%, #ffd6e75a 0%, transparent 62%), radial-gradient(ellipse 64% 62% at 82% 76%, #f7559024 0%, transparent 65%)',
  ending:
    'radial-gradient(ellipse 100% 80% at 50% 50%, #ffb3cf4a 0%, transparent 70%), radial-gradient(ellipse 62% 70% at 18% 82%, #ffd6e735 0%, transparent 65%)',
};

function AmbientBackgroundComponent({ stage }: AmbientBackgroundProps) {
  const config = STAGE_AMBIENT_CONFIG[stage];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base background */}
      <div
        className="absolute inset-0"
        style={{
          background: `${STAGE_MESH[stage]}, radial-gradient(ellipse 50% 50% at 50% 50%, #fff0f530 0%, transparent 70%), var(--bg)`,
          transition: 'background 1.2s var(--ease-soft)',
        }}
      />

      {/* Ambient orbs */}
      {ORB_CONFIGS.map((orb, index) => (
        <DriftingOrb
          key={index}
          config={orb}
          targetOpacity={config.orbOpacity}
          targetSize={config.orbSize}
        />
      ))}

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(247,85,144,0.12) 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(to top, rgba(255,240,245,0.65) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}

// ─── DriftingOrb ─────────────────────────────────────────────────────────────

interface DriftingOrbProps {
  config: OrbConfig;
  targetOpacity: number;
  targetSize: number;
}

function DriftingOrb({ config, targetOpacity, targetSize }: DriftingOrbProps) {
  const orbRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={orbRef}
      className="absolute rounded-full"
      style={{
        left: config.x,
        top: config.y,
        width: targetSize,
        height: targetSize,
        marginLeft: -targetSize / 2,
        marginTop: -targetSize / 2,
        background: `radial-gradient(circle, ${config.color} 0%, transparent 70%)`,
        filter: `blur(${config.blur}px)`,
        willChange: 'transform, opacity',
      }}
      animate={{
        opacity: [
          targetOpacity * 0.6,
          targetOpacity,
          targetOpacity * 0.8,
          targetOpacity * 1.1,
          targetOpacity * 0.6,
        ],
        x: [0, 20, -15, 10, -5, 0],
        y: [0, -15, 20, -10, 15, 0],
        scale: [1, 1.05, 0.97, 1.03, 1],
      }}
      transition={{
        duration: config.duration,
        delay: config.delay,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    />
  );
}

export const AmbientBackground = memo(AmbientBackgroundComponent);
