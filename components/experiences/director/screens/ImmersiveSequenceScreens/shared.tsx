'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/transitions/TextReveal';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';

export const LETTER_PARAGRAPHS = [
  'I wrote this slowly because every fast word I ever used is part of what hurt us.',
  'I am done defending old versions of myself. The person writing this knows what he broke.',
  'If there is even a small chance left, I will rebuild with patience, not performance.',
  'Even if you never come back, I want you to know this apology is real.',
];

export const TIMELINE_CARDS = [
  {
    title: 'First Talk',
    detail: 'The night where time ran fast and still was not enough.',
  },
  {
    title: 'First Laugh',
    detail: 'The one where your shoulders dropped and you finally felt safe with me.',
  },
  {
    title: 'First Fight',
    detail: 'The day we chose pride before listening.',
  },
  {
    title: 'Last Silence',
    detail: 'The moment words ended but the feeling stayed.',
  },
];

export const FRAGMENT_WORDS = ['Sorry', 'Why?', 'Leave it', "It's nothing", 'Later', 'I am fine'];

export const SMALL_THINGS = ['Late night talks', 'Random laughs', 'Stupid fights'];

export const LETTER_PAGE_LINES = {
  101: 'I... missed... what your silence meant.',
  102: 'I... waited... and called it time.',
  103: 'Time... showed me everything.',
  104: 'How deeply... I hurt you.',
  105: 'How much... I lost.',
} as const;

const LETTER_PAGE_LINE_LOOKUP: Record<number, string> = LETTER_PAGE_LINES;

const LETTER_PAGE_ALIGNMENT: Record<number, 'left' | 'center' | 'right'> = {
  101: 'left',
  102: 'center',
  103: 'right',
  104: 'left',
  105: 'right',
};

export const STORY_HINT_FRAGMENTS = [
  '17 Sep 11:42 PM',
  'draft: "tomorrow, i promise"',
  'last seen 2:11 AM',
] as const;

type SymbolKind = 'light' | 'shadow' | 'distance';

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveLetterGhostLines(screen: number): string[] {
  return [screen - 2, screen - 1]
    .map((id) => LETTER_PAGE_LINE_LOOKUP[id])
    .filter((line): line is string => Boolean(line));
}

export function useEmotionalScrollResistance(
  ref: RefObject<HTMLElement | null>,
  resistance = 0.42,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    let frame: number | null = null;
    let targetScrollTop = element.scrollTop;

    const maxScroll = () => Math.max(0, element.scrollHeight - element.clientHeight);

    const step = () => {
      const delta = targetScrollTop - element.scrollTop;
      element.scrollTop += delta * 0.24;

      if (Math.abs(delta) < 0.7) {
        element.scrollTop = targetScrollTop;
        frame = null;
        return;
      }

      frame = window.requestAnimationFrame(step);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 0.5 || element.scrollHeight <= element.clientHeight) {
        return;
      }

      event.preventDefault();
      targetScrollTop = clampNumber(
        targetScrollTop + event.deltaY * resistance,
        0,
        maxScroll(),
      );

      if (frame === null) {
        frame = window.requestAnimationFrame(step);
      }
    };

    element.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', onWheel);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [ref, resistance]);
}

export function SymbolMotif({ kind }: { kind: SymbolKind }) {
  if (kind === 'light') {
    return (
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ opacity: [0.08, 0.2, 0.1], scale: [0.84, 1.12, 0.9] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 226, 186, 0.3), rgba(255, 226, 186, 0))',
          filter: 'blur(2px)',
        }}
      />
    );
  }

  if (kind === 'shadow') {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.2, 0.4, 0.24] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 52%, rgba(0,0,0,0.16), rgba(0,0,0,0.52) 78%)',
        }}
      />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {[0, 1].map((index) => (
        <motion.div
          key={`distance-symbol-${index}`}
          className="absolute left-1/2 h-px w-[68%] -translate-x-1/2"
          style={{
            top: `${44 + index * 9}%`,
            background: 'rgba(224, 232, 248, 0.2)',
          }}
          animate={{ x: [-6, 6, -6], opacity: [0.08, 0.24, 0.1] }}
          transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function SceneEyebrow({ text }: { text: string }) {
  return (
    <p
      className="uppercase tracking-[0.16em]"
      style={{
        fontFamily: 'var(--font-dm-mono)',
        fontSize: '0.66rem',
        opacity: 0.82,
      }}
    >
      {text}
    </p>
  );
}

export function toPublicScreenNumber(legacyScreen: number) {
  return legacyScreen - 79;
}

export function YorSignatureMotif({
  className,
  opacity = 0.58,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      animate={{ opacity: [opacity * 0.66, opacity, opacity * 0.66] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.2rem',
      }}
    >
      {[0, 1, 2].map((dot) => (
        <span
          key={`ys-dot-${dot}`}
          style={{
            width: '0.22rem',
            height: '0.22rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 230, 196, 0.9)',
            boxShadow: '0 0 8px rgba(255, 230, 196, 0.4)',
          }}
        />
      ))}
    </motion.div>
  );
}

export function MemoryEchoText({ text }: { text: string }) {
  return (
    <motion.p
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.05, 0.12, 0.06] }}
      transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: 'clamp(1.9rem,6.8vw,4.8rem)',
        lineHeight: 1,
        letterSpacing: '0.03em',
        color: 'rgba(255, 240, 233, 0.28)',
        filter: 'blur(1px)',
      }}
    >
      {text}
    </motion.p>
  );
}

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
