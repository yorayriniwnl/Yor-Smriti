'use client';

import { motion } from 'framer-motion';
import { TextReveal } from '@/components/transitions/TextReveal';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';

function ContinueButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="rounded-full px-6 py-3 text-[0.68rem] uppercase tracking-[0.1em]"
      style={{
        fontFamily: 'var(--font-dm-mono)',
        color: '#fff',
        background: 'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
        boxShadow: '0 10px 24px rgba(247, 85, 144, 0.28)',
      }}
    >
      Continue
    </motion.button>
  );
}

export function RegretIntroScreen({
  emotion,
  onNext,
  personalization,
}: ExperienceScreenProps) {
  return (
    <section className="space-y-7 pt-6 text-center">
      <p
        className="uppercase tracking-[0.16em]"
        style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.66rem', opacity: 0.82 }}
      >
        act i - regret
      </p>

      <TextReveal
        text={`I chose pride in moments where I should have chosen your peace, ${personalization.name}.`}
        emotion={emotion}
        mode="typewriter"
        speedMs={24}
        className="mx-auto max-w-[34ch] text-[clamp(1.45rem,4vw,2.3rem)] leading-tight"
      />

      <div className="text-center">
        <ContinueButton onClick={onNext} />
      </div>
    </section>
  );
}

export function SilenceScreen({
  emotion,
  onNext,
  personalization,
}: ExperienceScreenProps) {
  return (
    <section className="space-y-7 pt-6 text-center">
      <p
        className="uppercase tracking-[0.16em]"
        style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.66rem', opacity: 0.82 }}
      >
        act ii - silence
      </p>

      <TextReveal
        text={`The distance between us got louder than every sentence I tried to say: ${personalization.message}`}
        emotion={emotion}
        fragmentFlicker={true}
        className="mx-auto max-w-[34ch] text-[clamp(1.42rem,3.8vw,2.2rem)] leading-tight"
      />

      <div className="text-center">
        <ContinueButton onClick={onNext} />
      </div>
    </section>
  );
}

export function PainScreen({
  emotion,
  onNext,
  personalization,
}: ExperienceScreenProps) {
  return (
    <section className="space-y-7 pt-6 text-center">
      <p
        className="uppercase tracking-[0.16em]"
        style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.66rem', opacity: 0.82 }}
      >
        act iii - pain
      </p>

      <TextReveal
        text={`I keep replaying ${personalization.memory}, wishing I had chosen better in that moment.`}
        emotion={emotion}
        mode="typewriter"
        speedMs={22}
        fragmentFlicker={true}
        className="mx-auto max-w-[34ch] text-[clamp(1.42rem,3.8vw,2.2rem)] leading-tight"
      />

      <div className="text-center">
        <ContinueButton onClick={onNext} />
      </div>
    </section>
  );
}

export function SilenceBridgeScreen() {
  return null;
}
