'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface Experience {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  emoji: string;
  delay: number;
  tech: string[];
  metrics: {
    performance: string;
    scale: string;
    results: string;
  };
}

const EXPERIENCES: Experience[] = [
  {
    href: '/timeline',
    eyebrow: 'our story',
    title: 'Memory Timeline',
    description: 'Trace the moments that shaped us — glance back, feel forward.',
    emoji: '🌙',
    delay: 0.1,
    tech: ['Next.js', 'React', 'Framer Motion'],
    metrics: {
      performance: 'Instant timeline scrubbing',
      scale: 'Scales to thousands of moments',
      results: 'Deep, reflective engagement',
    },
  },
  {
    href: '/reasons',
    eyebrow: 'from my heart',
    title: 'Why I Love You',
    description: 'A concise deck of reasons — clear, intimate, touchable.',
    emoji: '🌸',
    delay: 0.2,
    tech: ['React', 'Tailwind', 'Accessible UI'],
    metrics: {
      performance: 'Fast card flips (~120ms)',
      scale: 'Compact — dozens of reasons',
      results: 'Stronger emotional clarity',
    },
  },
  {
    href: '/stars',
    eyebrow: 'our universe',
    title: 'Our Constellation',
    description: 'Interactive stars that surface memories with gentle motion.',
    emoji: '✨',
    delay: 0.3,
    tech: ['Three.js', 'React', 'WebGL'],
    metrics: {
      performance: 'Smooth WebGL, 60fps on modern devices',
      scale: 'Hundreds of stars supported',
      results: 'High immersion and visual recall',
    },
  },
  {
    href: '/promise',
    eyebrow: 'my word to you',
    title: 'My Promises',
    description: 'Concrete promises with simple commitments you can revisit.',
    emoji: '🕯️',
    delay: 0.4,
    tech: ['React', 'LocalStorage', 'Animations'],
    metrics: {
      performance: 'Local-first, instant state updates',
      scale: 'Per-user commitments stored locally',
      results: 'Higher accountability through reminders',
    },
  },
];

export default function HubPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <main
      id="main-content"
      className="relative flex min-h-dvh w-dvw flex-col items-center justify-center overflow-hidden px-4 py-12"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <motion.div
          animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute"
          style={{
            top: '10%', left: '15%',
            width: 280, height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,85,144,0.28), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{ opacity: [0.08, 0.16, 0.08], scale: [1, 1.06, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute"
          style={{
            bottom: '15%', right: '10%',
            width: 220, height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,130,255,0.22), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_SOFT }}
        className="relative z-10 mb-10 text-center"
      >
        <p
          className="mb-3 uppercase tracking-[0.22em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 193, 223, 0.72)',
            fontSize: '0.6rem',
          }}
        >
          everything I made for you
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 236, 246, 0.98)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          Choose where to go,{' '}
          <em style={{ fontStyle: 'italic', color: 'rgba(255, 180, 215, 0.9)' }}>Keyrin</em>
        </h1>
        <p
          className="mx-auto mt-3 max-w-[36ch]"
          style={{
            color: 'rgba(255, 200, 225, 0.7)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            lineHeight: 1.6,
          }}
        >
          Each one of these is a piece of my heart, made just for you.
        </p>
      </motion.div>

      {/* Experience grid */}
      <div className="relative z-10 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {EXPERIENCES.map((exp) => (
          <motion.div
            key={exp.href}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: exp.delay, ease: EASE_SOFT }}
            onHoverStart={() => setHovered(exp.href)}
            onHoverEnd={() => setHovered(null)}
          >
            <Link href={exp.href} className="block">
              <motion.div
                animate={{
                  boxShadow:
                    hovered === exp.href
                      ? '0 32px 64px rgba(0,0,0,0.6), 0 16px 36px rgba(247,85,144,0.32)'
                      : '0 20px 48px rgba(0,0,0,0.48), 0 8px 20px rgba(247,85,144,0.14)',
                  borderColor:
                    hovered === exp.href
                      ? 'rgba(247, 150, 200, 0.5)'
                      : 'rgba(244, 173, 210, 0.22)',
                  y: hovered === exp.href ? -4 : 0,
                }}
                transition={{ duration: 0.4, ease: EASE_SOFT }}
                className="hub-card micro-hover relative overflow-hidden rounded-[1.6rem] border px-6 py-7"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(40, 14, 32, 0.92) 0%, rgba(18, 7, 16, 0.96) 100%)',
                }}
              >
                {/* Radial glow on hover */}
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  animate={{ opacity: hovered === exp.href ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background:
                      'radial-gradient(circle at 20% 20%, rgba(255, 200, 230, 0.1), transparent 60%)',
                  }}
                />

                <div className="relative">
                  <span
                    className="mb-4 block"
                    style={{ fontSize: '2rem', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {exp.emoji}
                  </span>

                  <p
                    className="mb-1 uppercase tracking-[0.16em]"
                    style={{
                      fontFamily: 'var(--font-dm-mono)',
                      color: 'rgba(255, 171, 210, 0.7)',
                      fontSize: '0.58rem',
                    }}
                  >
                    {exp.eyebrow}
                  </p>

                  <h2
                    className="mb-2"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      color: 'rgba(255, 236, 246, 0.97)',
                      fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                      lineHeight: 1.15,
                      fontWeight: 400,
                    }}
                  >
                    {exp.title}
                  </h2>

                  <p
                    style={{
                      color: 'rgba(255, 200, 225, 0.72)',
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '0.92rem',
                      lineHeight: 1.55,
                    }}
                  >
                    {exp.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: 'var(--font-dm-mono)',
                          fontSize: '0.64rem',
                          color: 'rgba(255, 200, 225, 0.7)',
                          background: 'rgba(255,255,255,0.02)',
                          padding: '6px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div
                    className="mt-2"
                    style={{
                      fontFamily: 'var(--font-dm-mono)',
                      color: 'rgba(255, 200, 225, 0.62)',
                      fontSize: '0.72rem',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <span aria-hidden>{exp.metrics.performance}</span>
                    <span aria-hidden className="opacity-50">•</span>
                    <span aria-hidden>{exp.metrics.scale}</span>
                    <span aria-hidden className="opacity-50">•</span>
                    <span aria-hidden>{exp.metrics.results}</span>
                  </div>

                  <motion.div
                    className="mt-5 flex items-center gap-2"
                    animate={{ x: hovered === exp.href ? 4 : 0 }}
                    transition={{ duration: 0.3, ease: EASE_SOFT }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-dm-mono)',
                        fontSize: '0.64rem',
                        letterSpacing: '0.1em',
                        color: 'rgba(247, 85, 144, 0.9)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Open
                    </span>
                    <span style={{ color: 'rgba(247, 85, 144, 0.8)', fontSize: '0.9rem' }}>→</span>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-10 mt-10"
      >
        <Link
          href="/message"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.1em',
            color: 'rgba(255, 171, 210, 0.5)',
            textTransform: 'uppercase',
          }}
        >
          ← back to the message
        </Link>
      </motion.div>
    </main>
  );
}
