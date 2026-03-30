'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ApologyExperienceShell } from '@/components/experiences/panda/ApologyExperienceShell';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function Screen87ComeBack() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [taps, setTaps] = useState(0);
  const nextHeartIdRef = useRef(1);
  const removalTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = removalTimersRef.current;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const spawnHearts = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    const startId = nextHeartIdRef.current;
    nextHeartIdRef.current += 6;

    const newHearts: Heart[] = Array.from({ length: 6 }, (_, i) => ({
      id: startId + i,
      x: cx + (Math.random() - 0.5) * 60,
      y: cy,
      size: 0.8 + Math.random() * 0.6,
    }));

    setHearts((prev) => [...prev, ...newHearts]);
    setTaps((t) => t + 1);
    const removeTimer = setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((n) => n.id === h.id)));
    }, 1400);

    removalTimersRef.current.push(removeTimer);
  }, []);

  const message =
    taps === 0
      ? 'Tap to send love'
      : taps < 4
        ? 'Keep going…'
        : taps < 8
          ? 'I feel it ♡'
          : 'Thank you for everything.';

  return (
    <ApologyExperienceShell
      screenNumber={87}
      totalScreens={87}
      eyebrow="Come Back"
      title="Come Back To Me"
      subtitle="If you want to."
      showHeader={false}
      showTopControls={false}
      panelClassName="relative w-full max-w-[26rem] overflow-hidden rounded-[2.2rem] border pb-7 pt-8"
      contentClassName="relative z-10 px-4"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        aria-hidden
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(247, 85, 144, 0.3), transparent)',
        }}
      />

      <div className="relative flex flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE_SOFT }}
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
            the last thing i want to say
          </p>
          <h2
            className="mt-2"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2rem, 7vw, 2.8rem)',
              fontWeight: 700,
              lineHeight: 1.08,
              color: 'rgba(255, 237, 248, 0.97)',
            }}
          >
            Come Back To Me.
          </h2>
          <p
            className="mt-2"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: '1rem',
              fontStyle: 'italic',
              lineHeight: 1.5,
              color: 'rgba(255, 210, 234, 0.82)',
            }}
          >
            No pressure. No deadline. Just - whenever you are ready.
          </p>
        </motion.div>

        <motion.div
          className="relative flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: EASE_SOFT }}
        >
          <button
            onClick={spawnHearts}
            aria-label="Send love"
            className="relative flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background:
                'linear-gradient(135deg, rgba(247, 85, 144, 0.25), rgba(220, 50, 120, 0.15))',
              border: '1.5px solid rgba(247, 85, 144, 0.45)',
              cursor: 'pointer',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontSize: '2.8rem',
                color: 'rgba(247, 85, 144, 0.92)',
                filter: 'drop-shadow(0 6px 14px rgba(247, 85, 144, 0.4))',
                lineHeight: 1,
              }}
            >
              ♡
            </motion.span>

            <AnimatePresence>
              {hearts.map((heart) => (
                <motion.span
                  key={heart.id}
                  aria-hidden
                  initial={{ opacity: 1, y: 0, x: heart.x - 48, scale: heart.size }}
                  animate={{ opacity: 0, y: -70, scale: heart.size * 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.3, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: heart.y - 12,
                    fontSize: '1.2rem',
                    color: 'rgba(247, 85, 144, 0.85)',
                    pointerEvents: 'none',
                  }}
                >
                  ♡
                </motion.span>
              ))}
            </AnimatePresence>
          </button>

          <AnimatePresence mode="wait">
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255, 195, 225, 0.7)',
              }}
            >
              {message}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="flex w-full flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1.2 }}
        >
          <Link
            href="/"
            className="w-full rounded-full py-3 text-center"
            style={{
              background:
                'linear-gradient(90deg, rgba(232, 80, 153, 0.92), rgba(200, 60, 130, 0.92))',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#fff',
              boxShadow: '0 10px 26px rgba(232, 80, 153, 0.35)',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            Return Home
          </Link>
          <Link
            href="/apology/80"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255, 195, 225, 0.5)',
              textDecoration: 'none',
            }}
          >
            Read from the beginning
          </Link>
        </motion.div>
      </div>
    </ApologyExperienceShell>
  );
}
