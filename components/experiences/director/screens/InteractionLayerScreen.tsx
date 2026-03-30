'use client';

import { useMemo, useState } from 'react';
import { HoldButton } from '@/components/ui/HoldButton';
import { TextReveal } from '@/components/transitions/TextReveal';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';
import type { EndingVariant } from '@/lib/experienceEndings';

interface InteractionLayerScreenProps extends ExperienceScreenProps {
  onResolveEnding?: (variant: EndingVariant) => void;
}

const INTERACTION_LINES = [
  'You are not a viewer here. You are part of this moment.',
  'I will accept your response with honesty.',
  'Choose what feels true for you right now.',
];

const RESPONSE_OPTIONS: Array<{ label: string; variant: EndingVariant }> = [
  { label: 'Maybe someday', variant: 'hopeful' },
  { label: 'I need closure', variant: 'closure' },
  { label: 'Let this be goodbye', variant: 'goodbye' },
];

export function InteractionLayerScreen({
  emotion,
  onNext,
  onResolveEnding,
  pushEmotionSignal,
}: InteractionLayerScreenProps) {
  const [revealedCount, setRevealedCount] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<EndingVariant | null>(null);

  const allRevealed = revealedCount >= INTERACTION_LINES.length;
  const revealMore = () => {
    setRevealedCount((count) => Math.min(count + 1, INTERACTION_LINES.length));
  };

  const selectedLabel = useMemo(() => {
    if (!selectedVariant) return '';
    return RESPONSE_OPTIONS.find((item) => item.variant === selectedVariant)?.label ?? '';
  }, [selectedVariant]);

  const handleSelectVariant = (variant: EndingVariant) => {
    setSelectedVariant(variant);
    onResolveEnding?.(variant);

    if (variant === 'hopeful') {
      pushEmotionSignal('hope');
      return;
    }

    if (variant === 'closure') {
      pushEmotionSignal('closure');
      return;
    }

    pushEmotionSignal('silence');
  };

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-8 pt-4 text-center">
      <p
        className="uppercase tracking-[0.16em]"
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.66rem',
          opacity: 0.82,
        }}
      >
        interaction
      </p>

      <div className="space-y-4">
        {INTERACTION_LINES.slice(0, revealedCount).map((line, index) => (
          <TextReveal
            key={`interaction-line-${index}`}
            text={line}
            emotion={emotion}
            delay={index * 0.14}
            className="mx-auto max-w-[35ch] text-[clamp(1.1rem,3vw,1.55rem)] leading-relaxed"
          />
        ))}
      </div>

      {!allRevealed ? (
        <button
          type="button"
          onClick={revealMore}
          className="rounded-full border px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
          style={{
            borderColor: 'rgba(255,255,255,0.34)',
            fontFamily: 'var(--font-dm-mono)',
            color: 'inherit',
          }}
        >
          Tap to reveal next line
        </button>
      ) : (
        <div className="w-full max-w-xl space-y-5">
          <div className="grid gap-3">
            {RESPONSE_OPTIONS.map((option) => {
              const selected = selectedVariant === option.variant;
              return (
                <button
                  key={option.variant}
                  type="button"
                  onClick={() => handleSelectVariant(option.variant)}
                  className="rounded-xl border px-4 py-3 text-left text-[0.72rem] uppercase tracking-[0.1em]"
                  style={{
                    borderColor: selected ? 'rgba(255,255,255,0.48)' : 'rgba(255,255,255,0.24)',
                    backgroundColor: selected ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                    fontFamily: 'var(--font-dm-mono)',
                    transition: 'background-color 220ms ease, border-color 220ms ease',
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {selectedVariant ? (
            <div className="space-y-3">
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1rem',
                  opacity: 0.9,
                }}
              >
                Selected: {selectedLabel}
              </p>

              <HoldButton
                label="Hold to continue"
                holdDuration={1200}
                revealText="I hear you."
                onComplete={onNext}
              />
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
