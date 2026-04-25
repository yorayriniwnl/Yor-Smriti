'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

interface GratitudeItem {
  n: string;
  text: string;
}

const ITEMS: GratitudeItem[] = [
  // Each item begins with "Because of you…", "You made me…", or "I understand now…"
  // [Fill each with something specific — not a lesson, but a gratitude for impact]
  { n: '01', text: '[Because of you… — something specific she changed about how you see the world or yourself]' },
  { n: '02', text: '[You made me… — a concrete way she changed who you are, not who you wanted to be]' },
  { n: '03', text: '[I understand now… — something you genuinely understand now that you didn\'t before she was in your life]' },
  { n: '04', text: '[Because of you… — something she gave you that has nothing to do with the relationship ending]' },
  { n: '05', text: '[You made me… — something about your character or values that is different because of her]' },
  { n: '06', text: '[I understand now… — something about other people, or life, or yourself that she helped you see]' },
  { n: '07', text: '[Because of you… — a specific thing you value differently now because of her]' },
  { n: '08', text: '[You made me… — something you do or approach differently because of who she was to you]' },
  { n: '09', text: '[I understand now… — one last thing. The one that took the longest to see clearly.]' },
];

export default function GratitudePage() {
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
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.06, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '18%', left: '12%',
            width: 250, height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,85,144,0.22), transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <motion.div
          animate={{ opacity: [0.07, 0.14, 0.07], scale: [1, 1.08, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute',
            top: '14%', right: '14%',
            width: 200, height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,130,255,0.18), transparent 70%)',
            filter: 'blur(44px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[620px]">

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
          gratitude
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(255,236,246,0.97)',
            lineHeight: 1.08,
            marginBottom: '3.5rem',
          }}
        >
          What you gave me
        </motion.h1>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-24px' }}
              transition={{ duration: 0.85, delay: i * 0.08, ease: EASE }}
              style={{ display: 'flex', gap: '1.4rem', alignItems: 'flex-start' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(247,85,144,0.5)',
                  flexShrink: 0,
                  paddingTop: '0.28rem',
                  minWidth: '1.8rem',
                }}
              >
                {item.n}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(1.02rem, 2.2vw, 1.15rem)',
                  lineHeight: 1.8,
                  color: 'rgba(255,220,238,0.85)',
                  fontStyle: 'italic',
                }}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'rgba(255,193,219,0.5)',
            marginTop: '4rem',
            lineHeight: 1.65,
          }}
        >
          Whatever happens next — thank you for all of this.
        </motion.p>

      </div>
    </main>
  );
}
