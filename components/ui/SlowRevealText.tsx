'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { accountabilityLineVariants } from '@/lib/animations';

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
  const [visibleCount, setVisibleCount] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onAllRevealedRef = useRef(onAllRevealed);

  useEffect(() => {
    onAllRevealedRef.current = onAllRevealed;
  }, [onAllRevealed]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
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
      timersRef.current.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex flex-col gap-6"
      style={{ textAlign }}
    >
      {lines.map((line, index) => (
        <AnimatePresence key={line.id}>
          {index < visibleCount && (
            <motion.p
              variants={accountabilityLineVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily: line.italic
                  ? 'var(--font-cormorant)'
                  : 'var(--font-cormorant)',
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
              }}
            >
              {line.text}
            </motion.p>
          )}
        </AnimatePresence>
      ))}
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
      style={{
        fontFamily: 'var(--font-cormorant)',
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: 300,
        fontSize: size,
        color,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        textAlign: 'center',
      }}
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
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{
        opacity: 1,
        scaleX: 1,
        transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] },
      }}
      style={{
        height: '1px',
        width,
        background: 'linear-gradient(to right, transparent, var(--accent-dim), transparent)',
        margin: '0 auto',
      }}
    />
  );
}
