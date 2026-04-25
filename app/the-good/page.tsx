'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { AmbientSound } from '@/components/ui/AmbientSound';
import { ScrollReset } from '@/components/ui/ScrollReset';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const GOOD_THINGS = [
  {
    id: 'g1',
    text: 'We were genuinely interested in each other. Not performing it — actually curious about what the other person thought. That is rarer than it sounds.',
  },
  {
    id: 'g2',
    text: 'The conversations that went on past midnight not because there was nothing else to do but because we had more to say.',
  },
  {
    id: 'g3',
    text: 'The way you made things feel considered. Meals, words, decisions. Nothing felt careless around you.',
  },
  {
    id: 'g4',
    text: 'We made each other laugh. Real laughter, the unselfconscious kind. That doesn\'t happen with everyone.',
  },
  {
    id: 'g5',
    text: 'You were honest with me, even when it cost you something. I did not always receive it well. But it was real, and it was yours, and I am glad I got it.',
  },
  {
    id: 'g6',
    text: 'There was a specific kind of quiet we had together — not awkward, not avoidant. Just comfortable. I have not had it with anyone else.',
  },
  {
    id: 'g7',
    text: 'You believed in things and you were not embarrassed about that. Ideas, people, possibilities. I found it extraordinary.',
  },
  {
    id: 'g8',
    text: 'When you were kind to people it was not strategic. You just were. I noticed every time.',
  },
  {
    id: 'g9',
    text: 'We were good at noticing things — the same things, often. Small beauties. Things other people walked past. It felt like a private language.',
  },
  {
    id: 'g10',
    text: 'You trusted me with things that were hard to say. I understood what that cost and what it meant. I still do.',
  },
  {
    id: 'g11',
    text: 'Whatever was between us — it was specific. Not transferable. Not generic. I have never felt it outside of the exact context of you.',
  },
];

export default function TheGoodPage() {
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
      <BookmarkButton title="What Was Actually Good Between Us" />

      {/* Ambient orb */}
      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          top: '10%', right: '12%',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,200,150,0.12), transparent 70%)',
          filter: 'blur(55px)',
          opacity: 0.5,
        }}
      />

      <div
        className="relative z-10 mx-auto px-6"
        style={{ maxWidth: 600, paddingTop: '10vh', paddingBottom: '16vh' }}
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
            just the good
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
            What Was Actually Good<br />Between Us
          </h1>
          <p
            className="mt-5"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'rgba(255, 200, 225, 0.55)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              lineHeight: 1.65,
              fontStyle: 'italic',
              maxWidth: '44ch',
            }}
          >
            No sorry. No agenda. No segue into what went wrong.
            Just this.
          </p>
        </motion.div>

        {/* Items */}
        <div className="flex flex-col">
          {GOOD_THINGS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: i * 0.04, ease: EASE_SOFT }}
              className="relative pb-12"
            >
              <div
                aria-hidden="true"
                style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(255,200,150,0.14) 35%, rgba(244,173,210,0.14) 65%, transparent)',
                  marginBottom: '2.5rem',
                }}
              />
              {/* Index mark */}
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.16em',
                  color: 'rgba(255, 171, 210, 0.3)',
                  display: 'block',
                  marginBottom: '0.85rem',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(1.05rem, 2.4vw, 1.22rem)',
                  lineHeight: 1.85,
                  color: 'rgba(255, 232, 244, 0.9)',
                  fontWeight: 300,
                }}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing — no apology, just a period */}
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
              background: 'linear-gradient(to right, transparent, rgba(255,200,150,0.22) 40%, transparent)',
              marginBottom: '2rem',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
              color: 'rgba(255, 220, 195, 0.75)',
              lineHeight: 1.65,
            }}
          >
            It was real. I want you to know I know that.
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
