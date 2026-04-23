'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const PARAGRAPHS: string[] = [
  '[Her mind - how she thinks, what she notices, the quality of her attention. Not how it made you feel. What it actually is.]',
  '[How she argues - what she does with logic, where she goes quiet, when she knows she is right and what that looks like from the outside.]',
  '[How she goes quiet - when it happens, what it means. The difference between her different silences. Be specific.]',
  '[What she does when she is nervous - a specific, observable behaviour. Something you noticed. Not a feeling you projected onto her.]',
  '[What she is like when she trusts someone - how she changes, what she allows, what becomes different about her.]',
  '[One specific habit or pattern - something she does regularly that is just hers. Not remarkable to anyone else, but entirely true.]',
  '[Her relationship with something she cares about deeply - a subject, a way of seeing, something she returns to even when no one asks her to.]',
  '[One final thing - specific, true, and entirely about her. Not about what she meant to you. About who she is.]',
];

export default function HerPage() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-dvh w-dvw flex-col items-center justify-center overflow-hidden px-5 py-20"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255,213,233,0.55) 0%, rgba(95,45,82,0.5) 32%, rgba(22,8,20,0.96) 64%, #05030a 100%)',
      }}
    >
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.07, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '8%',
            left: '20%',
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,85,144,0.22), transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[640px]">
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
            marginBottom: '1.4rem',
          }}
        >
          portrait
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2.8rem, 7vw, 4.2rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(255,236,246,0.97)',
            lineHeight: 1.05,
            marginBottom: '3.5rem',
          }}
        >
          Who you are
        </motion.h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {PARAGRAPHS.map((text, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.18 + index * 0.1, ease: EASE }}
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1.05rem, 2.2vw, 1.18rem)',
                lineHeight: 1.85,
                color: 'rgba(255,220,238,0.82)',
              }}
            >
              {text}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.18 + PARAGRAPHS.length * 0.1 + 0.3, ease: EASE }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.16em',
            color: 'rgba(255,193,219,0.38)',
            marginTop: '4rem',
            lineHeight: 1.7,
          }}
        >
          this is not about what I lost. this is about who you are.
        </motion.p>
      </div>
    </main>
  );
}
