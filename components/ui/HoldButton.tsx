'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HoldButtonState } from '@/types';
import { holdRevealVariants } from '@/lib/animations';

// ─── HoldButton ───────────────────────────────────────────────────────────────

interface HoldButtonProps {
  label: string;
  holdDuration: number;
  revealText: string;
  onComplete?: () => void;
}

export function HoldButton({
  label,
  holdDuration,
  revealText,
  onComplete,
}: HoldButtonProps) {
  const [state, setState] = useState<HoldButtonState>('idle');
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isPressedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stopAnimation = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startHolding = useCallback(() => {
    if (state === 'revealed' || state === 'complete') return;

    isPressedRef.current = true;
    startTimeRef.current = performance.now();
    setState('holding');

    const animate = (now: number) => {
      if (!isPressedRef.current) return;

      const elapsed = now - (startTimeRef.current ?? now);
      const pct = Math.min(elapsed / holdDuration, 1);
      setProgress(pct);

      if (pct >= 1) {
        setState('revealed');
        setProgress(1);
        stopAnimation();
        setTimeout(() => {
          setState('complete');
          onCompleteRef.current?.();
        }, 800);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [state, holdDuration, stopAnimation]);

  const stopHolding = useCallback(() => {
    if (state === 'revealed' || state === 'complete') return;

    isPressedRef.current = false;
    stopAnimation();
    setState('idle');
    setProgress(0);
  }, [state, stopAnimation]);

  useEffect(() => {
    return () => stopAnimation();
  }, [stopAnimation]);

  const isRevealed = state === 'revealed' || state === 'complete';

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Hold Button */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            key="hold-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1.2, delay: 0.4 } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.6 } }}
            className="relative select-none overflow-hidden rounded-sm"
            style={{
              border: '1px solid rgba(201, 169, 110, 0.2)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={(e) => {
              e.preventDefault();
              startHolding();
            }}
            onTouchEnd={stopHolding}
            onTouchCancel={stopHolding}
          >
            {/* Progress fill */}
            <motion.div
              className="absolute inset-0 origin-left"
              style={{
                background: 'linear-gradient(90deg, rgba(201,169,110,0.08), rgba(201,169,110,0.18))',
                scaleX: progress,
                transformOrigin: 'left',
              }}
            />

            {/* Label */}
            <div
              className="relative px-7 py-4"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: state === 'holding'
                  ? 'var(--accent)'
                  : 'var(--text-secondary)',
                textTransform: 'uppercase',
                transition: 'color 0.4s ease',
              }}
            >
              {state === 'holding' ? '···' : label}
            </div>

            {/* Border glow on hold */}
            {state === 'holding' && (
              <motion.div
                className="absolute inset-0 rounded-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  boxShadow: '0 0 20px rgba(201,169,110,0.15)',
                  border: '1px solid rgba(201,169,110,0.35)',
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal text */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            key="reveal-text"
            variants={holdRevealVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Decorative line above */}
            <div
              className="mx-auto mb-8 h-px w-16"
              style={{
                background: 'linear-gradient(to right, transparent, var(--accent-dim), transparent)',
              }}
            />

            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
              }}
            >
              {revealText}
            </p>

            {/* Decorative line below */}
            <div
              className="mx-auto mt-8 h-px w-16"
              style={{
                background: 'linear-gradient(to right, transparent, var(--accent-dim), transparent)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hold hint */}
      <AnimatePresence>
        {state === 'idle' && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35, transition: { delay: 1.5, duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            press and hold
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
