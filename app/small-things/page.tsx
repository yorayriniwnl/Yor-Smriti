'use client';

import { motion } from 'framer-motion';
import { isPlaceholder } from '@/lib/content';
import { ContentComingSoon } from '@/components/ui/ContentComingSoon';

const EASE = [0.16, 1, 0.3, 1] as const;

const ITEMS: string[] = [
  'The way you say my name. Not Ayrin the way anyone would — Ayrin the way only you do, like it is a decision.',
  'How you go quiet right before you say the most precise thing. There is a pause. I started watching for it.',
  'The laugh you try to stop. The fact that trying to stop it always makes it worse.',
  'When you are thinking, you are very still. Not uncomfortable still — certain still. Like thinking for you is something you trust.',
  'The way you said things half-finished sometimes, like you had started the sentence for someone you trusted and caught yourself. I noticed every time you caught yourself.',
  'That you remembered small details about things I mentioned in passing. You never made a thing of it. You just knew.',
  'When you were nervous you asked practical questions that did not need answers. I could always tell. I never said so.',
  'The way our texts ran from ten in the morning to ten at night like there was always one more thing. There was always one more thing.',
  'How when something made you happy you did not announce it. You just got quieter and warmer and I could feel it through a screen.',
  'The screaming laugh. The one that was not graceful. I loved that one most.',
  'That you held your opinions with real conviction, not performance. You did not change what you thought to make the room comfortable.',
  'You, existing in small ordinary moments — a video call, a text about nothing, the middle of a Tuesday — and somehow filling all of it.',
];

export default function SmallThingsPage() {
  if (ITEMS.every(isPlaceholder)) {
    return <ContentComingSoon title="small things" />;
  }

  return (
    <main
      className="relative flex min-h-dvh w-dvw flex-col items-center justify-start overflow-hidden px-5 py-20"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255,213,233,0.55) 0%, rgba(95,45,82,0.5) 32%, rgba(22,8,20,0.96) 64%, #05030a 100%)',
      }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <motion.div
          animate={{ opacity: [0.09, 0.17, 0.09], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '15%', right: '18%',
            width: 200, height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,85,144,0.2), transparent 70%)',
            filter: 'blur(44px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[580px]">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(255,193,219,0.5)',
            marginBottom: '4rem',
          }}
        >
          things he saw but never said
        </motion.p>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.85, delay: i * 0.06, ease: EASE }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.05rem',
                  fontStyle: 'italic',
                  lineHeight: 1.75,
                  color: 'rgba(255,218,236,0.84)',
                  padding: '1.4rem 0',
                }}
              >
                {item}
              </p>
              {i < ITEMS.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    height: '1px',
                    background: 'rgba(244,173,210,0.12)',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'rgba(255,193,219,0.52)',
            marginTop: '3.5rem',
            lineHeight: 1.65,
          }}
        >
          I was paying attention. I just didn&apos;t say it often enough.
        </motion.p>

      </div>
    </main>
  );
}
