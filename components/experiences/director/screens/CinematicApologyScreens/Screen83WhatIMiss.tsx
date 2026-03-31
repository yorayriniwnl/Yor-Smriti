'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';
import { EASE_SOFT, MISS_ITEMS } from '@/components/experiences/director/screens/CinematicApologyScreens/shared';

export function Screen83WhatIMiss({ onNext, onPrev }: ExperienceScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    MISS_ITEMS.forEach((item) => {
      const timer = setTimeout(() => {
        setVisibleCount((count) => Math.min(count + 1, MISS_ITEMS.length));
      }, item.delay * 1000 + 400);
      timers.push(timer);
    });

    const doneTimer = setTimeout(() => setShowContinue(true), 4600);
    timers.push(doneTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[26rem]" data-nav-ignore="true">
      <div
        className="relative overflow-hidden rounded-[2.2rem] border pb-6 pt-7"
        style={{
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow: '0 36px 74px rgba(0, 0, 0, 0.46), 0 16px 34px rgba(247, 85, 144, 0.16)',
        }}
      >
        <motion.div
          className="mb-4 px-4 text-center"
          initial={{ opacity: 0, y: 10 }}
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

        <div className="flex flex-col gap-2.5 px-4">
          <AnimatePresence>
            {MISS_ITEMS.slice(0, visibleCount).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -18, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.65, ease: EASE_SOFT }}
                className="flex items-start gap-3 rounded-2xl border px-4 py-3"
                style={{
                  background: item.color,
                  borderColor: 'rgba(255, 190, 224, 0.22)',
                }}
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1.05rem',
                      lineHeight: 1.35,
                      color: 'rgba(255, 242, 250, 0.95)',
                      fontStyle: 'italic',
                    }}
                  >
                    {item.text}
                  </p>

                  {item.sub ? (
                    <p
                      className="mt-0.5"
                      style={{
                        fontFamily: 'var(--font-dm-mono)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.04em',
                        color: 'rgba(255, 200, 228, 0.72)',
                      }}
                    >
                      {item.sub}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleCount < MISS_ITEMS.length ? (
            <motion.div className="flex items-center gap-1.5 px-4 py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
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
              className="mt-6 flex items-center justify-between gap-3 px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_SOFT }}
            >
              <motion.button
                type="button"
                onClick={onPrev}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 195, 225, 0.68)',
                }}
              >
                ← Back
              </motion.button>

              <motion.button
                type="button"
                onClick={onNext}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
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
                }}
              >
                And there is more →
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
