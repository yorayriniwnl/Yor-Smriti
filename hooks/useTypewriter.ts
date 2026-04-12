'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { TypewriterConfig, TypewriterState } from '@/types';

// ─── useTypewriter ────────────────────────────────────────────────────────────

export function useTypewriter({
  text,
  speed = 45,
  startDelay = 0,
  onComplete,
}: TypewriterConfig): TypewriterState {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (startTimerRef.current) clearTimeout(startTimerRef.current);
  }, []);

  const typeNextChar = useCallback(() => {
    if (indexRef.current >= text.length) {
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    setDisplayText(text.slice(0, indexRef.current + 1));
    indexRef.current++;

    // Variable speed: slightly slower at punctuation for natural rhythm
    const char = text[indexRef.current - 1];
    let delay = speed;
    if (char === '.' || char === '…' || char === '?') delay = speed * 5;
    else if (char === ',') delay = speed * 2.5;
    else if (char === ' ') delay = speed * 0.6;

    timerRef.current = setTimeout(typeNextChar, delay);
  }, [text, speed]);

  useEffect(() => {
    // Reset on text change
    clearTimers();
    setDisplayText('');
    setIsComplete(false);
    setIsStarted(false);
    indexRef.current = 0;

    startTimerRef.current = setTimeout(() => {
      setIsStarted(true);
      typeNextChar();
    }, startDelay);

    return clearTimers;
  }, [text, startDelay, typeNextChar, clearTimers]);

  return { displayText, isComplete, isStarted };
}

// ─── useSequencedReveal ───────────────────────────────────────────────────────
// Reveals lines one by one with configurable delays

interface SequencedRevealConfig {
  lines: Array<{ text: string; delay: number }>;
  onAllRevealed?: () => void;
  autoStart?: boolean;
}

interface SequencedRevealState {
  revealedCount: number;
  isAllRevealed: boolean;
  start: () => void;
}

export function useSequencedReveal({
  lines,
  onAllRevealed,
  autoStart = false,
}: SequencedRevealConfig): SequencedRevealState {
  const [revealedCount, setRevealedCount] = useState(0);
  const [isAllRevealed, setIsAllRevealed] = useState(false);
  const [started, setStarted] = useState(autoStart);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onAllRevealedRef = useRef(onAllRevealed);

  useEffect(() => {
    onAllRevealedRef.current = onAllRevealed;
  }, [onAllRevealed]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    if (!started) return;

    clearAllTimers();
    setRevealedCount(0);
    setIsAllRevealed(false);

    let cumulativeDelay = 0;

    lines.forEach((line, index) => {
      cumulativeDelay += line.delay;
      const timer = setTimeout(() => {
        setRevealedCount(index + 1);

        if (index === lines.length - 1) {
          setIsAllRevealed(true);
          onAllRevealedRef.current?.();
        }
      }, cumulativeDelay);

      timersRef.current.push(timer);
    });

    return clearAllTimers;
  }, [started, lines, clearAllTimers]);

  const start = useCallback(() => {
    setStarted(true);
  }, []);

  return { revealedCount, isAllRevealed, start };
}

// ─── useDeferredVisibility ────────────────────────────────────────────────────
// Shows element after a delay

export function useDeferredVisibility(delay: number): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return visible;
}
