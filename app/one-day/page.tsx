'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { AmbientSound } from '@/components/ui/AmbientSound';
import { ScrollReset } from '@/components/ui/ScrollReset';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

// Each section is a time-of-day beat. Pure prose, no chrome.
const SECTIONS = [
  {
    id: 'morning',
    time: 'morning',
    prose: `You wake up first. You always did. I used to hear you moving around before I was fully conscious — the soft click of the kettle, the particular way you opened the curtains, not all the way. I'd lie there pretending to still be asleep and just listen to you exist in the same space as me. Eventually you'd come back and sit on your side of the bed with your phone and your tea and I'd stop pretending and you'd say something like "I knew you were awake" and you'd always been right.`,
  },
  {
    id: 'midmorning',
    time: 'mid-morning',
    prose: `We'd need groceries. We'd argue, briefly and without heat, about who forgot to add the milk to the list. It would turn out to be me. We'd go anyway — the small supermarket, not the big one — and you'd put things in the basket that weren't on the list, things you'd seen and remembered, and I'd pretend to be exasperated but I'd be watching you and thinking, without letting myself say it: this is the best part of my week. This exact errand. You reading the back of a label and frowning slightly at it.`,
  },
  {
    id: 'afternoon',
    time: 'afternoon',
    prose: `A walk, probably. Or maybe just sitting somewhere that isn't inside. You'd be tired in that specific way you got sometimes — present but far away — and I wouldn't push into it, I'd just be near it. We might not talk much. At some point you'd say something that sounded like nothing, a small observation about something you'd noticed — a tree, a person, a thing you'd been thinking about — and it would be one of those sentences that stays. The kind I'd carry home and think about later in another room.`,
  },
  {
    id: 'late-afternoon',
    time: 'late afternoon',
    prose: `An argument. Small. About something that doesn't matter — timing, or a plan, or a thing I said that came out wrong. Real enough that it needs to be said and small enough that it would pass. I'd be too defensive too quickly, as usual, and you'd be too quiet, as usual, and then one of us would say something that broke the ice of it, and we'd both feel slightly embarrassed about the previous ten minutes. That's the version I'd want. Not no arguments. Just the kind that end.`,
  },
  {
    id: 'evening',
    time: 'evening',
    prose: `Cooking, or ordering, or some compromise between the two. You reading while I did something else. Music on, low, not selected carefully — whatever was already playing. At some point we'd end up on the same piece of furniture and you'd lean into me or I'd lean into you and that would just be what was happening and neither of us would name it. The evening would get later in the way evenings do when you're not trying to hold onto them.`,
  },
  {
    id: 'night',
    time: 'night',
    prose: `Falling asleep. Not dramatically — just the ordinary version of it, where one of you goes first and the other lies there a little longer in the dark and thinks about the day, and finds, running through it, that most of it was good. Most of it was just the two of us being alive in the same place. I used to not understand that was the whole thing. I understand it now. I would give a great deal to not understand it in retrospect.`,
  },
];

export default function OneDayPage() {
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
      <BookmarkButton title="One Day With You" />

      {/* Ambient orb */}
      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          bottom: '20%', right: '8%',
          width: 280, height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,130,255,0.14), transparent 70%)',
          filter: 'blur(50px)',
          opacity: 0.5,
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
            if things were okay
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: 'rgba(255, 236, 246, 0.97)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1.1,
              fontWeight: 400,
            }}
          >
            One Day With You
          </h1>
          <p
            className="mt-4"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'rgba(255, 200, 225, 0.55)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              lineHeight: 1.65,
              fontStyle: 'italic',
              maxWidth: '40ch',
            }}
          >
            Not a grand gesture. Just a day. The kind we had. The kind I miss.
          </p>
        </motion.div>

        {/* Prose sections */}
        <div className="flex flex-col gap-0">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.95, delay: i * 0.03, ease: EASE_SOFT }}
              className="relative pb-14"
            >
              {/* Divider */}
              <div
                aria-hidden="true"
                style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(244,173,210,0.15) 35%, rgba(244,173,210,0.15) 65%, transparent)',
                  marginBottom: '2.5rem',
                }}
              />
              {/* Time label */}
              <p
                className="mb-5"
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.56rem',
                  letterSpacing: '0.2em',
                  color: 'rgba(247, 130, 175, 0.45)',
                  textTransform: 'uppercase',
                }}
              >
                {section.time}
              </p>
              {/* Prose */}
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(1.05rem, 2.3vw, 1.2rem)',
                  lineHeight: 1.9,
                  color: 'rgba(255, 228, 242, 0.88)',
                  fontWeight: 300,
                }}
              >
                {section.prose}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE_SOFT }}
          className="pt-4 pb-2"
        >
          <div
            aria-hidden="true"
            style={{
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(247,85,144,0.28) 40%, transparent)',
              marginBottom: '2.5rem',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
              color: 'rgba(247, 130, 175, 0.82)',
              lineHeight: 1.65,
            }}
          >
            I wrote this in one sitting. It took twenty minutes.<br />
            I have been thinking about it for much longer than that.
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
