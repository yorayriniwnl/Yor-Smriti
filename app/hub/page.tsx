'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MemoryTimeline, { MemoryItem } from '@/components/ui/MemoryTimeline';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { useEventTracking } from '@/hooks/useEventTracking';
import { ScrollReset } from '@/components/ui/ScrollReset';
import { type BookmarkData } from '@/components/ui/BookmarkButton';
import { EXPERIENCE_CATALOG } from '@/lib/experienceCatalog';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const VISITED_KEY = 'ys_visited_experiences';

function getVisited(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(VISITED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

function markVisited(href: string) {
  try {
    const v = getVisited(); v.add(href);
    localStorage.setItem(VISITED_KEY, JSON.stringify([...v]));
  } catch { /* ignore */ }
}

function getBookmark(): BookmarkData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('ys_bookmark');
    return raw ? (JSON.parse(raw) as BookmarkData) : null;
  } catch { return null; }
}

const SAMPLE_MEMORIES: MemoryItem[] = [
  { id: 'm1', date: '2024-02-14', title: 'The Call That Did Not End',            excerpt: 'We ran out of things to say and stayed on the line anyway.',                         details: 'It was late. The conversation had wound down naturally but neither of us hung up. We just stayed there in the quiet. I listened to you breathe and thought — this is enough. This is more than enough. You fell asleep before I did. I stayed on the line until the call dropped on its own.', tags: ['closeness', 'quiet'] },
  { id: 'm2', date: '2024-05-09', title: 'When You Talked About What You Loved', excerpt: 'Your whole voice changed. I have thought about that moment many times since.',       details: 'You were talking about something that mattered to you — something you cared about deeply and rarely said out loud. Your voice went softer and more certain at the same time. I remember sitting very still, not wanting to interrupt, thinking: I have never felt this lucky to be listening to someone.', tags: ['love', 'attention'] },
  { id: 'm3', date: '2024-08-22', title: 'Nothing Happened and That Was Everything', excerpt: 'A quiet evening with no agenda that somehow became one of the best.',             details: 'We were not doing anything in particular. No plan, no occasion. Just together. I remember thinking at some point — I do not need anything else right now. This is it. I did not say that. I should have said that.', tags: ['ordinary', 'present'] },
  { id: 'm4', date: '2024-11-03', title: 'The Thing You Called Out',             excerpt: 'You said something true that I was not ready to hear. I got defensive.',             details: 'You told me — clearly, without cruelty — that I was pulling away. That you could feel it. That it was not okay. I deflected instead of listening. I have replayed that conversation a hundred times since. You were right about every word of it. I am sorry it took me this long to say that plainly.', tags: ['honesty', 'regret'] },
  { id: 'm5', date: '2025-01-18', title: 'The Last Good Night',                  excerpt: 'The last time things felt the way they used to. I did not know it then.',           details: 'I did not know it was the last good night when it happened. It felt normal. It felt like us. I keep thinking — if I had known, I would have stayed in it longer. I would have said more. I would not have taken any of it for granted.', tags: ['loss', 'memory'] },
];

