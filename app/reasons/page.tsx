'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';
import { useSequenceMode } from '@/hooks/useSequenceMode';
import SequenceErrorBoundary from '@/app/_components/SequenceErrorBoundary';

function useIsIframe(): boolean {
  const [isIframe, setIsIframe] = useState(false);
  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);
  return isIframe;
}

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface ReasonCard {
  id: string;
  number: number;
  reason: string;
  sub?: string;
  shade: 'rose' | 'mauve' | 'gold' | 'blush' | 'lavender';
}

// ─── Replace these with your real reasons ─────────────────────────────────────
const REASONS: ReasonCard[] = [
  { id: 'r1',  number: 1,  reason: 'The way you laughed and then immediately tried to hide it — like you were embarrassed to find something that funny. That split second before you gave in. I replayed it more than I should admit.', shade: 'rose' },
  { id: 'r2',  number: 2,  reason: 'How you check on people without announcing it. No post, no credit, no audience. You just quietly make sure the people you love are okay. I noticed every single time.', shade: 'blush' },
  { id: 'r3',  number: 3,  reason: 'The way you go still when you are actually listening — not performing attention, but fully in it. Most people are already forming their reply. You were never doing that.', shade: 'mauve' },
  { id: 'r4',  number: 4,  reason: 'That you say what you mean, even when it is uncomfortable. You never made me guess. That kind of honesty is rarer than people think, and I did not value it the way I should have.', shade: 'gold' },
  { id: 'r5',  number: 5,  reason: 'How you talk about the things you love — your whole face changes. Your voice shifts. It is like watching someone become completely themselves. I could have listened for hours.', shade: 'lavender' },
  { id: 'r6',  number: 6,  reason: 'The fact that you remember the small things people tell you and bring them back weeks later. Not because you were keeping notes — just because you actually cared.', shade: 'rose' },
  { id: 'r7',  number: 7,  reason: 'Your stubbornness. I know it frustrated me sometimes. But it also meant that when you chose something — or someone — you did not take it lightly. I understand that now.', shade: 'blush' },
  { id: 'r8',  number: 8,  reason: 'The way you make a quiet evening feel like it is enough. No agenda, no performance. Just being somewhere with you had a weight to it that I have not found anywhere else.', shade: 'mauve' },
  { id: 'r9',  number: 9,  reason: 'That you hold yourself to a standard most people would quietly lower. You notice when you have fallen short before anyone else does. That kind of self-awareness is not easy to carry.', shade: 'gold' },
  { id: 'r10', number: 10, reason: 'The night you stayed on the call even when there was nothing left to say — just so neither of us had to hang up first.', sub: 'I have thought about that more times than I can count.', shade: 'lavender' },
  { id: 'r11', number: 11, reason: 'How you get indignant on behalf of other people. When something is unfair to someone you care about, it bothers you more than if it had happened to you. That is not common. That is you.', shade: 'rose' },
  { id: 'r12', number: 12, reason: 'The way you give people the benefit of the doubt — not naively, but generously. You assume the better version of people until they prove otherwise. I want to be more like that.', shade: 'blush' },
  { id: 'r13', number: 13, reason: 'Your laugh when something genuinely surprises you — unguarded, a little unhinged, completely real. Every other version is fine. That one was my favourite.', shade: 'mauve' },
  { id: 'r14', number: 14, reason: 'Who I was around you. More careful with words. More present. Less in my own head. I did not always live up to that version of myself — but you are the reason it existed at all.', shade: 'gold' },
  { id: 'r15', number: 15, reason: 'You, Smriti. Not a curated version, not the highlights — all of it. The warmth and the hard edges and the silences and the way you love people. All of it.', sub: 'Always.', shade: 'lavender' },
];

const SEQUENCE_REASONS: ReasonCard[] = [REASONS[0], REASONS[3], REASONS[8], REASONS[14]];

