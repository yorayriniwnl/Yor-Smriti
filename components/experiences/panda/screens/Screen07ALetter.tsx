'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ApologyExperienceShell } from '@/components/experiences/panda/ApologyExperienceShell';
import { TextReveal } from '@/components/transitions/TextReveal';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const LETTER_PARAGRAPHS = [
  'Anya,',
  'I have been carrying this for a while. And I think it is time I stopped hiding it in late-night overthinking and actually gave it to you.',
  'You are one of the most important people in my life. I ruined something beautiful and rare, and I know that.',
  'I was wrong. Specifically. Repeatedly. I chose myself when I should have chosen us.',
  'If you ever let me try again, I will do it quietly and consistently. Not with promises, but with presence.',
  'With all the love I still carry,\n- Ayrin',
];

export function Screen07ALetter() {
  return (
    <ApologyExperienceShell
      screenNumber={7}
      totalScreens={8}
      eyebrow="Letter"
      title="A Letter For You"
      subtitle="Read at your own pace."
      showHeader={false}
      showTopControls={false}
      panelClassName="relative w-full max-w-[27rem] overflow-hidden rounded-[2.2rem] border pb-6 pt-7"
      contentClassName="relative z-10 px-4"
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/22 bg-black/28 px-5 py-5 backdrop-blur-2xl"
        animate={{ y: [20, 0], opacity: [0, 1] }}
        transition={{ duration: 0.9, ease: EASE_SOFT }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12), transparent 44%), radial-gradient(circle at 50% 96%, rgba(255, 190, 219, 0.16), transparent 58%)',
          }}
        />

        <div
          className="relative max-h-[50vh] space-y-3.5 overflow-y-auto rounded-xl border border-white/14 bg-black/28 p-4"
          data-nav-ignore="true"
        >
          {LETTER_PARAGRAPHS.map((paragraph, index) => (
            <TextReveal
              key={`letter-line-${index}`}
              text={paragraph}
              emotion="love"
              mode="typewriter"
              speedMs={18}
              delay={index * 0.55}
              className={
                index === 0 || index === LETTER_PARAGRAPHS.length - 1
                  ? 'text-[1.15rem] italic leading-relaxed'
                  : 'text-[0.98rem] leading-relaxed'
              }
            />
          ))}
        </div>
      </motion.div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Link
          href="/apology/6"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255, 195, 225, 0.68)',
            textDecoration: 'none',
          }}
        >
          ← Back
        </Link>

        <Link
          href="/apology/8"
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
            textDecoration: 'none',
          }}
        >
          Continue →
        </Link>
      </div>
    </ApologyExperienceShell>
  );
}
