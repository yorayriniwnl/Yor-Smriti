'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

// ─── GrainOverlay ─────────────────────────────────────────────────────────────
// Applies a subtle film grain texture over the entire experience
// Uses an SVG feTurbulence filter for performance

interface GrainOverlayProps {
  opacity?: number;
  intensity?: 'light' | 'medium' | 'heavy';
  animated?: boolean;
}

const INTENSITY_MAP = {
  light:  { opacity: 0.25, baseFrequency: '0.80' },
  medium: { opacity: 0.38, baseFrequency: '0.85' },
  heavy:  { opacity: 0.50, baseFrequency: '0.90' },
};

function GrainOverlayComponent({
  opacity,
  intensity = 'medium',
  animated = true,
}: GrainOverlayProps) {
  const config = INTENSITY_MAP[intensity];
  const finalOpacity = opacity ?? config.opacity;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      style={{ opacity: finalOpacity }}
    >
      {/* SVG Grain */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={config.baseFrequency}
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#grain-filter)"
          opacity="1"
        />
      </svg>

      {/* Animated grain shift layer */}
      {animated && (
        <motion.div
          className="absolute inset-[-50%] h-[200%] w-[200%]"
          animate={{
            x: [0, -10, 8, -5, 12, -8, 0],
            y: [0, 8, -5, 12, -8, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
          }}
        />
      )}
    </div>
  );
}

export const GrainOverlay = memo(GrainOverlayComponent);
