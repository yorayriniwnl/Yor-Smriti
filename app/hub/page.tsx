'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MemoryTimeline, { MemoryItem } from '@/components/ui/MemoryTimeline';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { useEventTracking } from '@/hooks/useEventTracking';

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
    eyebrow: 'timeline',
    title: 'Memory Timeline',
    description: 'Review key moments on a focused timeline.',
    emoji: '🌙',
    delay: 0.1,
    tech: ['Next.js', 'React', 'Framer Motion'],
    metrics: {
      performance: 'Instant',
      scale: 'Thousands of moments',
      results: 'Reflective engagement',
    },
  },
  {
    href: '/reasons',
    eyebrow: 'reasons',
    title: 'Why I Love You',
    description: 'Short, shareable reasons presented as a concise deck.',
    emoji: '🌸',
    delay: 0.2,
    tech: ['React', 'Tailwind', 'Accessible UI'],
    metrics: {
      performance: 'Fast',
      scale: 'Dozens of items',
      results: 'Clarified sentiment',
    },
  },
  {
    href: '/stars',
    eyebrow: 'visual',
    title: 'Our Constellation',
    description: 'Interactive starfield that surfaces memories.',
    emoji: '✨',
    delay: 0.3,
    tech: ['Three.js', 'React', 'WebGL'],
    metrics: {
      performance: '60fps on modern devices',
      scale: 'Hundreds of stars',
      results: 'High immersion',
    },
  },
  {
    href: '/promise',
    eyebrow: 'commitments',
    title: 'My Promises',
    description: 'Simple, revisitable commitments to support accountability.',
    emoji: '🕯️',
    delay: 0.4,
    tech: ['React', 'LocalStorage', 'Animations'],
    metrics: {
      performance: 'Local-first',
      scale: 'Per-user commitments',
      results: 'Improved accountability',
    },
  },
];

export default function HubPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { track } = useEventTracking();

  useEffect(() => {
    track('experience_opened');
  }, [track]);

  const SAMPLE_MEMORIES: MemoryItem[] = [
    {
      id: 'm1',
      date: '2024-09-12',
      title: 'First Conversation',
      excerpt: 'A small but meaningful conversation about expectations and care.',
      details:
        'We talked about small, actionable gestures and why they matter. This memory helped us establish a pattern of checking in regularly.',
      tags: ['talk', 'check-in'],
    },
    {
      id: 'm2',
      date: '2025-01-03',
      title: 'Dinner on New Year',
      excerpt: 'Celebratory dinner that turned into a deep conversation about the year ahead.',
      details:
        'Shared hopes and vulnerabilities. We made a promise to make space for weekly check-ins, which lasted for months and helped clarify priorities.',
      tags: ['celebration', 'promise'],
    },
    {
      id: 'm3',
      date: '2025-06-18',
      title: 'Small Apology',
      excerpt: 'A sincere apology that mended a misunderstanding quickly.',
      details: 'We practiced short, clear apologies and immediate repair gestures. It reduced friction and increased trust.',
      tags: ['apology', 'repair'],
    },
    {
      id: 'm4',
      date: '2025-11-02',
      title: 'Quiet Support',
      excerpt: 'A quiet night where listening mattered more than fixing.',
      details: 'Being present and listening strengthened our emotional connection. This memory is a reference for holding space.',
      tags: ['support', 'listening'],
    },
  ];

  return (
    <main
      id="main-content"
      className="relative flex min-h-dvh w-dvw flex-col items-center justify-center overflow-hidden px-4 py-12"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <CharacterPageOverlayClient />
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
          Experiences
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
          Explore experiences
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
          Interactive, cinematic experiences for reflection and repair.
        </p>
      </motion.div>

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
                  background: 'linear-gradient(160deg, rgba(40, 14, 32, 0.92) 0%, rgba(18, 7, 16, 0.96) 100%)',
                }}
              >
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  animate={{ opacity: hovered === exp.href ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: 'radial-gradient(circle at 20% 20%, rgba(255, 200, 230, 0.1), transparent 60%)',
                  }}
                />

                <div className="relative">
                  <span className="mb-4 block" style={{ fontSize: '2rem', lineHeight: 1 }} aria-hidden>
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-10 mt-10"
      >
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-mono uppercase text-pink-200">Timeline</h3>
          <MemoryTimeline memories={SAMPLE_MEMORIES} />
        </div>
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
          ← Back to message
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <Link
            href="/admin"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              color: 'rgba(255,150,185,0.35)',
              textTransform: 'uppercase',
            }}
          >
            Analytics
          </Link>
          <LogoutButton />
        </div>
      </motion.div>
    </main>
  );
}
