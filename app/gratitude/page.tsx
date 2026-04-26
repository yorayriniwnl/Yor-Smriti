'use client';

import { motion } from 'framer-motion';
import { isPlaceholder } from '@/lib/content';
import { ContentComingSoon } from '@/components/ui/ContentComingSoon';

const EASE = [0.16, 1, 0.3, 1] as const;

interface GratitudeItem {
  n: string;
  text: string;
}

const ITEMS: GratitudeItem[] = [
  { n: '01', text: 'Because of you, I understand what it means to be genuinely seen by someone. Not performed for — seen. You did that without making it a thing, and now I know the difference between that and everything else.' },
  { n: '02', text: 'You made me more precise. About what I think. About what I say. You did not accept vague. You waited for the actual thing, and that habit stayed.' },
  { n: '03', text: 'I understand now that presence is something you do, not something you are. You were present. Fully. I watched you do it and I finally understood what it looks like from the outside.' },
  { n: '04', text: 'Because of you, I know what 10 AM to 10 PM of a person feels like. What it means to want to keep giving someone your afternoon, and your evening, and still have more.' },
  { n: '05', text: 'You made me aware of my silences. Not proud of them — aware. That is the first step in changing something. I had not taken that step before you.' },
  { n: '06', text: 'I understand now that when someone calls your name a certain way, and it sounds different from anyone else — that is something. That is not nothing. I understand that now.' },
  { n: '07', text: 'Because of you, I take people more seriously when they laugh at something they find genuinely funny. Not the social laugh. The real one. Yours taught me to look for it.' },
  { n: '08', text: 'You made me want to be a more careful person. Not better in the abstract. Careful — with what I say, with what I leave unsaid, with other people who trust me.' },
  { n: '09', text: 'I understand now, clearly, what I had. That is the last thing. The one that took the longest. I understand exactly what I was holding and what I did with it, and that understanding is yours.' },
];

export default function GratitudePage() {
  if (ITEMS.every(item => isPlaceholder(item.text))) {
    return <ContentComingSoon title="gratitude" />;
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
