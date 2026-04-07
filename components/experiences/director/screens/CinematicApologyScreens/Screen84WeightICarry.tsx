'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';
import { EASE_SOFT, WEIGHT_LINES } from '@/components/experiences/director/screens/CinematicApologyScreens/shared';
import { CinematicPanel } from '@/components/experiences/director/screens/CinematicApologyScreens/components/CinematicPanel';
import { CinematicHeader } from '@/components/experiences/director/screens/CinematicApologyScreens/components/CinematicHeader';
import { ContinueControls } from '@/components/experiences/director/screens/CinematicApologyScreens/components/ContinueControls';

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
      <CinematicPanel
        topDecoration={
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
        }
      >
        <div className="relative z-10 px-5">
          <CinematicHeader eyebrow="what i owe you" />

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
            <ContinueControls show={showContinue} onPrev={onPrev} onNext={onNext} nextLabel="My promises →" prevLabel="← Back" />
          </AnimatePresence>
        </div>
      </CinematicPanel>
    </section>
  );
}
