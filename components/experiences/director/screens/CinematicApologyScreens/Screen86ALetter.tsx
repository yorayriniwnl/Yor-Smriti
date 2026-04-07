'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';
import { EASE_SOFT, LETTER_PARAGRAPHS } from '@/components/experiences/director/screens/CinematicApologyScreens/shared';
import { CinematicPanel } from '@/components/experiences/director/screens/CinematicApologyScreens/components/CinematicPanel';
import { ContinueControls } from '@/components/experiences/director/screens/CinematicApologyScreens/components/ContinueControls';

export function Screen86ALetter({ onNext, onPrev }: ExperienceScreenProps) {
  const [allRevealed, setAllRevealed] = useState(false);

  return (
    <section className="mx-auto w-full max-w-[26rem]" data-nav-ignore="true">
      <CinematicPanel>
        <motion.div
          className="relative mx-4 rounded-xl border px-5 py-5"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
          style={{
            background: 'rgba(255, 248, 252, 0.06)',
            borderColor: 'rgba(255, 190, 220, 0.18)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-5 inset-y-5" aria-hidden>
            {[...Array(8)].map((_, index) => (
              <div
                key={`line-${index}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${index * 14.28}%`,
                  height: '1px',
                  background: 'rgba(255, 180, 215, 0.07)',
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col gap-3.5">
            {LETTER_PARAGRAPHS.map((paragraph, index) => (
              <motion.p
                key={paragraph.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, delay: paragraph.delay, ease: EASE_SOFT }}
                onAnimationComplete={() => {
                  if (index === LETTER_PARAGRAPHS.length - 1) {
                    setAllRevealed(true);
                  }
                }}
                style={{
                  fontFamily:
                    paragraph.style === 'salutation' || paragraph.style === 'signature'
                      ? 'var(--font-cormorant)'
                      : 'var(--font-crimson)',
                  fontSize:
                    paragraph.style === 'salutation'
                      ? '1.4rem'
                      : paragraph.style === 'signature'
                      ? '1.1rem'
                      : '0.97rem',
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                  color: paragraph.style
                    ? 'rgba(255, 210, 236, 0.96)'
                    : 'rgba(255, 230, 244, 0.88)',
                  fontWeight: paragraph.style === 'salutation' ? 600 : 400,
                  whiteSpace: 'pre-line',
                }}
              >
                {paragraph.text}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <ContinueControls show={allRevealed} onPrev={onPrev} onNext={onNext} nextLabel="The final moment →" prevLabel="← Back" />
      </CinematicPanel>
    </section>
  );
}
