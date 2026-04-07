'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';
import { EASE_SOFT, MISS_ITEMS } from '@/components/experiences/director/screens/CinematicApologyScreens/shared';
import { CinematicPanel } from '@/components/experiences/director/screens/CinematicApologyScreens/components/CinematicPanel';
import { CinematicHeader } from '@/components/experiences/director/screens/CinematicApologyScreens/components/CinematicHeader';
import { ContinueControls } from '@/components/experiences/director/screens/CinematicApologyScreens/components/ContinueControls';

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
      <CinematicPanel>
        <CinematicHeader eyebrow="things i miss · still counting" title="What I Miss About You" />

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
          <ContinueControls show={showContinue} onPrev={onPrev} onNext={onNext} nextLabel="And there is more →" prevLabel="← Back" />
        </AnimatePresence>
      </CinematicPanel>
    </section>
  );
}
