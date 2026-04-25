'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ScrollReset } from '@/components/ui/ScrollReset';
import { BookmarkButton } from '@/components/ui/BookmarkButton';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface MissItem {
  id: string;
  text: string;
  // visual weight for layout variety — affects card padding / font size slightly
  size: 'sm' | 'md' | 'lg';
}

const MISS_ITEMS: MissItem[] = [
  {
    id: 'm1',
    text: 'The way you would re-read a message two or three times before sending it, like the words had to be exactly right.',
    size: 'lg',
  },
  {
    id: 'm2',
    text: 'How you held your phone when you were reading something you cared about — both hands, slightly tilted toward you.',
    size: 'md',
  },
  {
    id: 'm3',
    text: 'The specific pause before you laughed at something that genuinely caught you off guard.',
    size: 'sm',
  },
  {
    id: 'm4',
    text: 'The way you explained things you loved — you went slower, more careful, like you were afraid I would miss something important.',
    size: 'lg',
  },
  {
    id: 'm5',
    text: 'Your version of a compliment — oblique, honest, never trying too hard.',
    size: 'sm',
  },
  {
    id: 'm6',
    text: 'How you could sit in a quiet room and not feel the need to fill it.',
    size: 'md',
  },
  {
    id: 'm7',
    text: 'The sound of you typing — focused, quick, a little impatient.',
    size: 'sm',
  },
  {
    id: 'm8',
    text: 'The way you called me out, gently but without softening it, when I was being avoidant.',
    size: 'lg',
  },
  {
    id: 'm9',
    text: 'How seriously you took small decisions — like they all mattered equally.',
    size: 'sm',
  },
  {
    id: 'm10',
    text: 'That one thing you said about not wanting to waste good moments by performing them.',
    size: 'md',
  },
  {
    id: 'm11',
    text: 'The specific warmth of you being in a good mood — it changed the whole room.',
    size: 'md',
  },
  {
    id: 'm12',
    text: 'The way you noticed things other people walked past.',
    size: 'sm',
  },
];

const SIZE_STYLES: Record<MissItem['size'], { py: string; fontSize: string; lineHeight: number }> = {
  sm: { py: '1.4rem', fontSize: 'clamp(0.88rem, 2vw, 0.96rem)', lineHeight: 1.6 },
  md: { py: '1.7rem', fontSize: 'clamp(0.92rem, 2.1vw, 1.02rem)', lineHeight: 1.65 },
  lg: { py: '2rem', fontSize: 'clamp(0.95rem, 2.3vw, 1.08rem)', lineHeight: 1.7 },
};

function MissCard({ item, index }: { item: MissItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const style = SIZE_STYLES[item.size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.75, delay: index * 0.05, ease: EASE_SOFT }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        animate={{
          boxShadow: hovered
            ? '0 16px 40px rgba(0,0,0,0.55), 0 6px 18px rgba(247,85,144,0.28)'
            : '0 8px 24px rgba(0,0,0,0.38), 0 2px 8px rgba(247,85,144,0.08)',
          borderColor: hovered
            ? 'rgba(247, 150, 200, 0.44)'
            : 'rgba(244, 173, 210, 0.18)',
          y: hovered ? -3 : 0,
        }}
        transition={{ duration: 0.35, ease: EASE_SOFT }}
        className="relative overflow-hidden rounded-[1.25rem] border"
        style={{
          background: 'linear-gradient(160deg, rgba(38, 12, 28, 0.92) 0%, rgba(16, 6, 14, 0.97) 100%)',
          padding: `${style.py} 1.4rem`,
        }}
      >
        {/* Pink glow overlay on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background:
              'radial-gradient(ellipse at 30% 30%, rgba(255, 150, 200, 0.1), transparent 60%)',
          }}
          aria-hidden="true"
        />

        <p
          style={{
            fontFamily: 'var(--font-crimson)',
            color: hovered ? 'rgba(255, 236, 246, 0.95)' : 'rgba(255, 210, 235, 0.78)',
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            transition: 'color 0.35s ease',
            position: 'relative',
          }}
        >
          {item.text}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function MissPage() {
  return (
    <main
      id="main-content"
      className="relative min-h-dvh w-full"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <ScrollReset />
      <BookmarkButton title="What I Miss About You" />

      {/* Ambient orbs */}
      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          top: '5%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,85,144,0.18), transparent 70%)',
          filter: 'blur(52px)',
          opacity: 0.55,
        }}
      />
      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          bottom: '15%',
          left: '8%',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,130,255,0.16), transparent 70%)',
          filter: 'blur(44px)',
          opacity: 0.45,
        }}
      />

      <div
        className="relative z-10 mx-auto px-5"
        style={{ maxWidth: 760, paddingTop: '10vh', paddingBottom: '14vh' }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_SOFT }}
          className="mb-12 text-center"
        >
          <p
            className="mb-3 uppercase tracking-[0.22em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              color: 'rgba(255, 193, 223, 0.65)',
              fontSize: '0.58rem',
            }}
          >
            missing
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: 'rgba(255, 236, 246, 0.97)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1.1,
              fontWeight: 400,
            }}
          >
            What I Miss About You
          </h1>

          <p
            className="mx-auto mt-4"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'rgba(255, 200, 225, 0.58)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              lineHeight: 1.6,
              fontStyle: 'italic',
              maxWidth: '40ch',
            }}
          >
            Not the idea of you. The specific, irreplaceable, only-you details.
          </p>
        </motion.div>

        {/* Masonry-style grid — two column on larger screens */}
        <div
          className="columns-1 sm:columns-2 gap-4"
          style={{ columnGap: '1rem' }}
        >
          {MISS_ITEMS.map((item, i) => (
            <div key={item.id} className="break-inside-avoid mb-4">
              <MissCard item={item} index={i} />
            </div>
          ))}
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-14 text-center"
        >
          <Link
            href="/hub"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              color: 'rgba(255, 171, 210, 0.35)',
              textTransform: 'uppercase',
            }}
          >
            ← back
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
