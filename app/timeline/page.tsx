'use client';

import { Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';
import { useCinematicScenePhase } from '@/hooks/useCinematicScenePhase';
import { useSequenceMode } from '@/hooks/useSequenceMode';
import { useEventTracking } from '@/hooks/useEventTracking';
import SequenceErrorBoundary from '@/app/_components/SequenceErrorBoundary';

function useIsIframe(): boolean {
  const [isIframe, setIsIframe] = useState(false);
  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);
  return isIframe;
}

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface MemoryBeat {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  detail: string;
  label: string;
  tint: string;
}

const MEMORIES: MemoryBeat[] = [
  {
    id: 'intro-call',
    date: 'June 2023',
    title: 'The First Long Call',
    excerpt: 'The night stretched out, and neither of us wanted to be the one to hang up.',
    detail:
      'Hours slipped by so quietly that it felt like the world had narrowed into just your voice and the way it kept pulling me closer.',
    label: 'beginning',
    tint: 'rgba(255, 165, 208, 0.92)',
  },
  {
    id: 'rain-walk',
    date: 'August 2023',
    title: 'Rain Walk and Chai',
    excerpt: 'The city blurred into soft light while we laughed at things too small for anyone else to understand.',
    detail:
      'That evening taught me how quickly ordinary weather could become part of a memory worth revisiting for the rest of my life.',
    label: 'warmth',
    tint: 'rgba(255, 198, 150, 0.88)',
  },
  {
    id: 'quiet-support',
    date: 'December 2023',
    title: 'Your Quiet Support',
    excerpt: 'You noticed the fracture before I admitted it was there.',
    detail:
      'You held space without asking for credit, and that kind of gentleness is still one of the clearest ways I know love can look.',
    label: 'anchor',
    tint: 'rgba(201, 181, 255, 0.9)',
  },
  {
    id: 'hard-night',
    date: 'March 2024',
    title: 'The Difficult Night',
    excerpt: 'The memory I return to when I need to remember what repair is supposed to cost.',
    detail:
      'It is the moment I wish I could rewrite, and the one that keeps teaching me what accountability has to look like going forward.',
    label: 'turning point',
    tint: 'rgba(255, 126, 161, 0.9)',
  },
];

const AUTOPLAY_STEP_MS = 1650;
const AUTOPLAY_FINAL_LINGER_MS = 1200;
const TIMELINE_SCENE_DURATION_MS = 8000;