const SHADE_STYLES: Record<ReasonCard['shade'], {
  card: string; border: string; number: string; accent: string; glow: string;
}> = {
  rose: {
    card: 'linear-gradient(160deg, rgba(45, 14, 30, 0.95) 0%, rgba(20, 7, 16, 0.98) 100%)',
    border: 'rgba(247, 130, 160, 0.35)',
    number: 'rgba(247, 110, 150, 0.7)',
    accent: 'rgba(255, 160, 190, 0.9)',
    glow: 'rgba(247, 85, 144, 0.2)',
  },
  blush: {
    card: 'linear-gradient(160deg, rgba(42, 16, 35, 0.95) 0%, rgba(18, 8, 18, 0.98) 100%)',
    border: 'rgba(240, 160, 200, 0.32)',
    number: 'rgba(240, 140, 185, 0.68)',
    accent: 'rgba(255, 185, 220, 0.88)',
    glow: 'rgba(230, 100, 170, 0.16)',
  },
  mauve: {
    card: 'linear-gradient(160deg, rgba(38, 18, 42, 0.95) 0%, rgba(16, 8, 20, 0.98) 100%)',
    border: 'rgba(210, 160, 240, 0.3)',
    number: 'rgba(195, 140, 235, 0.65)',
    accent: 'rgba(220, 180, 250, 0.85)',
    glow: 'rgba(180, 100, 230, 0.14)',
  },
  gold: {
    card: 'linear-gradient(160deg, rgba(40, 20, 16, 0.95) 0%, rgba(16, 8, 8, 0.98) 100%)',
    border: 'rgba(230, 190, 100, 0.28)',
    number: 'rgba(220, 175, 80, 0.62)',
    accent: 'rgba(245, 210, 130, 0.85)',
    glow: 'rgba(210, 170, 70, 0.16)',
  },
  lavender: {
    card: 'linear-gradient(160deg, rgba(28, 18, 44, 0.95) 0%, rgba(12, 8, 22, 0.98) 100%)',
    border: 'rgba(180, 170, 240, 0.3)',
    number: 'rgba(165, 155, 235, 0.62)',
    accent: 'rgba(200, 190, 250, 0.85)',
    glow: 'rgba(140, 120, 220, 0.14)',
  },
};

