'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ApologyExperienceShell } from '@/components/experiences/panda/ApologyExperienceShell';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const PROMISES = [
  { id: 'p1', text: 'I will listen. Fully. Without preparing my reply.', icon: '👂' },
  { id: 'p2', text: 'I will choose you over my pride. Every time.', icon: '🤝' },
  { id: 'p3', text: 'I will be honest even when it is uncomfortable.', icon: '💬' },
  { id: 'p4', text: 'I will show up for you the way you deserved all along.', icon: '🌹' },
];

export function Screen06MyPromises() {
  const [kept, setKept] = useState<Set<string>>(new Set());
  const allKept = kept.size === PROMISES.length;

  const toggle = (id: string) => {
    setKept((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ApologyExperienceShell
      screenNumber={6}
      totalScreens={8}
      eyebrow="Promises"
      title="My Promises"
      subtitle="Tap each one. I mean them."
      showHeader={false}
      showTopControls={false}
      panelClassName="relative w-full max-w-[26rem] overflow-hidden rounded-[2.2rem] border pb-6 pt-7"
      contentClassName="relative z-10 px-3"
    >
      <motion.div
        className="mb-5 px-1 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_SOFT }}
      >
        <p
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255, 180, 213, 0.7)',
          }}
        >
          tap each promise · i mean every word
        </p>
        <h2
          className="mt-1"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.6rem, 6vw, 2.1rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            color: 'rgba(255, 237, 248, 0.96)',
          }}
        >
          What I Promise You
        </h2>
      </motion.div>

      <div className="flex flex-col gap-2.5 px-1">
        {PROMISES.map((promise, index) => {
          const isKept = kept.has(promise.id);
          return (
            <motion.button
              key={promise.id}
              onClick={() => toggle(promise.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: EASE_SOFT }}
              className="flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left"
              style={{
                background: isKept ? 'rgba(200, 60, 130, 0.22)' : 'rgba(255, 180, 213, 0.07)',
                borderColor: isKept ? 'rgba(247, 85, 144, 0.55)' : 'rgba(255, 190, 224, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'pointer',
              }}
            >
              <motion.span
                animate={{ scale: isKept ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.35 }}
                style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}
              >
                {isKept ? '✓' : promise.icon}
              </motion.span>
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1rem',
                  lineHeight: 1.4,
                  color: isKept
                    ? 'rgba(255, 220, 240, 0.98)'
                    : 'rgba(255, 220, 240, 0.78)',
                  fontStyle: 'italic',
                }}
              >
                {promise.text}
              </p>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        className="mt-4 px-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div
          className="relative h-1 overflow-hidden rounded-full"
          style={{ background: 'rgba(255, 190, 224, 0.15)' }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            animate={{ width: `${(kept.size / PROMISES.length) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE_SOFT }}
            style={{
              background:
                'linear-gradient(90deg, rgba(232, 80, 153, 0.8), rgba(255, 133, 179, 0.9))',
            }}
          />
        </div>
        <p
          className="mt-1.5 text-right"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.06em',
            color: 'rgba(255, 195, 225, 0.55)',
          }}
        >
          {kept.size}/{PROMISES.length} acknowledged
        </p>
      </motion.div>

      <AnimatePresence>
        {allKept ? (
          <motion.div
            className="mt-4 flex items-center justify-between gap-3 px-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_SOFT }}
          >
            <Link
              href="/apology/5"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255, 195, 225, 0.6)',
                textDecoration: 'none',
              }}
            >
              ← Back
            </Link>

            <Link
              href="/apology/7"
              className="rounded-full px-5 py-2.5"
              style={{
                background:
                  'linear-gradient(90deg, rgba(232, 80, 153, 0.92), rgba(200, 60, 130, 0.92))',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                boxShadow: '0 8px 22px rgba(232, 80, 153, 0.35)',
                textDecoration: 'none',
              }}
            >
              A Letter For You →
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ApologyExperienceShell>
  );
}
