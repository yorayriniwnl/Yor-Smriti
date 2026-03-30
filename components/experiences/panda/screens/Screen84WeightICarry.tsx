'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ApologyExperienceShell } from '@/components/experiences/panda/ApologyExperienceShell';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const LINES = [
  { id: 'l1', text: 'I chose silence when you needed words.', delay: 0.6 },
  { id: 'l2', text: 'I made you feel small. That was never okay.', delay: 1.8 },
  { id: 'l3', text: 'I let my ego sit where my love should have been.', delay: 3.2 },
  {
    id: 'l4',
    text: 'That is the weight I carry now. Every single day.',
    delay: 4.8,
    emphasis: true,
  },
];

export function Screen84WeightICarry() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showContinue, setShowContinue] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    LINES.forEach((line) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.id]);
      }, line.delay * 1000);
      timers.push(timer);
    });
    const timer = setTimeout(() => setShowContinue(true), 7200);
    timers.push(timer);
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <ApologyExperienceShell
      screenNumber={84}
      totalScreens={87}
      eyebrow="The Truth"
      title="The Weight I Carry"
      subtitle="No more hiding from it."
      showHeader={false}
      showTopControls={false}
      panelClassName="relative w-full max-w-[26rem] overflow-hidden rounded-[2.2rem] border pb-6 pt-8"
      contentClassName="relative z-10 px-4"
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 rounded-full"
        aria-hidden
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(247, 85, 144, 0.4), transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <motion.p
          className="mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255, 160, 200, 0.7)',
          }}
        >
          what i owe you
        </motion.p>

        <div className="flex flex-col gap-5">
          <AnimatePresence>
            {LINES.map((line) =>
              visibleLines.includes(line.id) ? (
                <motion.p
                  key={line.id}
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.3, ease: EASE_SOFT }}
                  style={{
                    fontFamily: line.emphasis ? 'var(--font-cormorant)' : 'var(--font-crimson)',
                    fontSize: line.emphasis ? 'clamp(1.3rem, 5vw, 1.7rem)' : 'clamp(1rem, 3.5vw, 1.2rem)',
                    fontStyle: 'italic',
                    lineHeight: 1.45,
                    color: line.emphasis
                      ? 'rgba(255, 175, 210, 0.98)'
                      : 'rgba(255, 230, 242, 0.88)',
                    fontWeight: line.emphasis ? 600 : 400,
                    borderLeft: line.emphasis ? '2px solid rgba(247, 85, 144, 0.6)' : 'none',
                    paddingLeft: line.emphasis ? '0.75rem' : '0',
                  }}
                >
                  {line.text}
                </motion.p>
              ) : null
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showContinue ? (
            <motion.div
              className="mt-8 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: EASE_SOFT }}
            >
              <Link
                href="/apology/83"
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
                href="/apology/85"
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
                My Promises →
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ApologyExperienceShell>
  );
}
