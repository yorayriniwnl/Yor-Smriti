'use client';

import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';
import { useSequenceMode } from '@/hooks/useSequenceMode';
import { useEventTracking } from '@/hooks/useEventTracking';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface Star {
  id: string;
  x: number;   // percentage 0–100
  y: number;   // percentage 0–100
  size: number; // 3–10
  brightness: number; // 0.4–1
  pulseDelay: number;
  memory: string;
  date?: string;
  isSpecial?: boolean;
}

// ─── Map each star to a real memory ──────────────────────────────────────────
const STARS: Star[] = [
  { id: 's1',  x: 20, y: 18, size: 7,  brightness: 0.95, pulseDelay: 0,   isSpecial: true,  memory: 'The first time I knew I liked you.', date: 'The beginning' },
  { id: 's2',  x: 48, y: 12, size: 5,  brightness: 0.7,  pulseDelay: 0.8, memory: 'The sound of your laugh from across the room.' },
  { id: 's3',  x: 72, y: 22, size: 8,  brightness: 1.0,  pulseDelay: 1.2, isSpecial: true,  memory: 'Our first real conversation that went on too long.', date: 'Early days' },
  { id: 's4',  x: 14, y: 42, size: 4,  brightness: 0.55, pulseDelay: 2.1, memory: 'You mentioning something small that I never forgot.' },
  { id: 's5',  x: 33, y: 38, size: 6,  brightness: 0.8,  pulseDelay: 0.4, memory: 'A moment of silence that did not need to be filled.' },
  { id: 's6',  x: 60, y: 35, size: 5,  brightness: 0.65, pulseDelay: 1.7, memory: 'When you were kind to someone who was not even watching.' },
  { id: 's7',  x: 82, y: 44, size: 4,  brightness: 0.5,  pulseDelay: 0.9, memory: 'The way your voice changed when you talked about something you loved.' },
  { id: 's8',  x: 10, y: 62, size: 5,  brightness: 0.72, pulseDelay: 1.4, memory: 'When you made me feel like I was the only person in the room.' },
  { id: 's9',  x: 42, y: 58, size: 9,  brightness: 1.0,  pulseDelay: 0.2, isSpecial: true,  memory: 'The moment I stopped pretending I was not falling for you.', date: 'The turning point' },
  { id: 's10', x: 66, y: 62, size: 5,  brightness: 0.68, pulseDelay: 2.4, memory: 'How easy it was to be quiet with you.' },
  { id: 's11', x: 88, y: 58, size: 4,  brightness: 0.5,  pulseDelay: 1.1, memory: 'Something you said that I still think about.' },
  { id: 's12', x: 25, y: 76, size: 6,  brightness: 0.78, pulseDelay: 0.6, memory: 'When you noticed I was not okay before I said anything.' },
  { id: 's13', x: 52, y: 80, size: 4,  brightness: 0.55, pulseDelay: 1.9, memory: 'A small moment that meant more than either of us admitted.' },
  { id: 's14', x: 74, y: 78, size: 5,  brightness: 0.7,  pulseDelay: 0.3, memory: 'Laughing at something that made no sense to anyone else.' },
  { id: 's15', x: 38, y: 88, size: 8,  brightness: 0.9,  pulseDelay: 1.5, isSpecial: true,  memory: 'You. Right now. Still here.', date: 'Now' },
];

// Constellation lines (pairs of star IDs to connect)
const CONSTELLATION_LINES: [string, string][] = [
  ['s1', 's2'],
  ['s2', 's3'],
  ['s1', 's5'],
  ['s5', 's9'],
  ['s3', 's6'],
  ['s6', 's9'],
  ['s9', 's12'],
  ['s12', 's15'],
  ['s9', 's13'],
  ['s13', 's15'],
];

const SEQUENCE_STAR_IDS = ['s1', 's3', 's9', 's12', 's15'] as const;
const SEQUENCE_STARS: Star[] = SEQUENCE_STAR_IDS.map((id) => {
  const star = STARS.find((entry) => entry.id === id);

  if (!star) {
    throw new Error(`Missing star configuration for sequence preview: ${id}`);
  }

  return star;
});

function useWindowSize() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}

function getStarCoords(star: Star, w: number, h: number) {
  return {
    cx: (star.x / 100) * w,
    cy: (star.y / 100) * h,
  };
}

