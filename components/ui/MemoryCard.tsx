'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { memoryCardVariants, memoryCaptionVariants } from '@/lib/animations';
import type { Memory } from '@/types';
import { buildGradientCSS } from '@/lib/messages';

// ─── MemoryCard ───────────────────────────────────────────────────────────────

interface MemoryCardProps {
  memory: Memory;
  isVisible: boolean;
}

export const MemoryCard = memo(function MemoryCard({
  memory,
  isVisible,
}: MemoryCardProps) {
  if (!isVisible) return null;

  const gradient = buildGradientCSS(memory.gradient);

  return (
    <motion.div
      key={memory.id}
      variants={memoryCardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full"
      style={{ maxWidth: 'min(420px, 90vw)' }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-sm"
        style={{
          aspectRatio: '4 / 3',
          background: gradient,
        }}
      >
        {/* Subtle inner texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.03) 2px,
                rgba(0,0,0,0.03) 4px
              )
            `,
          }}
        />

        {/* Light leak top-right */}
        <div
          className="absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,230,180,0.8) 0%, transparent 70%)',
          }}
        />

        {/* Soft vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        {/* Bottom gradient for text */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/3"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          }}
        />

        {/* Grain on card */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '150px',
          }}
        />

        {/* Caption text */}
        <motion.div
          variants={memoryCaptionVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-0 left-0 right-0 p-6"
        >
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(1.05rem, 2.2vw, 1.4rem)',
              color: 'rgba(230, 220, 205, 0.95)',
              lineHeight: 1.4,
              textShadow: '0 1px 8px rgba(0,0,0,0.6)',
            }}
          >
            {memory.caption}
          </p>
          {memory.subCaption && (
            <p
              className="mt-1"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontWeight: 300,
                fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                color: 'rgba(200, 190, 175, 0.65)',
                letterSpacing: '0.02em',
              }}
            >
              {memory.subCaption}
            </p>
          )}
        </motion.div>

        {/* Top-left timestamp-like decoration */}
        <div
          className="absolute left-4 top-4"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.1em',
            color: 'rgba(200, 190, 175, 0.35)',
          }}
        >
          ◦
        </div>
      </div>

      {/* Subtle frame shadow */}
      <div
        className="absolute inset-0 rounded-sm"
        style={{
          boxShadow: '0 0 0 1px rgba(201,169,110,0.06), 0 20px 60px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
});