function TimelinePageContent() {
  const isSequenceMode = useSequenceMode();
  const isIframe = useIsIframe();
  const { track } = useEventTracking();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFinalBeat, setIsFinalBeat] = useState(false);
  const scene = useCinematicScenePhase(isSequenceMode, 700, 1200, 3300, 1300);

  // Fix #13: only fire analytics in direct-navigation mode, not during automated sequence
  useEffect(() => {
    if (!isSequenceMode) track('timeline_viewed');
  }, [isSequenceMode, track]);

  const activeMemory = MEMORIES[activeIndex] ?? MEMORIES[0];

  // Signal the parent sequence runner when this cinematic phase is fully complete.
  useEffect(() => {
    if (!isSequenceMode || scene.phase !== 'complete') return;
    try {
      window.parent.postMessage({ type: 'yor:slide-complete' }, window.location.origin);
    } catch { /* cross-origin guard */ }
  }, [isSequenceMode, scene.phase]);

  useEffect(() => {
    if (!isSequenceMode) return;

    setActiveIndex(0);
    setIsFinalBeat(false);

    const timeoutIds: number[] = [];

    MEMORIES.forEach((_, index) => {
      timeoutIds.push(
        window.setTimeout(() => {
          setActiveIndex(index);
        }, 480 + index * AUTOPLAY_STEP_MS),
      );
    });

    timeoutIds.push(
      window.setTimeout(() => {
        setIsFinalBeat(true);
      }, 480 + MEMORIES.length * AUTOPLAY_STEP_MS - 320),
    );

    timeoutIds.push(
      window.setTimeout(() => {
        setIsFinalBeat(false);
      }, 480 + MEMORIES.length * AUTOPLAY_STEP_MS + AUTOPLAY_FINAL_LINGER_MS),
    );

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [isSequenceMode]);

  const goPrev = () => {
    setActiveIndex((index) => Math.max(index - 1, 0));
    setIsFinalBeat(false);
  };

  const goNext = () => {
    setActiveIndex((index) => Math.min(index + 1, MEMORIES.length - 1));
    setIsFinalBeat(false);
  };

  return (
    <motion.main
      id="main-content"
      className="relative flex min-h-dvh w-dvw items-center justify-center overflow-hidden px-4 py-8"
      initial={isSequenceMode ? { opacity: 0, scale: 0.94, y: 40, filter: 'blur(18px)' } : false}
      animate={
        isSequenceMode
          ? {
              opacity: scene.isExiting ? 0.5 : 1,
              scale: scene.phase === 'drift' ? 1.01 : scene.isExiting ? 1.035 : 1,
              y: scene.phase === 'drift' ? -6 : scene.isExiting ? -18 : 0,
              filter: scene.isExiting ? 'blur(10px)' : 'blur(0px)',
            }
          : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
      }
      transition={{ duration: 1.05, ease: EASE_SOFT }}
      style={{
        background:
          'radial-gradient(circle at 18% 20%, rgba(255, 196, 223, 0.16), transparent 32%), radial-gradient(circle at 84% 18%, rgba(196, 171, 255, 0.16), transparent 30%), linear-gradient(180deg, rgba(32, 10, 28, 0.98) 0%, rgba(10, 5, 14, 1) 100%)',
      }}
    >
      {!isIframe && <CharacterPageOverlayClient />}

      {isSequenceMode ? (
        <div className="pointer-events-none absolute left-5 right-5 top-5 z-20">
          <div className="h-px overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full origin-left rounded-full bg-[linear-gradient(90deg,rgba(255,165,208,0.95),rgba(255,255,255,0.82))]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: (TIMELINE_SCENE_DURATION_MS - 700) / 1000, ease: 'linear' }}
            />
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute left-[10%] top-[12%] h-44 w-44 rounded-full"
          animate={{ opacity: [0.24, 0.42, 0.24], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 150, 195, 0.26), transparent 70%)',
            filter: 'blur(22px)',
          }}
        />
        <motion.div
          className="absolute bottom-[14%] right-[10%] h-52 w-52 rounded-full"
          animate={{ opacity: [0.16, 0.3, 0.16], scale: [1, 1.12, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          style={{
            background: 'radial-gradient(circle, rgba(188, 164, 255, 0.22), transparent 72%)',
            filter: 'blur(26px)',
          }}
        />
      </div>

      {isSequenceMode ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[5]"
          aria-hidden="true"
          animate={{
            opacity:
              scene.phase === 'enter'
                ? 0.18
                : scene.phase === 'reveal'
                ? 0.08
                : scene.phase === 'drift'
                ? 0.12
                : 0.34,
          }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
          style={{
            background:
              'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.06), transparent 30%), linear-gradient(180deg, rgba(4,1,8,0.02) 0%, rgba(4,1,8,0.12) 52%, rgba(4,1,8,0.34) 100%)',
          }}
        />
      ) : null}

      <motion.section
        className="relative z-10 flex w-full max-w-6xl flex-col gap-8 rounded-[2rem] border border-white/10 bg-[rgba(12,7,17,0.72)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.48)] backdrop-blur-xl lg:flex-row lg:items-stretch lg:gap-10 lg:p-8"
        animate={
          isSequenceMode
            ? {
                scale: scene.isExiting ? 1.02 : 1,
                opacity: scene.isExiting ? 0.82 : 1,
                x: scene.phase === 'drift' ? 4 : 0,
              }
            : { scale: 1, opacity: 1, x: 0 }
        }
        transition={{ duration: 1, ease: EASE_SOFT }}
      >
        <div className="flex flex-col justify-between lg:w-[22rem]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_SOFT }}
              className="uppercase tracking-[0.22em]"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                color: 'rgba(255, 190, 224, 0.68)',
                fontSize: '0.58rem',
              }}
            >
              {isSequenceMode ? 'chapter one • autoplay' : 'chapter one'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: EASE_SOFT }}
              className="mt-3"
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: 'rgba(255, 241, 248, 0.98)',
                fontSize: 'clamp(1.9rem, 4vw, 3rem)',
                lineHeight: 1.04,
                fontWeight: 400,
              }}
            >
              Our Story
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.16, ease: EASE_SOFT }}
              className="mt-4 max-w-[28ch]"
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'rgba(255, 210, 230, 0.72)',
                fontSize: '1rem',
                lineHeight: 1.7,
              }}
            >
              A guided pass through the moments that still shape how I remember us.
            </motion.p>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
            <div className="relative pl-7">
              <div className="absolute left-2 top-2 h-[calc(100%-0.5rem)] w-px bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))]" />

              <div className="space-y-4">
                {MEMORIES.map((memory, index) => {
                  const isActive = index === activeIndex;
                  const isPast = index < activeIndex;

                  return (
                    <motion.button
                      key={memory.id}
                      type="button"
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.12, ease: EASE_SOFT }}
                      onClick={isSequenceMode ? undefined : () => setActiveIndex(index)}
                      className={`relative block w-full rounded-[1.1rem] px-3 py-3 text-left${isSequenceMode ? ' pointer-events-none opacity-50' : ''}`}
                      style={{
                        background: isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: isActive ? '0 14px 30px rgba(0,0,0,0.22)' : 'none',
                        cursor: isSequenceMode ? 'default' : 'pointer',
                        transition: 'background-color 280ms ease, border-color 280ms ease, box-shadow 280ms ease',
                      }}
                    >
                      <span
                        className="absolute left-[-1.62rem] top-[1.15rem] h-3.5 w-3.5 rounded-full border"
                        style={{
                          background: isActive || isPast ? memory.tint : 'rgba(255,255,255,0.08)',
                          borderColor: isActive ? 'rgba(255,255,255,0.54)' : 'rgba(255,255,255,0.12)',
                          boxShadow: isActive ? `0 0 18px ${memory.tint}` : 'none',
                          transition: 'all 280ms ease',
                        }}
                      />

                      <p
                        className="uppercase tracking-[0.14em]"
                        style={{
                          fontFamily: 'var(--font-dm-mono)',
                          color: isActive ? 'rgba(255, 210, 230, 0.82)' : 'rgba(255, 210, 230, 0.42)',
                          fontSize: '0.58rem',
                        }}
                      >
                        {memory.date}
                      </p>

                      <p
                        className="mt-2"
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          color: isActive ? 'rgba(255, 241, 248, 0.98)' : 'rgba(255, 232, 240, 0.72)',
                          fontSize: '1.05rem',
                          lineHeight: 1.2,
                          fontWeight: 500,
                        }}
                      >
                        {memory.title}
                      </p>

                      <p
                        className="mt-1"
                        style={{
                          fontFamily: 'var(--font-crimson)',
                          color: isActive ? 'rgba(255, 214, 232, 0.78)' : 'rgba(255, 214, 232, 0.54)',
                          fontSize: '0.88rem',
                          lineHeight: 1.55,
                        }}
                      >
                        {memory.excerpt}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="relative min-h-[27rem] flex-1 overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(160deg,rgba(39,16,31,0.9),rgba(14,8,18,0.96))] px-5 py-6 sm:px-7 sm:py-7"
          animate={
            isSequenceMode
              ? {
                  scale: scene.phase === 'drift' ? 1.012 : scene.isExiting ? 1.03 : 1,
                  x: scene.phase === 'drift' ? -8 : 0,
                  y: scene.phase === 'drift' ? -4 : scene.isExiting ? -10 : 0,
                }
              : { scale: 1, x: 0, y: 0 }
          }
          transition={{ duration: 1.05, ease: EASE_SOFT }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              background: [
                `radial-gradient(circle at 18% 16%, ${activeMemory.tint.replace('0.92', '0.18').replace('0.9', '0.18').replace('0.88', '0.18')}, transparent 34%), linear-gradient(160deg, rgba(39,16,31,0.9), rgba(14,8,18,0.96))`,
                `radial-gradient(circle at 84% 18%, ${activeMemory.tint.replace('0.92', '0.14').replace('0.9', '0.14').replace('0.88', '0.14')}, transparent 36%), linear-gradient(160deg, rgba(39,16,31,0.9), rgba(14,8,18,0.96))`,
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className="uppercase tracking-[0.18em]"
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    color: activeMemory.tint,
                    fontSize: '0.58rem',
                  }}
                >
                  {activeMemory.label}
                </p>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    color: 'rgba(255, 220, 234, 0.5)',
                    fontSize: '0.64rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  {String(activeIndex + 1).padStart(2, '0')} / {String(MEMORIES.length).padStart(2, '0')}
                </p>
              </div>

              <motion.div
                animate={{ scale: isFinalBeat ? [1, 1.08, 1] : 1 }}
                transition={{ duration: 1.2, repeat: isFinalBeat ? Infinity : 0, ease: 'easeInOut' }}
                className="rounded-full border px-3 py-2"
                style={{
                  borderColor: 'rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255, 224, 236, 0.7)',
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.56rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {isSequenceMode ? 'memory replay' : 'interactive'}
              </motion.div>
            </div>

            <div className="mt-6 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMemory.id}
                  initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                  transition={{ duration: 0.62, ease: EASE_SOFT }}
                  className="flex h-full flex-col"
                >
                  <div className="max-w-[40rem]">
                    <p
                      style={{
                        fontFamily: 'var(--font-dm-mono)',
                        color: 'rgba(255, 220, 234, 0.46)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {activeMemory.date}
                    </p>
                    <h2
                      className="mt-3"
                      style={{
                        fontFamily: 'var(--font-cormorant)',
                        color: 'rgba(255, 244, 249, 0.99)',
                        fontSize: 'clamp(1.9rem, 4vw, 3.1rem)',
                        lineHeight: 1.02,
                        fontWeight: 400,
                      }}
                    >
                      {activeMemory.title}
                    </h2>
                    <p
                      className="mt-5"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        color: 'rgba(255, 216, 233, 0.82)',
                        fontSize: 'clamp(1rem, 2vw, 1.12rem)',
                        lineHeight: 1.8,
                      }}
                    >
                      {activeMemory.detail}
                    </p>
                  </div>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.16, ease: EASE_SOFT }}
                    className="mt-7 h-px origin-left"
                    style={{
                      background: `linear-gradient(90deg, ${activeMemory.tint}, rgba(255,255,255,0))`,
                    }}
                  />

                  <motion.div
                    className="mt-auto rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.18, ease: EASE_SOFT }}
                  >
                    <p
                      className="uppercase tracking-[0.14em]"
                      style={{
                        fontFamily: 'var(--font-dm-mono)',
                        color: 'rgba(255, 208, 228, 0.46)',
                        fontSize: '0.56rem',
                      }}
                    >
                      What stayed with me
                    </p>
                    <p
                      className="mt-3"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        color: 'rgba(255, 230, 240, 0.8)',
                        fontSize: '0.96rem',
                        lineHeight: 1.7,
                      }}
                    >
                      {activeMemory.excerpt}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6">
              <div
                className="h-px overflow-hidden rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                aria-hidden="true"
              >
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${((activeIndex + 1) / MEMORIES.length) * 100}%` }}
                  transition={{ duration: 0.45, ease: EASE_SOFT }}
                  style={{
                    background: `linear-gradient(90deg, ${activeMemory.tint}, rgba(255,255,255,0.82))`,
                  }}
                />
              </div>

              {!isSequenceMode ? (
                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                    className="rounded-full px-5 py-2.5"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: activeIndex === 0 ? 'rgba(255,220,234,0.24)' : 'rgba(255,220,234,0.66)',
                      cursor: activeIndex === 0 ? 'default' : 'pointer',
                      fontFamily: 'var(--font-dm-mono)',
                      fontSize: '0.64rem',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={activeIndex === MEMORIES.length - 1}
                    className="rounded-full px-6 py-2.5"
                    style={{
                      background:
                        activeIndex === MEMORIES.length - 1
                          ? 'rgba(255,255,255,0.04)'
                          : `linear-gradient(90deg, ${activeMemory.tint}, rgba(247, 85, 144, 0.96))`,
                      border:
                        activeIndex === MEMORIES.length - 1
                          ? '1px solid rgba(255,255,255,0.1)'
                          : 'none',
                      color: '#fff',
                      cursor: activeIndex === MEMORIES.length - 1 ? 'default' : 'pointer',
                      fontFamily: 'var(--font-dm-mono)',
                      fontSize: '0.64rem',
                      letterSpacing: '0.1em',
                      boxShadow:
                        activeIndex === MEMORIES.length - 1
                          ? 'none'
                          : '0 10px 24px rgba(247, 85, 144, 0.24)',
                    }}
                  >
                    {activeIndex === MEMORIES.length - 1 ? 'Finished' : 'Next Memory'}
                  </button>
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mt-5"
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    color: 'rgba(255, 214, 232, 0.42)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  This chapter now plays itself from first memory to last.
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {!isSequenceMode ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-6 left-0 right-0 z-20 flex justify-center"
        >
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              color: 'rgba(255, 190, 224, 0.4)',
              textTransform: 'uppercase',
            }}
          >
            ← back
          </Link>
        </motion.div>
      ) : null}
    </motion.main>
  );
}

export default function TimelinePage() {
  return (
    <SequenceErrorBoundary>
      <Suspense fallback={null}>
        <TimelinePageContent />
      </Suspense>
    </SequenceErrorBoundary>
  );
}