function StarsPageContent() {
  const isSequenceMode = useSequenceMode();
  const [active, setActive] = useState<Star | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const { w, h } = useWindowSize();
  const svgRef = useRef<SVGSVGElement>(null);
  const discoveryTotal = isSequenceMode ? SEQUENCE_STARS.length : STARS.length;

  useEffect(() => {
    if (!isSequenceMode) return;

    setActive(null);
    setRevealed(new Set());

    const timeoutIds: number[] = [];

    SEQUENCE_STARS.forEach((star, index) => {
      timeoutIds.push(
        window.setTimeout(() => {
          setActive(star);
          setRevealed((prev) => {
            const next = new Set(prev);
            next.add(star.id);
            return next;
          });
        }, 950 + index * 1250),
      );
    });

    timeoutIds.push(
      window.setTimeout(() => {
        setActive(null);
      }, 950 + SEQUENCE_STARS.length * 1250 + 650),
    );

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [isSequenceMode]);

  const handleStarClick = useCallback((star: Star) => {
    if (isSequenceMode) return;
    setActive(star);
    setRevealed((prev) => new Set([...prev, star.id]));
  }, [isSequenceMode]);

  const handleClose = useCallback(() => setActive(null), []);

  return (
    <main
      id="main-content"
      className="relative flex h-dvh w-dvw flex-col overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(30, 8, 50, 0.8) 0%, rgba(10, 3, 20, 0.98) 40%, #03020a 100%)',
      }}
    >
      <CharacterPageOverlayClient />
      {/* Deep space background stars (decorative non-interactive) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={`bg-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${(i * 17.3 + 5) % 100}%`,
              top: `${(i * 23.7 + 8) % 100}%`,
              width: `${1 + (i % 2)}px`,
              height: `${1 + (i % 2)}px`,
              background: 'white',
              opacity: 0.08 + (i % 5) * 0.04,
              animation: `pulse ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_SOFT }}
        className="relative z-20 px-6 pt-10 text-center"
      >
        <p
          className="mb-1 uppercase tracking-[0.22em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(180, 150, 240, 0.65)',
            fontSize: '0.58rem',
          }}
        >
          our universe
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(240, 230, 255, 0.95)',
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          Our Constellation
        </h1>
        <p
          className="mx-auto mt-2 max-w-[36ch]"
          style={{
            color: 'rgba(200, 180, 240, 0.55)',
            fontFamily: 'var(--font-crimson)',
            fontSize: '0.88rem',
            fontStyle: 'italic',
          }}
        >
          {isSequenceMode ? 'Each star wakes up in order now, like a memory finding its own light.' : 'Each star is a memory. Touch one.'}
        </p>
        <p
          className="mt-1"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.56rem',
            color: 'rgba(180, 150, 240, 0.35)',
            letterSpacing: '0.08em',
          }}
        >
          {revealed.size} / {discoveryTotal} discovered
        </p>
      </motion.div>

      {/* SVG canvas */}
      {w > 0 && (
        <svg
          ref={svgRef}
          className="absolute inset-0 z-10"
          width={w}
          height={h}
          aria-label="Constellation memory map"
        >
          {/* Constellation lines */}
          {CONSTELLATION_LINES.map(([aId, bId]) => {
            const a = STARS.find((s) => s.id === aId)!;
            const b = STARS.find((s) => s.id === bId)!;
            const ac = getStarCoords(a, w, h);
            const bc = getStarCoords(b, w, h);
            return (
              <motion.line
                key={`${aId}-${bId}`}
                x1={ac.cx} y1={ac.cy}
                x2={bc.cx} y2={bc.cy}
                stroke="rgba(180, 150, 240, 0.18)"
                strokeWidth="0.7"
                strokeDasharray="4 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.4, delay: 1, ease: 'easeInOut' }}
              />
            );
          })}

          {/* Stars */}
          {STARS.map((star) => {
            const { cx, cy } = getStarCoords(star, w, h);
            const isActive = active?.id === star.id;
            const isRevealed = revealed.has(star.id);

            return (
              <g
                key={star.id}
                role={isSequenceMode ? undefined : 'button'}
                tabIndex={isSequenceMode ? -1 : 0}
                aria-label={isSequenceMode ? undefined : `Memory star: ${isRevealed ? star.memory : 'unknown memory'}`}
                onClick={isSequenceMode ? undefined : () => handleStarClick(star)}
                onKeyDown={isSequenceMode ? undefined : (e) => e.key === 'Enter' && handleStarClick(star)}
                style={{ cursor: isSequenceMode ? 'default' : 'pointer' }}
              >
                {/* Outer glow ring for special stars */}
                {star.isSpecial && (
                  <motion.circle
                    cx={cx} cy={cy}
                    r={star.size * 3}
                    fill="none"
                    stroke={isRevealed ? 'rgba(247, 85, 144, 0.25)' : 'rgba(180, 150, 240, 0.15)'}
                    strokeWidth="1"
                    animate={{ r: [star.size * 2.5, star.size * 3.8, star.size * 2.5] }}
                    transition={{ duration: 3 + star.pulseDelay, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Glow halo */}
                <motion.circle
                  cx={cx} cy={cy}
                  r={star.size * 2.2}
                  fill={
                    isRevealed
                      ? 'rgba(247, 85, 144, 0.12)'
                      : 'rgba(180, 150, 240, 0.07)'
                  }
                  animate={{
                    r: isActive
                      ? [star.size * 2.2, star.size * 3.5, star.size * 2.2]
                      : [star.size * 2, star.size * 2.6, star.size * 2],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + star.pulseDelay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: star.pulseDelay,
                  }}
                />

                {/* Star body */}
                <motion.circle
                  cx={cx} cy={cy}
                  r={isActive ? star.size * 1.4 : star.size}
                  fill={
                    isRevealed
                      ? `rgba(247, 130, 175, ${star.brightness})`
                      : `rgba(200, 185, 250, ${star.brightness})`
                  }
                  animate={{
                    opacity: [star.brightness * 0.7, star.brightness, star.brightness * 0.7],
                    r: isActive ? star.size * 1.4 : star.size,
                  }}
                  transition={{
                    opacity: {
                      duration: 2.5 + star.pulseDelay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: star.pulseDelay,
                    },
                    r: { duration: 0.3, ease: EASE_SOFT },
                  }}
                />

                {/* Cross twinkle for special stars */}
                {star.isSpecial && (
                  <>
                    <motion.line
                      x1={cx - star.size * 2} y1={cy}
                      x2={cx + star.size * 2} y2={cy}
                      stroke={isRevealed ? 'rgba(247, 130, 175, 0.5)' : 'rgba(200, 185, 250, 0.4)'}
                      strokeWidth="0.8"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: star.pulseDelay }}
                    />
                    <motion.line
                      x1={cx} y1={cy - star.size * 2}
                      x2={cx} y2={cy + star.size * 2}
                      stroke={isRevealed ? 'rgba(247, 130, 175, 0.5)' : 'rgba(200, 185, 250, 0.4)'}
                      strokeWidth="0.8"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: star.pulseDelay + 0.3 }}
                    />
                  </>
                )}

                {/* Discovered dot */}
                {isRevealed && !isActive && (
                  <circle
                    cx={cx + star.size + 2}
                    cy={cy - star.size - 2}
                    r={2}
                    fill="rgba(247, 85, 144, 0.85)"
                  />
                )}
              </g>
            );
          })}
        </svg>
      )}

      {/* Memory popup */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.5, ease: EASE_SOFT }}
            className="absolute bottom-24 left-1/2 z-30 w-full max-w-xs -translate-x-1/2 overflow-hidden rounded-[1.6rem] border px-6 py-7"
            style={{
              background: 'linear-gradient(160deg, rgba(40, 12, 34, 0.97) 0%, rgba(15, 5, 18, 0.99) 100%)',
              borderColor: active.isSpecial
                ? 'rgba(247, 130, 175, 0.45)'
                : 'rgba(200, 175, 240, 0.28)',
              boxShadow: '0 24px 52px rgba(0,0,0,0.65), 0 10px 24px rgba(180, 80, 140, 0.2)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle at 20% 20%, rgba(247, 85, 144, 0.1), transparent 60%)',
              }}
            />
            <div className="relative">
              {active.date && (
                <p
                  className="mb-3 uppercase tracking-[0.16em]"
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    color: 'rgba(247, 130, 175, 0.7)',
                    fontSize: '0.58rem',
                  }}
                >
                  {active.date}
                </p>
              )}
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  color: 'rgba(255, 236, 246, 0.97)',
                  fontSize: 'clamp(1.15rem, 3vw, 1.55rem)',
                  lineHeight: 1.4,
                  fontStyle: 'italic',
                }}
              >
                {active.memory}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-5 block w-full text-center"
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(200, 175, 240, 0.45)',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                close ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All discovered message */}
      <AnimatePresence>
        {revealed.size === discoveryTotal && !active && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_SOFT }}
            className="absolute bottom-24 left-1/2 z-30 -translate-x-1/2 text-center"
          >
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: 'rgba(247, 130, 175, 0.9)',
                fontSize: '1.2rem',
                fontStyle: 'italic',
              }}
            >
              You found them all. ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-0 right-0 z-20 flex justify-center"
      >
        <Link
          href="/hub"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'rgba(180, 150, 240, 0.35)',
            textTransform: 'uppercase',
          }}
        >
          ← back
        </Link>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.18; }
        }
      `}</style>
    </main>
  );
}

export default function StarsPage() {
  const { track } = useEventTracking();
  useEffect(() => {
    track('stars_viewed');
  }, [track]);

  return (
    <Suspense fallback={null}>
      <StarsPageContent />
    </Suspense>
  );
}
