import { useRef } from 'react';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/transitions/TextReveal';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';
import { useEmotionalScrollResistance } from '../hooks';
import { LETTER_PAGE_ALIGNMENT, STORY_HINT_FRAGMENTS } from '../constants';
import { resolveLetterGhostLines } from '../utils';

export function LetterPageCard({
  screen,
  line,
  emotion,
}: {
  screen: number;
  line: string;
  emotion: ExperienceScreenProps['emotion'];
}) {
  const letterScrollRef = useRef<HTMLDivElement | null>(null);
  useEmotionalScrollResistance(letterScrollRef, 0.4);
  const alignment = LETTER_PAGE_ALIGNMENT[screen] ?? 'center';
  const ghostLines = resolveLetterGhostLines(screen);
  const textAlignClass =
    alignment === 'left'
      ? 'text-left'
      : alignment === 'right'
      ? 'text-right'
      : 'text-center';

  return (
    <section className="relative">
      <motion.div
        className="pointer-events-none absolute -inset-6"
        aria-hidden="true"
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(255, 214, 166, 0.22), transparent 58%)',
        }}
      />

      <motion.article
        className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-[#f3d9b6]/45 bg-[#f1ddc3]/92 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.42)]"
        initial={{ opacity: 0, y: 16, scale: 0.985, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(106, 75, 40, 0.06) 0px, rgba(106, 75, 40, 0.06) 1px, transparent 1px, transparent 24px), radial-gradient(circle at 12% 8%, rgba(255,255,255,0.55), transparent 34%), radial-gradient(circle at 88% 90%, rgba(184,133,79,0.18), transparent 44%)',
          }}
        />

        <div
          ref={letterScrollRef}
          className="emotional-scroll relative max-h-[46vh] overflow-y-auto rounded-[1.45rem] border border-[#b08960]/36 bg-[#f6e9d4]/86 p-6"
          data-nav-ignore="true"
        >
          <motion.div
            className="pointer-events-none absolute bottom-4 right-3 top-4 w-px"
            aria-hidden="true"
            animate={{ opacity: [0.08, 0.2, 0.1] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:
                'linear-gradient(180deg, rgba(95, 64, 36, 0), rgba(95, 64, 36, 0.26), rgba(95, 64, 36, 0))',
            }}
          />

          <p
            className={`uppercase tracking-[0.14em] ${textAlignClass}`}
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.64rem',
              color: 'rgba(89, 57, 31, 0.72)',
            }}
          >
            Page {screen - 100} / 5
          </p>

          {ghostLines.length > 0 ? (
            <div className="mt-3 space-y-1" aria-hidden="true">
              {ghostLines.map((ghostLine, ghostIndex) => (
                <p
                  key={`ghost-line-${screen}-${ghostIndex}`}
                  className={textAlignClass}
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: 'clamp(0.86rem,2.1vw,0.95rem)',
                    color: 'rgba(89, 57, 31, 0.34)',
                    filter: 'blur(0.55px)',
                    transform: `translateY(${ghostIndex * 1.5}px)`,
                  }}
                >
                  {ghostLine}
                </p>
              ))}
            </div>
          ) : null}

          <TextReveal
            text={line}
            emotion={emotion}
            mode="typewriter"
            speedMs={24}
            className={`mt-3 ${textAlignClass} text-[clamp(1.2rem,3.2vw,1.74rem)] leading-relaxed text-[#3f2a19]`}
          />

          <p
            className={`mt-5 ${textAlignClass}`}
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
              color: 'rgba(82, 55, 35, 0.58)',
              filter: 'blur(0.3px)',
            }}
          >
            {STORY_HINT_FRAGMENTS[(screen - 101) % STORY_HINT_FRAGMENTS.length]}
          </p>
        </div>
      </motion.article>
    </section>
  );
}