function ReasonsPageContent() {
  const isSequenceMode = useSequenceMode();
  const isIframe = useIsIframe();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [completed, setCompleted] = useState(false);

  const visibleReasons = isSequenceMode ? SEQUENCE_REASONS : REASONS;
  const total = visibleReasons.length;
  const card = visibleReasons[current] ?? visibleReasons[visibleReasons.length - 1];
  const style = SHADE_STYLES[card.shade];

  // Signal parent slideshow when this slide's autoplay finishes
  useEffect(() => {
    if (!isSequenceMode || !completed) return;
    try {
      window.parent.postMessage({ type: 'yor:slide-complete' }, window.location.origin);
    } catch { /* cross-origin guard */ }
  }, [isSequenceMode, completed]);

  useEffect(() => {
    if (!isSequenceMode) return;

    setCurrent(0);
    setDirection(1);
    setCompleted(false);

    const timeoutIds: number[] = [];

    visibleReasons.forEach((_, index) => {
      if (index === 0) return;

      timeoutIds.push(
        window.setTimeout(() => {
          setDirection(1);
          setCurrent(index);
        }, 1100 + index * 1150),
      );
    });

    timeoutIds.push(
      window.setTimeout(() => {
        setCompleted(true);
      }, 1100 + visibleReasons.length * 1150),
    );

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [isSequenceMode, visibleReasons]);

  const goNext = useCallback(() => {
    if (current < total - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
    } else {
      setCompleted(true);
    }
  }, [current, total]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
      setCompleted(false);
    }
  }, [current]);

  const variants = {
    enter: (dir: number) => ({
      x: dir * 60,
      opacity: 0,
      scale: 0.96,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir * -60,
      opacity: 0,
      scale: 0.96,
    }),
  };

  return (
    <main
      id="main-content"
      className="relative flex h-dvh w-dvw flex-col items-center justify-center overflow-hidden px-4"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      {!isIframe && <CharacterPageOverlayClient />}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_SOFT }}
        className="mb-8 text-center"
      >
        <p
          className="mb-1 uppercase tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 171, 210, 0.65)',
            fontSize: '0.58rem',
          }}
        >
          {isSequenceMode ? 'from my heart • autoplay' : 'from my heart'}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 236, 246, 0.96)',
            fontSize: 'clamp(1.7rem, 4vw, 2.6rem)',
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          Why I Love You
        </h1>
      </motion.div>

      {/* Progress bar */}
      <div
        className="mb-8 h-px w-full max-w-sm overflow-hidden rounded-full"
        style={{ background: 'rgba(244,173,210,0.12)' }}
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemax={total}
      >
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.6, ease: EASE_SOFT }}
          style={{
            background: 'linear-gradient(90deg, rgba(247,85,144,0.7), rgba(220,130,200,0.7))',
          }}
        />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm" style={{ minHeight: 320 }}>
        <AnimatePresence mode="wait" custom={direction}>
          {!completed ? (
            <motion.div
              key={card.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: EASE_SOFT }}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.8rem] border px-7 py-8"
              style={{
                background: style.card,
                borderColor: style.border,
                boxShadow: `0 28px 56px rgba(0,0,0,0.55), 0 12px 28px ${style.glow}`,
              }}
            >
              {/* Ambient glow */}
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(ellipse at 15% 15%, ${style.glow.replace('0.2', '0.3').replace('0.16', '0.22').replace('0.14', '0.18').replace('0.16', '0.2')}, transparent 60%)`,
                }}
              />

              <div className="relative flex flex-1 flex-col">
                {/* Card number */}
                <p
                  className="mb-6 uppercase tracking-[0.2em]"
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    color: style.number,
                    fontSize: '0.62rem',
                  }}
                >
                  Reason {String(isSequenceMode ? current + 1 : card.number).padStart(2, '0')} of {String(total).padStart(2, '0')}
                </p>

                {/* Reason text */}
                <p
                  className="flex-1"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    color: 'rgba(255, 236, 246, 0.97)',
                    fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)',
                    lineHeight: 1.4,
                    fontWeight: 400,
                    fontStyle: 'italic',
                  }}
                >
                  {card.reason}
                </p>

                {card.sub && (
                  <p
                    className="mt-4"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      color: style.accent,
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {card.sub}
                  </p>
                )}

                {/* Bottom accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease: EASE_SOFT, delay: 0.2 }}
                  className="mt-6 h-px origin-left"
                  style={{
                    background: `linear-gradient(to right, ${style.border}, transparent)`,
                  }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE_SOFT }}
              className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[1.8rem] border px-7 py-8 text-center"
              style={{
                background: 'linear-gradient(160deg, rgba(45, 14, 32, 0.96) 0%, rgba(18, 7, 16, 0.99) 100%)',
                borderColor: 'rgba(247, 130, 160, 0.38)',
                boxShadow: '0 28px 56px rgba(0,0,0,0.55), 0 12px 28px rgba(247,85,144,0.22)',
              }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(circle at 50% 30%, rgba(247,85,144,0.14), transparent 60%)',
                }}
              />
              <div className="relative">
                <p style={{ fontSize: '2.4rem', lineHeight: 1, marginBottom: '1.2rem' }} aria-hidden="true">
                  🌸
                </p>
                <h2
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    color: 'rgba(255, 236, 246, 0.98)',
                    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                    lineHeight: 1.2,
                    fontStyle: 'italic',
                  }}
                >
                  And there are more.
                </h2>
                <p
                  className="mx-auto mt-4 max-w-[30ch]"
                  style={{
                    color: 'rgba(255, 195, 225, 0.75)',
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  }}
                >
                  These {total} are just the ones I could write down. The rest live in how I feel around you.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE_SOFT }}
        className="mt-10 flex items-center gap-4"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={current === 0}
          className="h-11 rounded-full px-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(244,173,210,0.2)',
            color: current === 0 ? 'rgba(255,171,210,0.25)' : 'rgba(255,171,210,0.7)',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            cursor: current === 0 ? 'default' : 'pointer',
            transition: 'all 300ms ease',
          }}
          aria-label="Previous reason"
        >
          ← prev
        </button>

        <button
          type="button"
          className="h-11 rounded-full px-8"
          style={{
            background: completed
              ? 'rgba(255,255,255,0.04)'
              : 'linear-gradient(90deg, rgba(255,133,179,0.95), rgba(247,85,144,0.95))',
            border: completed ? '1px solid rgba(244,173,210,0.2)' : 'none',
            color: '#fff',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            boxShadow: completed ? 'none' : '0 8px 24px rgba(247,85,144,0.28)',
            cursor: 'pointer',
            transition: 'all 300ms ease',
          }}
          aria-label={completed ? 'Go back to hub' : 'Next reason'}
          onClick={completed
            ? (isSequenceMode ? undefined : () => { window.location.assign('/'); })
            : goNext}
        >
          {completed ? 'done ✓' : 'next →'}
        </button>
      </motion.div>

      {/* Counter text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-4"
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.08em',
          color: 'rgba(255,171,210,0.35)',
        }}
        aria-live="polite"
      >
        {completed ? 'all done' : `${current + 1} / ${total}`}
      </motion.p>

      {/* Back */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute bottom-6 left-0 right-0 flex justify-center"
      >
        <Link
          href="/hub"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'rgba(255,171,210,0.35)',
            textTransform: 'uppercase',
          }}
        >
          ← back
        </Link>
      </motion.div>
    </main>
  );
}

export default function ReasonsPage() {
  return (
    <SequenceErrorBoundary>
      <Suspense fallback={null}>
        <ReasonsPageContent />
      </Suspense>
    </SequenceErrorBoundary>
  );
}
