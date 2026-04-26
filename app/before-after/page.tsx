'use client';

import { motion } from 'framer-motion';
import { isPlaceholder } from '@/lib/content';
import { ContentComingSoon } from '@/components/ui/ContentComingSoon';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Row {
  dimension: string;
  then: string;
  now: string;
}

const ROWS: Row[] = [
  {
    dimension: 'conflict',
    then: 'I went silent. Days, sometimes. I called it needing space but I was avoiding the discomfort of being wrong out loud.',
    now: 'I say it when I am wrong, in the moment, before the silence can set in. Even when it is uncomfortable. Especially then.',
  },
  {
    dimension: 'communication',
    then: 'I held things back and then resented you for not knowing them. I expected you to understand what I never said.',
    now: 'I say the thing. Not the safe version — the actual thing. Sentences that finish themselves.',
  },
  {
    dimension: 'presence',
    then: 'I was there but not inside it. I was watching from a slight distance, managing how I appeared instead of actually being with you.',
    now: 'I am in the room when I am in the room. I notice things. I do not have half of myself somewhere else.',
  },
  {
    dimension: 'priorities',
    then: 'My comfort came first. My ego came first. I arranged things to protect myself and called it reasonable.',
    now: 'The people I love come before the version of myself I am trying to protect. That ordering is clear now.',
  },
  {
    dimension: 'accountability',
    then: 'I deflected. I reframed. I turned your upset into a conversation about context until you were explaining why you were wrong to be hurt.',
    now: 'I receive it. Fully. Without building a defence. What you feel is not something I negotiate with.',
  },
  {
    dimension: 'showing up',
    then: 'I intended to. Consistently. The intention was real. The follow-through was inconsistent in the exact moments it counted most.',
    now: 'Showing up is specific and small and daily. It is not a gesture. It is a habit I am building.',
  },
  {
    dimension: 'self-awareness',
    then: 'I thought I was self-aware because I could name my flaws. Naming them and changing nothing is not self-awareness. It is just vocabulary.',
    now: 'I see the gap between what I say I value and what I actually do. Closing it is the work. I am doing the work.',
  },
];

export default function BeforeAfterPage() {
  if (ROWS.every(item => isPlaceholder(item.then))) {
    return <ContentComingSoon title="before & after" />;
  }

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
          animate={{ opacity: [0.1, 0.19, 0.1], scale: [1, 1.07, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '12%', left: '10%',
            width: 280, height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,85,144,0.18), transparent 70%)',
            filter: 'blur(52px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[800px]">

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
            marginBottom: '3rem',
          }}
        >
          growth
        </motion.p>

        {/* Column headers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '0.5rem',
            paddingBottom: '0.8rem',
            borderBottom: '1px solid rgba(244,173,210,0.1)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,200,225,0.32)',
            }}
          >
            then
          </p>
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(247,85,144,0.7)',
            }}
          >
            now
          </p>
        </motion.div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ROWS.map((row, i) => (
            <motion.div
              key={row.dimension}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.85, delay: i * 0.07, ease: EASE }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                padding: '1.4rem 0',
                borderBottom: '1px solid rgba(244,173,210,0.08)',
              }}
            >
              {/* Then */}
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'rgba(255,200,225,0.45)',
                  fontStyle: 'italic',
                }}
              >
                {row.then}
              </p>

              {/* Now */}
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'rgba(255,220,240,0.88)',
                  fontStyle: 'italic',
                  background: 'rgba(247,85,144,0.08)',
                  borderLeft: '2px solid rgba(247,85,144,0.35)',
                  paddingLeft: '1rem',
                  borderRadius: '0 0.4rem 0.4rem 0',
                }}
              >
                {row.now}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dimension labels — shown faintly on the side for context */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.16em',
            color: 'rgba(255,193,219,0.3)',
            marginTop: '3rem',
            textAlign: 'center',
          }}
        >
          the same person. different choices.
        </motion.p>

      </div>
    </main>
  );
}
