'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Row {
  dimension: string;
  then: string;
  now: string;
}

const ROWS: Row[] = [
  {
    dimension: 'conflict',
    then: '[Then: what was true about how you handled conflict - be specific and honest, not performatively self-critical]',
    now: '[Now: what is actually different - a concrete change, not an aspiration]',
  },
  {
    dimension: 'communication',
    then: '[Then: how you communicated - what you held back, avoided, or handled badly]',
    now: '[Now: what changed and how - be concrete]',
  },
  {
    dimension: 'presence',
    then: '[Then: how present you actually were - not the version you told yourself, the real one]',
    now: '[Now: how presence looks different for you now]',
  },
  {
    dimension: 'priorities',
    then: '[Then: what you prioritised, even unconsciously - what consistently came first]',
    now: '[Now: what has genuinely shifted in what you prioritise]',
  },
  {
    dimension: 'accountability',
    then: '[Then: how you handled being wrong or called out - deflection, silence, defensiveness]',
    now: '[Now: what accountability actually looks like for you now]',
  },
  {
    dimension: 'showing up',
    then: '[Then: what "showing up" actually looked like - the gap between intention and action]',
    now: '[Now: what showing up looks like now - specific, not aspirational]',
  },
  {
    dimension: 'self-awareness',
    then: "[Then: what you didn't see about yourself - what you were blind to]",
    now: "[Now: what you see clearly that you didn't before]",
  },
];

export default function BeforeAfterPage() {
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
          animate={{ opacity: [0.1, 0.19, 0.1], scale: [1, 1.07, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '12%',
            left: '10%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,85,144,0.18), transparent 70%)',
            filter: 'blur(52px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[800px]">
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ROWS.map((row, index) => (
            <motion.div
              key={row.dimension}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.85, delay: index * 0.07, ease: EASE }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                padding: '1.4rem 0',
                borderBottom: '1px solid rgba(244,173,210,0.08)',
              }}
            >
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
