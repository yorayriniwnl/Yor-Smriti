'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ScrollReset } from '@/components/ui/ScrollReset';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { BookmarkButton } from '@/components/ui/BookmarkButton';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface Confession {
  id: string;
  text: string;
  timestamp: string;
}

const CONFESSIONS: Confession[] = [
  {
    id: 'c1',
    text: 'I was afraid to need you as much as I did.',
    timestamp: 'sometime in the first year',
  },
  {
    id: 'c2',
    text: 'When you went quiet, I assumed the worst and never asked what was actually wrong.',
    timestamp: 'too many nights to count',
  },
  {
    id: 'c3',
    text: 'I noticed every small thing you did for me. I just never said so. I kept it inside like it was mine to keep.',
    timestamp: 'every ordinary day',
  },
  {
    id: 'c4',
    text: 'There were moments I wanted to stop everything and say — I am so glad you exist. I changed the subject instead.',
    timestamp: 'more than once',
  },
  {
    id: 'c5',
    text: 'I was proud of you. In ways I did not know how to say without it coming out wrong. So I said nothing.',
    timestamp: 'every time you did something brave',
  },
  {
    id: 'c6',
    text: 'Sometimes when you laughed I thought: this is what I want. Right here. And then I let the moment pass without holding it.',
    timestamp: 'the last good night, and the ones before it',
  },
  {
    id: 'c7',
    text: 'I was scared that if I loved you the way I actually wanted to, I would become someone who could not function without you.',
    timestamp: 'every time I pulled away',
  },
  {
    id: 'c8',
    text: 'I should have fought harder. Not for the last word — for you. For us. I did not know how. That is the truth.',
    timestamp: 'the end',
  },
];

function ConfessionItem({ confession, index }: { confession: Confession; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.04, ease: EASE_SOFT }}
      className="relative py-10"
      style={{
        borderBottom: 'none',
      }}
    >
      {/* Faint rule above each item */}
      <div
        aria-hidden="true"
        style={{
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(244, 173, 210, 0.18) 30%, rgba(244, 173, 210, 0.18) 70%, transparent)',
          marginBottom: '2.5rem',
        }}
      />

      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.15rem, 2.8vw, 1.45rem)',
          lineHeight: 1.75,
          color: 'rgba(255, 236, 246, 0.92)',
          fontWeight: 400,
          maxWidth: '52ch',
        }}
      >
        {confession.text}
      </p>

      <p
        className="mt-4"
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.14em',
          color: 'rgba(255, 171, 210, 0.38)',
          textTransform: 'lowercase',
        }}
      >
        {confession.timestamp}
      </p>
    </motion.div>
  );
}

export default function UnsaidPage() {
  useEffect(() => {
    // no tracking needed — this page is for reading only
  }, []);

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
      <ReadingProgress />
      <BookmarkButton title="Things I Never Said" />

      {/* Ambient orb — top left */}
      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          top: '8%',
          left: '12%',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,85,144,0.2), transparent 70%)',
          filter: 'blur(48px)',
          opacity: 0.6,
        }}
      />

      {/* Centered content column */}
      <div
        className="relative z-10 mx-auto px-6"
        style={{ maxWidth: 620, paddingTop: '10vh', paddingBottom: '16vh' }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_SOFT }}
          className="mb-16"
        >
          <p
            className="mb-3 uppercase tracking-[0.22em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              color: 'rgba(255, 193, 223, 0.65)',
              fontSize: '0.58rem',
            }}
          >
            confessions
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
            Things I Never Said
          </h1>

          <p
            className="mt-4"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'rgba(255, 200, 225, 0.6)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}
          >
            I kept these inside because I did not know how to let them out.<br />
            They lived with me the entire time.
          </p>
        </motion.div>

        {/* Confession items */}
        <div>
          {CONFESSIONS.map((confession, i) => (
            <ConfessionItem key={confession.id} confession={confession} index={i} />
          ))}
        </div>

        {/* Final line */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.2, ease: EASE_SOFT }}
          className="pt-16 pb-4"
        >
          <div
            aria-hidden="true"
            style={{
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(247, 85, 144, 0.3) 40%, rgba(247, 85, 144, 0.3) 60%, transparent)',
              marginBottom: '2.5rem',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
              color: 'rgba(247, 130, 175, 0.88)',
              lineHeight: 1.6,
            }}
          >
            I am saying them now.
          </p>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-14"
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