export default function HubPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [bookmark, setBookmark] = useState<BookmarkData | null>(null);
  const { track } = useEventTracking();

  useEffect(() => {
    track('experience_opened');
    setVisited(getVisited());
    setBookmark(getBookmark());
  }, [track]);

  return (
    <main
      id="main-content"
      className="relative flex min-h-dvh w-dvw flex-col items-center justify-center overflow-hidden px-4 py-12"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <ScrollReset />
      <CharacterPageOverlayClient />

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <motion.div
          animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute"
          style={{ top: '10%', left: '15%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,85,144,0.28), transparent 70%)', filter: 'blur(40px)' }}
        />
        <motion.div
          animate={{ opacity: [0.08, 0.16, 0.08], scale: [1, 1.06, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute"
          style={{ bottom: '15%', right: '10%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,130,255,0.22), transparent 70%)', filter: 'blur(40px)' }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_SOFT }}
        className="relative z-10 mb-10 text-center"
      >
        <p className="mb-3 uppercase tracking-[0.22em]" style={{ fontFamily: 'var(--font-dm-mono)', color: 'rgba(255, 193, 223, 0.72)', fontSize: '0.6rem' }}>
          Experiences
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255, 236, 246, 0.98)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.1, fontWeight: 400 }}>
          Explore experiences
        </h1>
        <p className="mx-auto mt-3 max-w-[36ch]" style={{ color: 'rgba(255, 200, 225, 0.7)', fontFamily: 'var(--font-crimson)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6 }}>
          Interactive, cinematic experiences for reflection and repair.
        </p>

        {/* Bookmark return prompt */}
        <AnimatePresence>
          {bookmark && bookmark.href !== '/hub' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.6, duration: 0.6, ease: EASE_SOFT }}
              className="mt-5 flex items-center justify-center gap-2"
            >
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.56rem', letterSpacing: '0.1em', color: 'rgba(255, 171, 210, 0.5)', textTransform: 'uppercase' }}>
                You were reading something
              </span>
              <Link
                href={bookmark.href}
                style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.56rem', letterSpacing: '0.1em', color: 'rgba(247, 110, 165, 0.85)', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(247,110,165,0.35)', paddingBottom: '1px' }}
              >
                {bookmark.title} →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Cards grid */}
      <div className="relative z-10 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {EXPERIENCE_CATALOG.map((exp, index) => {
          const isVisited = visited.has(exp.href);
          const isHovered = hovered === exp.href;

          return (
            <motion.div
              key={exp.href}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.06, ease: EASE_SOFT }}
              onHoverStart={() => setHovered(exp.href)}
              onHoverEnd={() => setHovered(null)}
            >
              <Link href={exp.href} className="block" onClick={() => markVisited(exp.href)}>
                <motion.div
                  animate={{
                    boxShadow: isHovered
                      ? '0 32px 64px rgba(0,0,0,0.6), 0 16px 36px rgba(247,85,144,0.32)'
                      : isVisited
                      ? '0 20px 48px rgba(0,0,0,0.48), 0 8px 20px rgba(247,130,175,0.2)'
                      : '0 20px 48px rgba(0,0,0,0.48), 0 8px 20px rgba(247,85,144,0.14)',
                    borderColor: isHovered
                      ? 'rgba(247, 150, 200, 0.5)'
                      : isVisited
                      ? 'rgba(247, 150, 200, 0.32)'
                      : 'rgba(244, 173, 210, 0.22)',
                    y: isHovered ? -4 : 0,
                  }}
                  transition={{ duration: 0.4, ease: EASE_SOFT }}
                  className="hub-card micro-hover relative overflow-hidden rounded-[1.6rem] border px-6 py-7"
                  style={{
                    background: isVisited
                      ? 'linear-gradient(160deg, rgba(44, 16, 34, 0.94) 0%, rgba(20, 8, 18, 0.97) 100%)'
                      : 'linear-gradient(160deg, rgba(40, 14, 32, 0.92) 0%, rgba(18, 7, 16, 0.96) 100%)',
                  }}
                >
                  {/* Hover radial */}
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255, 200, 230, 0.1), transparent 60%)' }}
                    aria-hidden="true"
                  />
                  {/* Visited warm glow */}
                  {isVisited && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      aria-hidden="true"
                      style={{ background: 'radial-gradient(ellipse at 80% 10%, rgba(247,130,175,0.07), transparent 55%)' }}
                    />
                  )}

                  <div className="relative">
                    {/* Emoji row + visited dot */}
                    <div className="mb-4 flex items-start justify-between">
                      <span style={{ fontSize: '2rem', lineHeight: 1 }} aria-hidden>{exp.emoji}</span>
                      {isVisited && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          aria-label="Visited"
                          title="You've been here"
                          style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(247, 130, 175, 0.75)', marginTop: 4, boxShadow: '0 0 6px rgba(247,130,175,0.45)', flexShrink: 0 }}
                        />
                      )}
                    </div>

                    <p className="mb-1 uppercase tracking-[0.16em]" style={{ fontFamily: 'var(--font-dm-mono)', color: 'rgba(255, 171, 210, 0.7)', fontSize: '0.58rem' }}>
                      {exp.eyebrow}
                    </p>
                    <h2 className="mb-2" style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255, 236, 246, 0.97)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', lineHeight: 1.15, fontWeight: 400 }}>
                      {exp.title}
                    </h2>
                    <p style={{ color: 'rgba(255, 200, 225, 0.72)', fontFamily: 'var(--font-crimson)', fontSize: '0.92rem', lineHeight: 1.55 }}>
                      {exp.description}
                    </p>
                    <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.88rem', color: 'rgba(255,200,225,0.65)', lineHeight: 1.4, marginTop: '0.5rem', fontStyle: 'italic' }}>
                      {exp.feeling}
                    </p>

                    <motion.div
                      className="mt-5 flex items-center gap-2"
                      animate={{ x: isHovered ? 4 : 0 }}
                      transition={{ duration: 0.3, ease: EASE_SOFT }}
                    >
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.64rem', letterSpacing: '0.1em', color: 'rgba(247, 85, 144, 0.9)', textTransform: 'uppercase' }}>
                        {isVisited ? 'Revisit' : 'Open'}
                      </span>
                      <span style={{ color: 'rgba(247, 85, 144, 0.8)', fontSize: '0.9rem' }}>→</span>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline + footer */}
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
          style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(255, 171, 210, 0.5)', textTransform: 'uppercase' }}
        >
          ← Back to message
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <LogoutButton />
        </div>
      </motion.div>
    </main>
  );
}
