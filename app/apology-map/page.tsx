'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { ScrollReset } from '@/components/ui/ScrollReset';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

type Severity = 'low' | 'mid' | 'high';

interface FailureEntry {
  id: string;
  date: string;
  what: string;
  impact: string;
  severity: Severity;
}

const ENTRIES: FailureEntry[] = [
  {
    id: 'f1',
    date: 'early on',
    what: 'I let you carry more of the emotional labour from the start — answering more, reaching out more, initiating more. I noticed and I kept going.',
    impact: 'You normalised putting in more than you were getting. That became the baseline.',
    severity: 'mid',
  },
  {
    id: 'f2',
    date: 'when things got hard',
    what: 'I went quiet instead of telling you what was happening in my head. I called it not wanting to burden you. It was avoidance.',
    impact: 'You were left reading silence and deciding what it meant. Most of your interpretations were probably worse than the truth.',
    severity: 'high',
  },
  {
    id: 'f3',
    date: 'more than once',
    what: 'I deflected when you tried to address something real. Changed the subject, agreed too quickly, redirected to you.',
    impact: 'You learned that honest conversations with me cost something. You started having fewer of them.',
    severity: 'high',
  },
  {
    id: 'f4',
    date: 'repeatedly',
    what: 'I noticed when you were struggling and waited for you to name it instead of just showing up.',
    impact: 'You had to ask to be cared for when you should have just been cared for.',
    severity: 'mid',
  },
  {
    id: 'f5',
    date: 'the period I am least proud of',
    what: 'I started pulling away without telling you why. You could feel it. You said so. I said it was nothing.',
    impact: 'You spent real time questioning what you had done. You had done nothing.',
    severity: 'high',
  },
  {
    id: 'f6',
    date: 'when you were right',
    what: 'When you called me out clearly and correctly, I got defensive instead of just saying yes, you\'re right, I\'m sorry.',
    impact: 'Being right stopped feeling worth it. You had to pay a social cost for accuracy.',
    severity: 'mid',
  },
  {
    id: 'f7',
    date: 'toward the end',
    what: 'I did not fight for us when it mattered. I let the distance settle instead of crossing it.',
    impact: 'You may have read that as confirmation that it didn\'t matter enough. That is not what it was. But I understand why it looked that way.',
    severity: 'high',
  },
  {
    id: 'f8',
    date: 'all along',
    what: 'I let the things I felt about you stay inside instead of saying them out loud. I thought about you constantly and said a fraction of it.',
    impact: 'You did not know. You should have known.',
    severity: 'low',
  },
];

const SEVERITY_STYLES: Record<Severity, {
  dotColor: string;
  lineColor: string;
  dateColor: string;
  whatColor: string;
  impactBg: string;
  impactBorder: string;
  impactColor: string;
}> = {
  low: {
    dotColor: 'rgba(244, 173, 210, 0.55)',
    lineColor: 'rgba(244, 173, 210, 0.14)',
    dateColor: 'rgba(255, 171, 210, 0.42)',
    whatColor: 'rgba(255, 228, 242, 0.82)',
    impactBg: 'rgba(255,255,255,0.025)',
    impactBorder: 'rgba(244,173,210,0.14)',
    impactColor: 'rgba(255, 200, 228, 0.62)',
  },
  mid: {
    dotColor: 'rgba(247, 110, 165, 0.78)',
    lineColor: 'rgba(247, 110, 165, 0.18)',
    dateColor: 'rgba(247, 130, 175, 0.58)',
    whatColor: 'rgba(255, 232, 245, 0.9)',
    impactBg: 'rgba(247,85,144,0.05)',
    impactBorder: 'rgba(247,110,165,0.2)',
    impactColor: 'rgba(255, 210, 235, 0.72)',
  },
  high: {
    dotColor: 'rgba(247, 70, 140, 0.95)',
    lineColor: 'rgba(247, 85, 144, 0.24)',
    dateColor: 'rgba(247, 110, 165, 0.78)',
    whatColor: 'rgba(255, 240, 250, 0.97)',
    impactBg: 'rgba(247,85,144,0.07)',
    impactBorder: 'rgba(247,85,144,0.28)',
    impactColor: 'rgba(255, 218, 238, 0.82)',
  },
};

function TimelineEntry({ entry, index, isLast }: { entry: FailureEntry; index: number; isLast: boolean }) {
  const s = SEVERITY_STYLES[entry.severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.85, delay: index * 0.04, ease: EASE_SOFT }}
      className="relative flex gap-6"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center" style={{ width: 20, flexShrink: 0 }}>
        {/* Dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: s.dotColor,
            marginTop: '0.35rem',
            flexShrink: 0,
            boxShadow: entry.severity === 'high' ? `0 0 10px ${s.dotColor}` : 'none',
          }}
        />
        {/* Connecting line */}
        {!isLast && (
          <div
            style={{
              flex: 1,
              width: 1,
              background: s.lineColor,
              marginTop: 4,
              minHeight: 40,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="pb-12" style={{ flex: 1, minWidth: 0 }}>
        {/* Date */}
        <p
          className="mb-3"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.56rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: s.dateColor,
          }}
        >
          {entry.date}
        </p>

        {/* What happened */}
        <p
          className="mb-4"
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1rem, 2.2vw, 1.12rem)',
            lineHeight: 1.75,
            color: s.whatColor,
            fontWeight: entry.severity === 'high' ? 400 : 300,
          }}
        >
          {entry.what}
        </p>

        {/* Impact */}
        <div
          style={{
            borderRadius: '0.75rem',
            border: `1px solid ${s.impactBorder}`,
            background: s.impactBg,
            padding: '0.75rem 1rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.54rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: s.dateColor,
              marginBottom: '0.4rem',
            }}
          >
            impact
          </p>
          <p
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(0.88rem, 2vw, 0.98rem)',
              lineHeight: 1.65,
              color: s.impactColor,
              fontStyle: 'italic',
            }}
          >
            {entry.impact}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ApologyMapPage() {
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
      <BookmarkButton title="Where I Went Wrong, In Order" />

      {/* Ambient orb */}
      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          top: '12%', left: '8%',
          width: 260, height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,85,144,0.16), transparent 70%)',
          filter: 'blur(50px)',
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
            accountability
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
            Where I Went Wrong,<br />In Order
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
            Not a summary. Not a defence. A specific account,
            as clear as I can make it, of the things I got wrong and what they cost.
          </p>
        </motion.div>

        {/* Timeline */}
        <div>
          {ENTRIES.map((entry, i) => (
            <TimelineEntry
              key={entry.id}
              entry={entry}
              index={i}
              isLast={i === ENTRIES.length - 1}
            />
          ))}
        </div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE_SOFT }}
          className="mt-4 pb-6"
        >
          <div
            aria-hidden="true"
            style={{
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(247,85,144,0.24) 40%, transparent)',
              marginBottom: '2rem',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2.3vw, 1.2rem)',
              color: 'rgba(255, 210, 235, 0.7)',
              lineHeight: 1.7,
              maxWidth: '46ch',
            }}
          >
            I have not listed these to perform remorse. I have listed them because
            you deserved to have them named plainly, for the record, without me
            smoothing the edges off them.
          </p>
        </motion.div>

        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12"
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
