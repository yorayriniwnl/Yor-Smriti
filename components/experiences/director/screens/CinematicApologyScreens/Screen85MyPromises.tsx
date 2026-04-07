'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';
import { EASE_SOFT, PROMISES } from '@/components/experiences/director/screens/CinematicApologyScreens/shared';
import { CinematicPanel } from '@/components/experiences/director/screens/CinematicApologyScreens/components/CinematicPanel';
import { CinematicHeader } from '@/components/experiences/director/screens/CinematicApologyScreens/components/CinematicHeader';
import { ContinueControls } from '@/components/experiences/director/screens/CinematicApologyScreens/components/ContinueControls';

export function Screen85MyPromises({ onNext, onPrev }: ExperienceScreenProps) {
  const [kept, setKept] = useState<Set<string>>(new Set());
  const allKept = kept.size === PROMISES.length;

  const toggle = useCallback((id: string) => {
    setKept((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <section className="mx-auto w-full max-w-[26rem]" data-nav-ignore="true">
      <CinematicPanel>
        <CinematicHeader eyebrow="tap each promise · i mean every word" title="What I Promise You" />

        <div className="flex flex-col gap-2.5 px-4">
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
                    color: isKept ? 'rgba(255, 220, 240, 0.98)' : 'rgba(255, 220, 240, 0.78)',
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
          className="mt-4 px-4"
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
          <ContinueControls show={allKept} onPrev={onPrev} onNext={onNext} nextLabel="A letter for you →" prevLabel="← Back" />
        </AnimatePresence>
      </CinematicPanel>
    </section>
  );
}
