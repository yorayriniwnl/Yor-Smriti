'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const QUESTIONS: string[] = [
  '[Write an honest question you have for her - something you actually wonder. Not rhetorical. Not demanding.]',
  "[A question about something you never understood - a choice she made, a moment you still replay and don't fully grasp.]",
  '[A question about who she is now - not as accusation, as genuine curiosity about how she is.]',
  '[A question you have never asked because you were afraid of what the answer might be.]',
  "[A question about something she said once that stayed with you, that you've thought about many times since.]",
  "[A question about what she needed that you didn't give her - asked plainly, without self-pity.]",
  '[A question about her future - something you genuinely wonder about, separate from yourself.]',
  "[A question about something small - a habit, a preference, a thing you realised you don't actually know.]",
  "[One last question - the one you'd ask if you only got one.]",
];

export default function QuestionsPage() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-dvh w-dvw flex-col items-center justify-center overflow-hidden px-5 py-24"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255,213,233,0.55) 0%, rgba(95,45,82,0.5) 32%, rgba(22,8,20,0.96) 64%, #05030a 100%)',
      }}
    >
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,130,255,0.2), transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[680px]">
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
            textAlign: 'center',
            marginBottom: '4.5rem',
          }}
        >
          wondering
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', textAlign: 'center' }}>
          {QUESTIONS.map((question, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: index * 0.08, ease: EASE }}
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 1.45,
                color: 'rgba(255,232,244,0.9)',
              }}
            >
              {question}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.16em',
            color: 'rgba(255,193,219,0.38)',
            marginTop: '5rem',
            textAlign: 'center',
          }}
        >
          you don&apos;t have to answer any of them.
        </motion.p>
      </div>
    </main>
  );
}
