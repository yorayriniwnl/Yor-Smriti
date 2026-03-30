'use client';

import { useState } from 'react';
import { TextReveal } from '@/components/transitions/TextReveal';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';

const GROWTH_LINES = [
  'I did not understand then how my words were cutting deeper than I thought.',
  'Now I see love is not only feeling, it is responsibility in the smallest moments.',
  'I wish I had listened before defending myself.',
];

export function GrowthScreen({ emotion, onNext }: ExperienceScreenProps) {
  const [revealedCount, setRevealedCount] = useState(1);
  const allRevealed = revealedCount >= GROWTH_LINES.length;

  const revealNextLine = () => {
    setRevealedCount((count) => Math.min(count + 1, GROWTH_LINES.length));
  };

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 pt-4 text-center">
      <p
        className="uppercase tracking-[0.16em]"
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.66rem',
          opacity: 0.82,
        }}
      >
        growth
      </p>

      <div className="space-y-5">
        {GROWTH_LINES.slice(0, revealedCount).map((line, index) => (
          <TextReveal
            key={`growth-line-${index}`}
            text={line}
            emotion={emotion}
            delay={index * 0.2}
            className="mx-auto max-w-[35ch] text-[clamp(1.18rem,3.2vw,1.7rem)] leading-relaxed"
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!allRevealed ? (
          <button
            type="button"
            onClick={revealNextLine}
            className="rounded-full border px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
            style={{
              borderColor: 'rgba(255,255,255,0.34)',
              fontFamily: 'var(--font-dm-mono)',
              color: 'inherit',
            }}
          >
            Tap to reveal
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="rounded-full px-6 py-3 text-[0.68rem] uppercase tracking-[0.1em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              color: '#fff',
              background: 'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
              boxShadow: '0 10px 24px rgba(247, 85, 144, 0.28)',
            }}
          >
            Continue
          </button>
        )}
      </div>
    </section>
  );
}
