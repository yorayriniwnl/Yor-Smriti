'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { AmbientSound } from '@/components/ui/AmbientSound';
import { ScrollReset } from '@/components/ui/ScrollReset';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface WordEntry {
  id: string;
  quote: string;           // the exact or near-exact phrase
  when: string;            // approximate context / moment
  why: string;             // why it stayed, when he still thinks about it
}

const WORDS: WordEntry[] = [
  {
    id: 'w1',
    quote: '"I just want you to actually be here."',
    when: 'sometime when I had gone quiet again',
    why: 'You said it plainly, without cruelty, without a performance of hurt. Just the true thing. I think about it every time I catch myself drifting in a conversation.',
  },
  {
    id: 'w2',
    quote: '"I notice more than I say."',
    when: 'I forget exactly when — something small, in passing',
    why: 'I have thought about it more than any grand statement either of us ever made. It explained something. It also made me realise I had not been giving you enough to notice.',
  },
  {
    id: 'w3',
    quote: '"You do not have to solve it. I just need you to sit with me in it."',
    when: 'when you were going through something hard',
    why: 'I had been doing the wrong thing for so long that hearing the right thing said out loud felt like a correction to something I had not known was broken. I try to remember it with everyone now.',
  },
  {
    id: 'w4',
    quote: '"I am not going to pretend that was okay."',
    when: 'when I had deflected one too many times',
    why: 'Most people let things pass. You did not. You said it quietly and without aggression, and it landed harder than anything louder would have. I think about it when I am tempted to let something go that should not be let go.',
  },
  {
    id: 'w5',
    quote: '"I liked talking to you today."',
    when: 'a good day, the kind we had more of early on',
    why: 'Small and complete. You could have said nothing. You said that. I kept it.',
  },
  {
    id: 'w6',
    quote: '"I do not think you know how much you pull away."',
    when: 'towards the end, when you were finally naming it',
    why: 'You were right. I did not know. I still do not entirely know, which is why I think about this one the most. You were trying to help me see something and I was not ready to look.',
  },
  {
    id: 'w7',
    quote: '"Some things do not need a reason. They just are."',
    when: 'talking about something I was overanalysing',
    why: 'You said it with a kind of ease that I do not have and have always wanted. It quieted something in me for a moment. I replicate the phrase internally now when I am spinning out.',
  },
];

export default function WordsSheSaidPage() {
  return (
    <main
      id="main-content"
      className="relative min-h-dvh w-full"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <ScrollReset />
      <ReadingProgress />
      <AmbientSound />
      <BookmarkButton title="Things You Said That I Still Carry" />

      {/* Ambient orb */}
      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          bottom: '18%', left: '10%',
          width: 260, height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,85,144,0.18), transparent 70%)',
          filter: 'blur(48px)',
          opacity: 0.45,
        }}
      />

      <div
        className="relative z-10 mx-auto px-6"
        style={{ maxWidth: 620, paddingTop: '10vh', paddingBottom: '16vh' }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_SOFT }}
          className="mb-16"
        >
          <p
            className="mb-3 uppercase tracking-[0.22em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              color: 'rgba(255, 193, 223, 0.65)',
              fontSize: '0.58rem',
            }}
          >
            I was listening
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: 'rgba(255, 236, 246, 0.97)',
              fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
              lineHeight: 1.15,
              fontWeight: 400,
            }}
          >
            Things You Said<br />That I Still Carry
          </h1>
          <p
            className="mt-5"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'rgba(255, 200, 225, 0.52)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              lineHeight: 1.65,
              fontStyle: 'italic',
              maxWidth: '44ch',
            }}
          >
            Exact phrases, or close enough. With the reason they stayed
            and when I still find myself thinking about them.
          </p>
        </motion.div>

        {/* Entries */}
        <div className="flex flex-col">
          {WORDS.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: i * 0.04, ease: EASE_SOFT }}
              className="relative pb-14"
            >
              {/* Divider */}
              <div
                aria-hidden="true"
                style={{
                  height: '1px',
                  background:
                    'linear-gradient(to right, transparent, rgba(244,173,210,0.16) 30%, rgba(244,173,210,0.16) 70%, transparent)',
                  marginBottom: '2.5rem',
                }}
              />

              {/* The quote itself — large, prominent */}
              <blockquote
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255, 240, 250, 0.96)',
                  fontWeight: 400,
                  margin: 0,
                  marginBottom: '0.9rem',
                }}
              >
                {entry.quote}
              </blockquote>

              {/* When */}
              <p
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.56rem',
                  letterSpacing: '0.14em',
                  textTransform: 'lowercase',
                  color: 'rgba(247, 130, 175, 0.45)',
                  marginBottom: '1.2rem',
                }}
              >
                {entry.when}
              </p>

              {/* Why it stayed */}
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(0.95rem, 2.1vw, 1.06rem)',
                  lineHeight: 1.78,
                  color: 'rgba(255, 210, 235, 0.72)',
                  fontWeight: 300,
                  maxWidth: '52ch',
                }}
              >
                {entry.why}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE_SOFT }}
          className="pt-4"
        >
          <div
            aria-hidden="true"
            style={{
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(247,85,144,0.24) 40%, transparent)',
              marginBottom: '2rem',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.05rem, 2.4vw, 1.28rem)',
              color: 'rgba(247, 150, 195, 0.8)',
              lineHeight: 1.7,
            }}
          >
            You spoke carefully. I was paying attention.<br />
            I should have told you that while it still counted.
          </p>
        </motion.div>

        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16"
        >
          <Link
            href="/hub"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              color: 'rgba(255, 171, 210, 0.32)',
              textTransform: 'uppercase',
            }}
          >
            ← back
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
