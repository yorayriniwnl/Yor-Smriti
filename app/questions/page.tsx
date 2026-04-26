'use client';

import { motion } from 'framer-motion';
import { isPlaceholder } from '@/lib/content';
import { ContentComingSoon } from '@/components/ui/ContentComingSoon';

const EASE = [0.16, 1, 0.3, 1] as const;

const QUESTIONS: string[] = [
  'Are you okay? Not in the way people ask without wanting an answer. Actually — how are you doing?',
  'Was there a moment you knew it was not going to work, and you stayed anyway? I have always wondered what that felt like for you.',
  'What did you need from me that I never thought to give?',
  'Did you ever feel like I actually saw you, or was it always a little like I was looking just past?',
  'The thing you said once about how you go quiet when you decide someone is not worth the argument — did you ever go quiet like that with me?',
  'Is there something you wanted to say to me that you never did? I am asking because I think there is, and I think you decided I was not worth the risk.',
  'What does your life look like now? Not the surface of it. The inside of it.',
  'Do you still laugh the same way? The one where you try to stop it and cannot?',
  'If you could say one thing to me and know I would actually hear it — what would it be?',
];

export default function QuestionsPage() {
  if (QUESTIONS.every(isPlaceholder)) {
    return <ContentComingSoon title="questions" />;
  }

  return (
    <main
      className="relative flex min-h-dvh w-dvw flex-col items-center justify-center overflow-hidden px-5 py-24"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255,213,233,0.55) 0%, rgba(95,45,82,0.5) 32%, rgba(22,8,20,0.96) 64%, #05030a 100%)',
      }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '20%', right: '15%',
            width: 240, height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,130,255,0.2), transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[680px]">

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
            textAlign: 'center',
            marginBottom: '4.5rem',
          }}
        >
          wondering
        </motion.p>

        {/* Questions — each whileInView with stagger */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3.5rem',
            textAlign: 'center',
          }}
        >
          {QUESTIONS.map((q, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 1.45,
                color: 'rgba(255,232,244,0.9)',
              }}
            >
              {q}
            </motion.p>
          ))}
        </div>

        {/* Closing line */}
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
