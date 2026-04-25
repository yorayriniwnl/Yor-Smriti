'use client';

import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';
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

interface Promise {
  id: string;
  number: number;
  title: string;
  body: string;
  weight: 'light' | 'medium' | 'heavy';
}

// ─── Replace with your real promises ─────────────────────────────────────────
const PROMISES: Promise[] = [
  {
    id: 'p1',
    number: 1,
    title: '[SHORT TITLE — e.g. "I will not disappear."]',
    body: '[SPECIFIC BODY — not a general statement, but what this actually means in your case. e.g. "Not when things get uncomfortable. Not when I do not know what to say. I used to go quiet for days — that was not giving you space, that was avoiding you. I will not do that again."]',
    weight: 'heavy',
  },
  {
    id: 'p2',
    number: 2,
    title: '[SHORT TITLE]',
    body: '[SPECIFIC BODY — tied to something real that happened between you]',
    weight: 'medium',
  },
  {
    id: 'p3',
    number: 3,
    title: '[SHORT TITLE]',
    body: '[SPECIFIC BODY]',
    weight: 'medium',
  },
  {
    id: 'p4',
    number: 4,
    title: '[SHORT TITLE — e.g. "I will choose you intentionally."]',
    body: '[SPECIFIC BODY — e.g. "Not out of habit, not because it is easier than being alone. Because I want to. Every day as a decision."]',
    weight: 'heavy',
  },
  {
    id: 'p5',
    number: 5,
    title: '[SHORT TITLE — e.g. "I will earn trust back, not ask for it."]',
    body: '[SPECIFIC BODY — e.g. "I know I cannot say \'trust me\' and have that mean anything right now. I am not asking you to. I am saying I understand that trust is rebuilt through consistency over months, not through a conversation."]',
    weight: 'heavy',
  },
  {
    id: 'p6',
    number: 6,
    title: '[SHORT TITLE — lighter tone, something personal]',
    body: '[SPECIFIC BODY — can reference a specific small habit or gesture you know matters to her]',
    weight: 'light',
  },
];

const SEQUENCE_PROMISES: Promise[] = [PROMISES[0], PROMISES[1], PROMISES[3], PROMISES[4], PROMISES[5]];

const WEIGHT_STYLES: Record<Promise['weight'], {
  border: string;
  titleColor: string;
  numberColor: string;
  glow: string;
  bodyColor: string;
}> = {
  light: {
    border: 'rgba(244,173,210,0.2)',
    titleColor: 'rgba(255, 236, 246, 0.93)',
    numberColor: 'rgba(255, 171, 210, 0.55)',
    glow: 'rgba(247, 85, 144, 0.1)',
    bodyColor: 'rgba(255, 200, 228, 0.7)',
  },
  medium: {
    border: 'rgba(244,173,210,0.3)',
    titleColor: 'rgba(255, 240, 248, 0.96)',
    numberColor: 'rgba(255, 150, 195, 0.65)',
    glow: 'rgba(247, 85, 144, 0.15)',
    bodyColor: 'rgba(255, 208, 232, 0.78)',
  },
  heavy: {
    border: 'rgba(244,173,210,0.44)',
    titleColor: 'rgba(255, 245, 252, 0.99)',
    numberColor: 'rgba(247, 110, 165, 0.8)',
    glow: 'rgba(247, 85, 144, 0.24)',
    bodyColor: 'rgba(255, 218, 238, 0.88)',
  },
};

