'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ApologyExperienceShell } from '@/components/experiences/panda/ApologyExperienceShell';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const MISS_ITEMS = [
  {
    id: 'miss-1',
    title: 'Your late-night check-ins.',
    detail: 'The small "did you eat?" messages that felt like home.',
    glow: 'rgba(200, 160, 220, 0.2)',
  },
  {
    id: 'miss-2',
    title: 'The way you say my name.',
    detail: 'No one else sounds like safety when they say it.',
    glow: 'rgba(255, 186, 142, 0.19)',
  },
  {
    id: 'miss-3',
    title: 'Our music and our pauses.',
    detail: 'Even silence was warm when it was with you.',
    glow: 'rgba(144, 202, 255, 0.19)',
  },
  {
    id: 'miss-4',
    title: 'Your stubborn little smile.',
    detail: 'Especially when you try to hide it and fail.',
    glow: 'rgba(255, 168, 196, 0.21)',
  },
  {
    id: 'miss-5',
    title: 'You, near me, being you.',
    detail: 'That is still my favorite feeling in this world.',
    glow: 'rgba(255, 214, 152, 0.18)',
  },
];

export function Screen83WhatIMiss() {
  const [visibleCount, setVisibleCount] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = MISS_ITEMS.map((_, index) =>
      setTimeout(() => {
        setVisibleCount(index + 1);
      }, 460 + index * 620)
    );

    timersRef.current = timers;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const showContinue = visibleCount >= MISS_ITEMS.length;

  return (
    <ApologyExperienceShell
      screenNumber={83}
      totalScreens={87}
      eyebrow="What I Miss"
      title="Things I Miss About You"
      subtitle="A list that keeps growing every day."
      footer="You are still the center of my softest thoughts."
      showHeader={false}
      showTopControls={false}
      panelClassName="relative w-full max-w-[26rem] overflow-hidden rounded-[2.2rem] border pb-6 pt-7"
      contentClassName="relative z-10 px-3"
    >
      <motion.div
        className="mb-4 px-1 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE_SOFT }}
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
          things i miss · still counting
        </p>
        <h2
          className="mt-1"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            color: 'rgba(255, 237, 248, 0.96)',
          }}
        >
          What I Miss About You
        </h2>
      </motion.div>

      <div className="flex flex-col gap-2.5 px-1">
        <AnimatePresence>
          {MISS_ITEMS.slice(0, visibleCount).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.62, ease: EASE_SOFT }}
              className="relative rounded-2xl border px-4 py-3"
              style={{
                background: item.glow,
                borderColor: 'rgba(255, 190, 224, 0.24)',
              }}
            >
              <span
                className="absolute right-3 top-2"
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.6rem',
                  color: 'rgba(255, 208, 231, 0.56)',
                  letterSpacing: '0.06em',
                }}
              >
                0{index + 1}
              </span>

              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.06rem',
                  lineHeight: 1.35,
                  color: 'rgba(255, 242, 250, 0.95)',
                  fontStyle: 'italic',
                }}
              >
                {item.title}
              </p>

              <p
                className="mt-0.5"
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.04em',
                  color: 'rgba(255, 200, 228, 0.72)',
                }}
              >
                {item.detail}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {!showContinue ? (
          <motion.div className="flex items-center gap-1.5 px-4 py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{ opacity: [0.2, 0.72, 0.2] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: dot * 0.2,
                  ease: 'easeInOut',
                }}
                style={{
                  display: 'block',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'rgba(255, 180, 213, 0.6)',
                }}
              />
            ))}
          </motion.div>
        ) : null}
      </div>

      <AnimatePresence>
        {showContinue ? (
          <motion.div
            className="mt-6 flex items-center justify-between gap-3 px-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SOFT }}
          >
            <Link
              href="/apology/3"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255, 195, 225, 0.68)',
                textDecoration: 'none',
              }}
            >
              Back
            </Link>

            <Link
              href="/apology/5"
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
              And There Is More
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ApologyExperienceShell>
  );
}
