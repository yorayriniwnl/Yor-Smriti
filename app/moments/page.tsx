'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ScrollReset } from '@/components/ui/ScrollReset';
import { BookmarkButton } from '@/components/ui/BookmarkButton';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface Moment {
  id: string;
  number: string;
  scene: string;
  date: string;
  accentColor: string;
  glowColor: string;
}

const MOMENTS: Moment[] = [
  {
    id: 'moment-1',
    number: '01',
    scene:
      '[Memory 1: describe a quiet ordinary moment — something small, unhurried, the two of you together with no agenda. Write it in present tense as a 3–4 sentence scene. Make it specific enough that only you would recognise it.]',
    date: '[date — placeholder]',
    accentColor: 'rgba(255, 171, 210, 0.75)',
    glowColor: 'rgba(247, 85, 144, 0.14)',
  },
  {
    id: 'moment-2',
    number: '02',
    scene:
      '[Memory 2: describe a moment she said something true — something that was honest and landed in a way you still think about. Present tense, 3–4 sentences. Specific words if you remember them.]',
    date: '[date — placeholder]',
    accentColor: 'rgba(220, 160, 255, 0.72)',
    glowColor: 'rgba(180, 100, 255, 0.12)',
  },
  {
    id: 'moment-3',
    number: '03',
    scene:
      '[Memory 3: describe the last good moment before things broke — not the break itself, just the last time everything felt like it used to. Present tense, 3–4 sentences. Write it slowly.]',
    date: '[date — placeholder]',
    accentColor: 'rgba(255, 200, 160, 0.65)',
    glowColor: 'rgba(255, 160, 80, 0.1)',
  },
];

function MomentPanel({ moment, index }: { moment: Moment; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, ease: EASE_SOFT }}
      className="relative flex min-h-dvh w-full items-center justify-center px-6"
      aria-label={`Moment ${moment.number}`}
    >
      {/* Panel ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${moment.glowColor}, transparent 65%)`,
        }}
      />

      {/* Separator line at top — except first panel */}
      {index > 0 && (
        <div
          className="absolute top-0 left-0 right-0"
          aria-hidden="true"
          style={{
            height: '1px',
            background: `linear-gradient(to right, transparent, ${moment.accentColor.replace('0.', '0.12').replace(', 0.', ', 0.12')} 40%, transparent)`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Content */}
      <div
        className="relative z-10 text-center"
        style={{ maxWidth: '52ch' }}
      >
        {/* Number + eyebrow */}
        <p
          className="mb-6 uppercase tracking-[0.24em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            color: moment.accentColor.replace('0.75', '0.48').replace('0.72', '0.48').replace('0.65', '0.42'),
          }}
        >
          moment {moment.number}
        </p>

        {/* Scene text */}
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.1rem, 2.8vw, 1.38rem)',
            lineHeight: 1.85,
            color: 'rgba(255, 236, 246, 0.88)',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          {moment.scene}
        </p>

        {/* Date */}
        <p
          className="mt-8"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.16em',
            color: moment.accentColor.replace('0.75', '0.36').replace('0.72', '0.36').replace('0.65', '0.32'),
            textTransform: 'lowercase',
          }}
        >
          {moment.date}
        </p>
      </div>
    </motion.section>
  );
}

export default function MomentsPage() {
  return (
    <main
      id="main-content"
      className="relative w-full"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <ScrollReset />
      <BookmarkButton title="Three Moments" />

      {/* Fixed ambient orb — top */}
      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          top: '8%',
          left: '18%',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,85,144,0.18), transparent 70%)',
          filter: 'blur(50px)',
          opacity: 0.5,
        }}
      />

      {/* Intro header — first viewport */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_SOFT }}
        className="relative z-10 flex min-h-[40vh] flex-col items-center justify-end pb-10 text-center px-6"
      >
        <p
          className="mb-3 uppercase tracking-[0.22em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 193, 223, 0.65)',
            fontSize: '0.58rem',
          }}
        >
          moments
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
          Three Moments
        </h1>

        <p
          className="mt-4"
          style={{
            fontFamily: 'var(--font-crimson)',
            color: 'rgba(255, 200, 225, 0.55)',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            lineHeight: 1.6,
            fontStyle: 'italic',
            maxWidth: '38ch',
          }}
        >
          Three scenes. Written down so they do not get away.
        </p>

        {/* Scroll hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.54rem',
            letterSpacing: '0.14em',
            color: 'rgba(255, 171, 210, 0.28)',
            textTransform: 'uppercase',
          }}
        >
          scroll ↓
        </motion.p>
      </motion.div>

      {/* The three panels */}
      {MOMENTS.map((moment, i) => (
        <MomentPanel key={moment.id} moment={moment} index={i} />
      ))}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center gap-6 pb-16 pt-10"
      >
        <div
          aria-hidden="true"
          style={{
            height: '1px',
            width: '60%',
            maxWidth: 320,
            background:
              'linear-gradient(to right, transparent, rgba(244, 173, 210, 0.2) 40%, transparent)',
          }}
        />
        <Link
          href="/hub"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'rgba(255, 171, 210, 0.32)',
            textTransform: 'uppercase',
          }}
        >
          ← back
        </Link>
      </motion.div>
    </main>
  );
}
