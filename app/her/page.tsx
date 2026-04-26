'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Her portrait ─────────────────────────────────────────────────────────────
// Each paragraph is driven by an environment variable so the author can fill in
// real, specific content without touching source code.
// Set HER_PARAGRAPH_1 … HER_PARAGRAPH_8 in .env.local.
// The defaults below are genuine observations — replace them with the true ones.
function getParagraphs(): string[] {
  // Next.js exposes NEXT_PUBLIC_* vars to the client. Because these are personal
  // narrative paragraphs we read them at request time server-side and bake the
  // result into the page via a data attribute, but for simplicity here we read
  // the NEXT_PUBLIC_ variants which are inlined at build time.
  // If you prefer server-side rendering, move this to a server component and
  // read process.env directly.
  return [
    process.env.NEXT_PUBLIC_HER_PARAGRAPH_1 ??
      'She notices things before she says them. There is a pause between seeing and speaking that most people do not have — she uses it to make sure what she says is actually true. You can feel it when she is deciding.',

    process.env.NEXT_PUBLIC_HER_PARAGRAPH_2 ??
      'When she argues, she goes quiet first. Not to retreat — to load. She does not raise her voice because she does not need to. She has already figured out exactly where you are wrong, and she is waiting for the right moment to say so.',

    process.env.NEXT_PUBLIC_HER_PARAGRAPH_3 ??
      'Her laugh is specific. There is the social one and then there is the real one — the one she tries to stop, where trying to stop it only makes it worse. The screaming kind. That one is hers and you know when you get it.',

    process.env.NEXT_PUBLIC_HER_PARAGRAPH_4 ??
      'She says your name a certain way. Whatever your name is, she says it differently from anyone else — like it belongs to you specifically because of her. You only notice once you have heard it enough times.',

    process.env.NEXT_PUBLIC_HER_PARAGRAPH_5 ??
      'When she trusts someone, she starts finishing sentences she would normally leave half-said. She stops editing herself mid-thought. It is the closest thing she has to completely letting go, and it is not something she gives easily.',

    process.env.NEXT_PUBLIC_HER_PARAGRAPH_6 ??
      'When she is happy — really, quietly happy — she does not announce it. She gets warmer and smaller and you can feel it in the texture of how she talks. She does not need you to notice, but she is glad when you do.',

    process.env.NEXT_PUBLIC_HER_PARAGRAPH_7 ??
      'She texts like she has something to say. Not to fill space — because she is thinking and she wants to keep going. Ten in the morning until ten at night and there was still always one more thing. There was always one more thing.',

    process.env.NEXT_PUBLIC_HER_PARAGRAPH_8 ??
      'She is more loyal than she lets on. She holds more than she shows. She is harder on herself than she would ever be on someone she loves. That is the thing about her I understood last, and too late.',
  ];
}

const PARAGRAPHS: string[] = getParagraphs();

export default function HerPage() {
  return (
    <main
      className="relative flex min-h-dvh w-dvw flex-col items-center justify-center overflow-hidden px-5 py-20"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255,213,233,0.55) 0%, rgba(95,45,82,0.5) 32%, rgba(22,8,20,0.96) 64%, #05030a 100%)',
      }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.07, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '8%', left: '20%',
            width: 260, height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,85,144,0.22), transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[640px]">

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
            marginBottom: '1.4rem',
          }}
        >
          portrait
        </motion.p>

        {/* Heading */}
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

        {/* Paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {PARAGRAPHS.map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.18 + i * 0.1, ease: EASE }}
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

        {/* Closing line */}
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
