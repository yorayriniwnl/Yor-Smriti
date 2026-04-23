'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const ITEMS: string[] = [
  '[One specific small thing you noticed about her and never mentioned - a gesture, a habit, a detail no one else would have clocked.]',
  '[Something she does with her hands, her voice, or her face that is entirely and specifically hers.]',
  '[A pattern you noticed in how she is when she is happy - not that she was happy, but how it looked.]',
  '[Something small she does when she thinks no one is watching.]',
  '[The way she handles something difficult - one specific, observable thing she does, not how it made you feel.]',
  '[Something about how she talks - a phrase, a cadence, something that is just the way she speaks.]',
  '[A small preference or habit - something she always orders, avoids, reaches for, or keeps nearby.]',
  '[Something you noticed once and thought you would mention later and never did.]',
  '[The way she is in a specific kind of moment - tired, or certain, or waiting for something.]',
  '[Something about how she laughs, listens, or goes still - specific and true.]',
  "[A thing you noticed about her that most people probably haven't, because most people weren't paying attention the way you were.]",
  '[One last one - the smallest, most specific thing on the list. The one that proves you were really watching.]',
];

export default function SmallThingsPage() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-dvh w-dvw flex-col items-center justify-start overflow-hidden px-5 py-20"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255,213,233,0.55) 0%, rgba(95,45,82,0.5) 32%, rgba(22,8,20,0.96) 64%, #05030a 100%)',
      }}
    >
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <motion.div
          animate={{ opacity: [0.09, 0.17, 0.09], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '15%',
            right: '18%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,85,144,0.2), transparent 70%)',
            filter: 'blur(44px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[580px]">
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

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.85, delay: index * 0.06, ease: EASE }}
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
              {index < ITEMS.length - 1 ? (
                <div
                  aria-hidden="true"
                  style={{
                    height: '1px',
                    background: 'rgba(244,173,210,0.12)',
                  }}
                />
              ) : null}
            </motion.div>
          ))}
        </div>

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