// ─── Hold-to-seal button ─────────────────────────────────────────────────────
function SealButton({ onSealed, autoplay = false }: { onSealed: () => void; autoplay?: boolean }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sealed, setSealed] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const progressRef = useRef(0);  // mirrors progress state for use in callbacks
  const autoStartTimeoutRef = useRef<number | null>(null);
  const holdMs = autoplay ? 1700 : 2800;

  const startHold = useCallback(() => {
    if (sealed) return;
    setHolding(true);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const pct = Math.min((now - (startRef.current ?? now)) / holdMs, 1);
      setProgress(pct);
      progressRef.current = pct;
      if (pct >= 1) {
        setSealed(true);
        setHolding(false);
        setTimeout(onSealed, 800);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [holdMs, sealed, onSealed]);

  const stopHold = useCallback(() => {
    if (sealed) return;
    setHolding(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // Fix #15: animate progress back to 0 over 400ms instead of snapping
    const resetStart = performance.now();
    const startPct = progressRef.current;
    const resetTick = (now: number) => {
      const elapsed = now - resetStart;
      const pct = Math.max(0, startPct * (1 - elapsed / 400));
      setProgress(pct);
      progressRef.current = pct;
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(resetTick);
      }
    };
    rafRef.current = requestAnimationFrame(resetTick);
  }, [sealed]);

  useEffect(() => {
    if (!autoplay || sealed) return;

    autoStartTimeoutRef.current = window.setTimeout(() => {
      startHold();
    }, 240);

    return () => {
      if (autoStartTimeoutRef.current) {
        window.clearTimeout(autoStartTimeoutRef.current);
        autoStartTimeoutRef.current = null;
      }
    };
  }, [autoplay, sealed, startHold]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (autoStartTimeoutRef.current) window.clearTimeout(autoStartTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <p
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.12em',
          color: 'rgba(255, 171, 210, 0.55)',
          textTransform: 'uppercase',
        }}
      >
        {sealed ? 'promise sealed' : autoplay ? 'sealing this promise' : 'hold to seal this promise'}
      </p>

      <motion.button
        type="button"
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={(e) => { e.preventDefault(); startHold(); }}
        onTouchEnd={stopHold}
        onTouchCancel={stopHold}
        disabled={sealed}
        animate={sealed ? { scale: 1.08 } : {}}
        transition={{ duration: 0.4, ease: EASE_SOFT }}
        className="relative overflow-hidden rounded-full"
        style={{
          width: 96, height: 96,
          background: sealed
            ? 'linear-gradient(135deg, rgba(247,85,144,0.9), rgba(200,60,130,0.9))'
            : 'rgba(255,255,255,0.04)',
          border: `1px solid ${sealed ? 'rgba(247,130,170,0.6)' : 'rgba(244,173,210,0.3)'}`,
          boxShadow: sealed
            ? '0 0 40px rgba(247,85,144,0.35), 0 12px 28px rgba(0,0,0,0.4)'
            : '0 8px 20px rgba(0,0,0,0.3)',
          cursor: sealed || autoplay ? 'default' : 'pointer',
          pointerEvents: autoplay ? 'none' : 'auto',
          transition: 'background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease',
        }}
        aria-label={sealed ? 'Promise sealed' : 'Hold to seal promise'}
      >
        {/* Progress ring */}
        <svg className="absolute inset-0" width={96} height={96} aria-hidden="true">
          <circle
            cx={48} cy={48} r={44}
            fill="none"
            stroke="rgba(247,85,144,0.7)"
            strokeWidth="2"
            strokeDasharray={`${progress * 276.5} 276.5`}
            strokeLinecap="round"
            transform="rotate(-90 48 48)"
          />
        </svg>

        <span
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: sealed ? '1.8rem' : '1.4rem',
            lineHeight: 1,
            transition: 'font-size 0.4s ease',
          }}
          aria-hidden="true"
        >
          {sealed ? '🕊️' : holding ? '🤍' : '🌹'}
        </span>
      </motion.button>

      {holding && !sealed && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="h-px w-24 origin-left"
          style={{ background: 'linear-gradient(to right, rgba(247,85,144,0.5), transparent)' }}
        />
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
function PromisePageContent() {
  const isSequenceMode = useSequenceMode();
  const isIframe = useIsIframe();
  const { track } = useEventTracking();
  const [current, setCurrent] = useState(0);
  const [allRead, setAllRead] = useState(false);
  const [sealComplete, setSealComplete] = useState(false);

  // Fix #13: only fire analytics in direct-navigation mode, not during automated sequence
  useEffect(() => {
    if (!isSequenceMode) track('promise_viewed');
  }, [isSequenceMode, track]);

  const visiblePromises = isSequenceMode ? SEQUENCE_PROMISES : PROMISES;
  const isLast = current === visiblePromises.length - 1;
  const promise = visiblePromises[current] ?? visiblePromises[visiblePromises.length - 1];
  const style = WEIGHT_STYLES[promise.weight];

  useEffect(() => {
    if (!isSequenceMode) return;

    setCurrent(0);
    setAllRead(false);
    setSealComplete(false);

    const timeoutIds: number[] = [];

    visiblePromises.forEach((_, index) => {
      if (index === 0) return;

      timeoutIds.push(
        window.setTimeout(() => {
          setCurrent(index);
        }, 900 + index * 2800),
      );
    });

    timeoutIds.push(
      window.setTimeout(() => {
        setAllRead(true);
      }, 900 + visiblePromises.length * 2800 + 200),
    );

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [isSequenceMode, visiblePromises]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setAllRead(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }, [isLast]);

  const handleSealed = useCallback(() => {
    setSealComplete(true);
    if (isSequenceMode) {
      try {
        window.parent.postMessage({ type: 'yor:slide-complete' }, window.location.origin);
      } catch { /* cross-origin guard */ }
    }
  }, [isSequenceMode]);

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
      {/* Ambient candle-flicker glow */}
      <motion.div
        className="pointer-events-none fixed inset-0"
        animate={{ opacity: [0.6, 1, 0.8, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(247,85,144,0.1), transparent 70%)',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_SOFT }}
        className="mb-10 text-center"
      >
        <p
          className="mb-1 uppercase tracking-[0.22em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 171, 210, 0.65)',
            fontSize: '0.58rem',
          }}
        >
          {isSequenceMode ? 'my word to you • autoplay' : 'my word to you'}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 236, 246, 0.96)',
            fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          My Promises
        </h1>
      </motion.div>

      {/* Main area */}
      <AnimatePresence mode="wait">
        {!allRead ? (
          /* Promise card */
          <motion.div
            key={promise.id}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.65, ease: EASE_SOFT }}
            className="relative w-full max-w-md overflow-hidden rounded-[1.8rem] border px-7 py-9"
            style={{
              background: 'linear-gradient(160deg, rgba(40, 13, 30, 0.96) 0%, rgba(15, 6, 14, 0.99) 100%)',
              borderColor: style.border,
              boxShadow: `0 28px 56px rgba(0,0,0,0.55), 0 10px 26px ${style.glow}`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background: `radial-gradient(ellipse at 20% 10%, ${style.glow}, transparent 55%)`,
              }}
            />

            <div className="relative">
              <p
                className="mb-4 uppercase tracking-[0.18em]"
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  color: style.numberColor,
                  fontSize: '0.6rem',
                }}
              >
                Promise {String(isSequenceMode ? current + 1 : promise.number).padStart(2, '0')} of {String(visiblePromises.length).padStart(2, '0')}
              </p>

              <h2
                className="mb-5"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  color: style.titleColor,
                  fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                  lineHeight: 1.15,
                  fontWeight: promise.weight === 'heavy' ? 500 : 400,
                }}
              >
                {promise.title}
              </h2>

              <p
                style={{
                  color: style.bodyColor,
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
                  lineHeight: 1.7,
                }}
              >
                {promise.body}
              </p>

              <div className="mt-8 flex items-center justify-between">
                {/* Progress dots */}
                <div className="flex gap-1.5" aria-hidden="true">
                  {visiblePromises.map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full transition-all duration-500"
                      style={{
                        width: i === current ? 16 : 5,
                        height: 5,
                        background:
                          i < current
                            ? 'rgba(247,85,144,0.7)'
                            : i === current
                            ? 'rgba(247,85,144,0.95)'
                            : 'rgba(244,173,210,0.18)',
                      }}
                    />
                  ))}
                </div>

                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full px-7 py-2.5"
                  style={{
                    background: isLast
                      ? 'linear-gradient(90deg, rgba(255,133,179,0.95), rgba(247,85,144,0.95))'
                      : 'rgba(255,255,255,0.04)',
                    border: isLast ? 'none' : '1px solid rgba(244,173,210,0.25)',
                    color: '#fff',
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.08em',
                    boxShadow: isLast ? '0 8px 22px rgba(247,85,144,0.28)' : 'none',
                    cursor: 'pointer',
                  }}
                  aria-label={isLast ? 'Read all promises' : 'Next promise'}
                >
                  {isLast ? 'I read them all →' : 'Next →'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : sealComplete ? (
          /* Post-seal message */
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE_SOFT }}
            className="relative w-full max-w-md overflow-hidden rounded-[1.8rem] border px-7 py-10 text-center"
            style={{
              background: 'linear-gradient(160deg, rgba(45, 14, 32, 0.97) 0%, rgba(18, 7, 16, 0.99) 100%)',
              borderColor: 'rgba(247, 130, 170, 0.45)',
              boxShadow: '0 28px 56px rgba(0,0,0,0.55), 0 12px 28px rgba(247,85,144,0.22)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle at 50% 30%, rgba(247,85,144,0.12), transparent 60%)',
              }}
            />
            <div className="relative">
              <p style={{ fontSize: '2.4rem', lineHeight: 1, marginBottom: '1.4rem' }} aria-hidden="true">
                🕊️
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  color: 'rgba(255, 245, 252, 0.98)',
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  lineHeight: 1.2,
                  fontStyle: 'italic',
                }}
              >
                Sealed.
              </h2>
              <p
                className="mx-auto mt-4 max-w-[30ch]"
                style={{
                  color: 'rgba(255, 210, 235, 0.78)',
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1rem',
                  lineHeight: 1.65,
                }}
              >
                These are not just words. They are the things I will prove to you — one day at a time.
              </p>
              <p
                className="mt-6"
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(247, 110, 160, 0.7)',
                }}
              >
                — Ayrin
              </p>
            </div>
          </motion.div>
        ) : (
          /* Seal screen */
          <motion.div
            key="seal"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SOFT }}
            className="relative w-full max-w-sm overflow-hidden rounded-[1.8rem] border px-7 py-10 text-center"
            style={{
              background: 'linear-gradient(160deg, rgba(42, 13, 30, 0.96) 0%, rgba(16, 6, 14, 0.99) 100%)',
              borderColor: 'rgba(244, 173, 210, 0.35)',
              boxShadow: '0 24px 52px rgba(0,0,0,0.5), 0 10px 26px rgba(247,85,144,0.18)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle at 50% 20%, rgba(247,85,144,0.1), transparent 60%)',
              }}
            />
            <div className="relative flex flex-col items-center gap-6">
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  color: 'rgba(255, 236, 246, 0.95)',
                  fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)',
                  lineHeight: 1.3,
                  fontStyle: 'italic',
                }}
              >
                You read every one.
              </p>
              <p
                style={{
                  color: 'rgba(255, 200, 228, 0.72)',
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                Now seal this moment. Hold the button below and let me make it real.
              </p>
              <SealButton onSealed={handleSealed} autoplay={isSequenceMode} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-6 left-0 right-0 flex justify-center"
      >
        <Link
          href="/hub"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'rgba(255, 171, 210, 0.35)',
            textTransform: 'uppercase',
          }}
        >
          ← back
        </Link>
      </motion.div>
    </main>
  );
}

export default function PromisePage() {
  return (
    <SequenceErrorBoundary>
      <Suspense fallback={null}>
        <PromisePageContent />
      </Suspense>
    </SequenceErrorBoundary>
  );
}
