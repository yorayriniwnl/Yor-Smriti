'use client';

import { memo, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
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
    color: 'rgba(201, 169, 110, 1)',
    blur: 120,
    delay: 0,
    duration: 14,
  },
  {
    x: '65%',
    y: '55%',
    size: 360,
    color: 'rgba(160, 100, 60, 1)',
    blur: 100,
    delay: 3,
    duration: 18,
  },
  {
    x: '40%',
    y: '70%',
    size: 300,
    color: 'rgba(80, 60, 40, 1)',
    blur: 90,
    delay: 6,
    duration: 22,
  },
];

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
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #141210 0%, #0d0c0a 70%)' }}
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
            'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(to top, rgba(13,12,10,0.8) 0%, transparent 100%)',
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
