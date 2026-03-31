'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';
import { EASE_SOFT, WEIGHT_LINES } from '@/components/experiences/director/screens/CinematicApologyScreens/shared';

export function Screen84WeightICarry({ onNext, onPrev }: ExperienceScreenProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showContinue, setShowContinue] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;

    WEIGHT_LINES.forEach((line) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.id]);
      }, line.delay * 1000);
      timers.push(timer);
    });

    const doneTimer = setTimeout(() => setShowContinue(true), 7200);
    timers.push(doneTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[26rem]" data-nav-ignore="true">
      <div
        className="relative overflow-hidden rounded-[2.2rem] border pb-6 pt-8"
        style={{
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow: '0 36px 74px rgba(0, 0, 0, 0.46), 0 16px 34px rgba(247, 85, 144, 0.16)',
        }}
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

        <div className="relative z-10 px-5">
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
              {WEIGHT_LINES.map((line) =>
                visibleLines.includes(line.id) ? (
                  <motion.p
                    key={line.id}
                    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.3, ease: EASE_SOFT }}
                    style={{
                      fontFamily: line.emphasis ? 'var(--font-cormorant)' : 'var(--font-crimson)',
                      fontSize: line.emphasis
                        ? 'clamp(1.3rem, 5vw, 1.7rem)'
                        : 'clamp(1rem, 3.5vw, 1.2rem)',
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
                ) : null,
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
                    color: 'rgba(255, 195, 225, 0.6)',
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
                  My promises →
                </motion.button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
