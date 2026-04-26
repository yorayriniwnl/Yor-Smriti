'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { accountabilityLineVariants } from '@/lib/animations';

// ─── useReducedMotion ─────────────────────────────────────────────────────────
// Respects the user's OS-level "Reduce Motion" accessibility preference.
// Returns true when motion should be minimised.

function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// ─── SlowRevealText ───────────────────────────────────────────────────────────
// Reveals an array of text lines one by one, with pauses between each

interface SlowRevealLine {
  id: string;
  text: string;
  pauseAfter: number;
  emphasis?: boolean;
  italic?: boolean;
}

interface SlowRevealTextProps {
  lines: SlowRevealLine[];
  initialDelay?: number;
  onAllRevealed?: () => void;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export function SlowRevealText({
  lines,
  initialDelay = 800,
  onAllRevealed,
  fontSize = 'clamp(1.3rem, 2.8vw, 2rem)',
  textAlign = 'center',
}: SlowRevealTextProps) {
  const reducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onAllRevealedRef = useRef(onAllRevealed);

  useEffect(() => {
    onAllRevealedRef.current = onAllRevealed;
  }, [onAllRevealed]);

  useEffect(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    // When the user has requested reduced motion, reveal all lines instantly
    // with no sequential delay — honouring their accessibility preference.
    if (reducedMotion) {
      setVisibleCount(lines.length);
      onAllRevealedRef.current?.();
      return;
    }

    setVisibleCount(0);

    let cumulativeDelay = initialDelay;

    lines.forEach((line, index) => {
      const t = setTimeout(() => {
        setVisibleCount(index + 1);
        if (index === lines.length - 1) {
          onAllRevealedRef.current?.();
        }
      }, cumulativeDelay);

      timersRef.current.push(t);
      // Next line appears after current line's pause
      cumulativeDelay += line.pauseAfter;
    });

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, [lines, initialDelay, reducedMotion]);

  return (
    <div
      className="flex flex-col gap-6"
      style={{ textAlign }}
    >
      {lines.map((line, index) => {
        const isVisible = index < visibleCount;

        const lineStyle: React.CSSProperties = {
          fontFamily: 'var(--font-cormorant)',
          fontStyle: line.italic ? 'italic' : 'normal',
          fontWeight: line.emphasis ? 400 : 300,
          fontSize: line.emphasis
            ? `calc(${fontSize} * 1.15)`
            : fontSize,
          color: line.emphasis
            ? 'var(--text-primary)'
            : 'var(--text-secondary)',
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
        };

        if (reducedMotion) {
          // Static render: no motion, just opacity toggle
          return (
            <p
              key={line.id}
              style={{
                ...lineStyle,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.15s ease',
              }}
            >
              {line.text}
            </p>
          );
        }

        return (
          <AnimatePresence key={line.id}>
            {isVisible && (
              <motion.p
                variants={accountabilityLineVariants}
                initial="hidden"
                animate="visible"
                style={lineStyle}
              >
                {line.text}
              </motion.p>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
}

// ─── PulseText ────────────────────────────────────────────────────────────────
// Single line that pulses in softly, used for transitions

interface PulseTextProps {
  text: string;
  delay?: number;
  size?: string;
  color?: string;
  italic?: boolean;
}

export function PulseText({
  text,
  delay = 0,
  size = 'clamp(1.8rem, 4vw, 3rem)',
  color = 'var(--text-primary)',
  italic = false,
}: PulseTextProps) {
  const reducedMotion = useReducedMotion();

  const baseStyle: React.CSSProperties = {
    fontFamily: 'var(--font-cormorant)',
    fontStyle: italic ? 'italic' : 'normal',
    fontWeight: 300,
    fontSize: size,
    color,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    textAlign: 'center',
  };

  if (reducedMotion) {
    return <p style={baseStyle}>{text}</p>;
  }

  return (
    <motion.p
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 2.0,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      style={baseStyle}
    >
      {text}
    </motion.p>
  );
}

// ─── AccentDivider ────────────────────────────────────────────────────────────

interface AccentDividerProps {
  delay?: number;
  width?: string;
}

export function AccentDivider({ delay = 0, width = '3rem' }: AccentDividerProps) {
  const reducedMotion = useReducedMotion();

  const baseStyle: React.CSSProperties = {
    height: '1px',
    width,
    background: 'linear-gradient(to right, transparent, var(--accent-dim), transparent)',
    margin: '0 auto',
  };

  if (reducedMotion) {
    return <div style={baseStyle} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{
        opacity: 1,
        scaleX: 1,
        transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] },
      }}
      style={baseStyle}
    />
  );
}
