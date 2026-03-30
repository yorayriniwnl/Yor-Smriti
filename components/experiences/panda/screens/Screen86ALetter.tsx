'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ApologyExperienceShell } from '@/components/experiences/panda/ApologyExperienceShell';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const LETTER_PARAGRAPHS = [
  { id: 'p1', text: 'Anya,', style: 'salutation', delay: 0.3 },
  {
    id: 'p2',
    text: 'I have been carrying this for a while. And I think it is time I stopped hiding it in late-night overthinking and actually gave it to you.',
    delay: 0.9,
  },
  {
    id: 'p3',
    text: 'You are one of the most important people in my life. I ruined something that was beautiful and rare, and I know that. I am not writing this to ask for a reset - I am writing this because you deserve to know exactly where I stand.',
    delay: 2.2,
  },
  {
    id: 'p4',
    text: 'I was wrong. Not in the vague, uncertain way people use when they want credit without changing. I was wrong specifically, knowingly, and I chose myself when I should have chosen us.',
    delay: 3.8,
  },
  {
    id: 'p5',
    text: 'If you ever find it in you to let me try again - I will do it differently. Quietly, consistently, with no grand gestures. Just showing up the way I should have from the start.',
    delay: 5.2,
  },
  { id: 'p6', text: 'With all the love I have,\n- Ayrin', style: 'signature', delay: 6.4 },
];

export function Screen86ALetter() {
  const [allRevealed, setAllRevealed] = useState(false);

  return (
    <ApologyExperienceShell
      screenNumber={86}
      totalScreens={87}
      eyebrow="Letter"
      title="A Letter For You"
      subtitle="Read at your own pace."
      showHeader={false}
      showTopControls={false}
      panelClassName="relative w-full max-w-[26rem] overflow-hidden rounded-[2.2rem] border pb-6 pt-7"
      contentClassName="relative z-10 px-4"
    >
      <motion.div
        className="relative rounded-xl border px-5 py-5"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE_SOFT }}
        style={{
          background: 'rgba(255, 248, 252, 0.06)',
          borderColor: 'rgba(255, 190, 220, 0.18)',
        }}
      >
        <div className="pointer-events-none absolute inset-x-5 inset-y-5" aria-hidden>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${i * 14.28}%`,
                height: '1px',
                background: 'rgba(255, 180, 215, 0.07)',
              }}
            />
          ))}
        </div>

        <div className="relative flex flex-col gap-3.5">
          {LETTER_PARAGRAPHS.map((para, index) => (
            <motion.p
              key={para.id}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: para.delay, ease: EASE_SOFT }}
              onAnimationComplete={() => {
                if (index === LETTER_PARAGRAPHS.length - 1) setAllRevealed(true);
              }}
              style={{
                fontFamily:
                  para.style === 'salutation' || para.style === 'signature'
                    ? 'var(--font-cormorant)'
                    : 'var(--font-crimson)',
                fontSize:
                  para.style === 'salutation'
                    ? '1.4rem'
                    : para.style === 'signature'
                      ? '1.1rem'
                      : '0.97rem',
                fontStyle: 'italic',
                lineHeight: 1.65,
                color: para.style ? 'rgba(255, 210, 236, 0.96)' : 'rgba(255, 230, 244, 0.88)',
                fontWeight: para.style === 'salutation' ? 600 : 400,
                whiteSpace: 'pre-line',
              }}
            >
              {para.text}
            </motion.p>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-5 flex items-center justify-between gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: allRevealed ? 1 : 0 }}
        transition={{ duration: 1, ease: EASE_SOFT }}
      >
        <Link
          href="/apology/85"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255, 195, 225, 0.6)',
            textDecoration: 'none',
          }}
        >
          ← Back
        </Link>
        <Link
          href="/apology/87"
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
          The Final Moment →
        </Link>
      </motion.div>
    </ApologyExperienceShell>
  );
}
