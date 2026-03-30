'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { emotionAutoPauseMs, type Emotion } from '@/lib/emotionThemes';

export interface ExperienceScreenProps {
  onNext: () => void;
  onPrev: () => void;
  index: number;
  emotion: Emotion;
  emotionPath: Emotion[];
  pushEmotionSignal: (emotion: Emotion) => void;
}

export type Screen = {
  id: number;
  component: ComponentType<ExperienceScreenProps>;
  emotion: Emotion;
  duration?: number;
};

interface UseExperienceFlowOptions {
  autoAdvance?: boolean;
  pauseByEmotion?: boolean;
  pauseMsByEmotion?: Partial<Record<Emotion, number>>;
  persistKey?: string;
  initialIndex?: number;
}

export function useExperienceFlow(
  screens: Screen[],
  options: UseExperienceFlowOptions = {},
) {
  const initialIndex = options.initialIndex ?? 0;
  const [index, setIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [emotionPath, setEmotionPath] = useState<Emotion[]>([]);

  const autoAdvance = options.autoAdvance ?? true;
  const pauseByEmotion = options.pauseByEmotion ?? true;
  const pauseMsByEmotion = options.pauseMsByEmotion;
  const persistKey = options.persistKey;

  const safeLastIndex = Math.max(screens.length - 1, 0);
  const current = useMemo(() => screens[index] ?? null, [screens, index]);
  const isFirst = index <= 0;
  const isLast = index >= safeLastIndex;

  useEffect(() => {
    setIndex((currentIndex) => Math.min(Math.max(currentIndex, 0), safeLastIndex));
  }, [safeLastIndex]);

  useEffect(() => {
    if (typeof options.initialIndex !== 'number') {
      return;
    }

    const normalized = Math.min(Math.max(options.initialIndex, 0), safeLastIndex);
    setIndex(normalized);
  }, [options.initialIndex, safeLastIndex]);

  useEffect(() => {
    if (!persistKey || typeof window === 'undefined') {
      return;
    }

    const hasExplicitInitialIndex = typeof options.initialIndex === 'number';
    if (hasExplicitInitialIndex) {
      return;
    }

    const savedIndex = window.localStorage.getItem(persistKey);
    if (!savedIndex) {
      return;
    }

    const parsed = Number(savedIndex);
    if (!Number.isFinite(parsed)) {
      return;
    }

    const normalized = Math.min(Math.max(parsed, 0), safeLastIndex);
    setIndex(normalized);
  }, [options.initialIndex, persistKey, safeLastIndex]);

  useEffect(() => {
    if (!persistKey || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(persistKey, String(index));
  }, [index, persistKey]);

  useEffect(() => {
    if (!current) {
      return;
    }

    setEmotionPath((path) => {
      if (path[path.length - 1] === current.emotion) {
        return path;
      }
      return [...path, current.emotion];
    });
  }, [current]);

  const pushEmotionSignal = useCallback((emotion: Emotion) => {
    setEmotionPath((path) => [...path, emotion]);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, safeLastIndex));
  }, [safeLastIndex]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      const normalized = Math.max(0, Math.min(nextIndex, safeLastIndex));
      setIndex(normalized);
    },
    [safeLastIndex],
  );

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetProgress = useCallback(() => {
    setIndex(0);
    setIsPaused(false);
    setEmotionPath([]);

    if (persistKey && typeof window !== 'undefined') {
      window.localStorage.removeItem(persistKey);
    }
  }, [persistKey]);

  useEffect(() => {
    if (!autoAdvance || isPaused || isLast || !current?.duration) {
      return;
    }

    const emotionPauseMs = pauseByEmotion
      ? (pauseMsByEmotion?.[current.emotion] ?? emotionAutoPauseMs[current.emotion] ?? 0)
      : 0;

    const timer = setTimeout(() => {
      next();
    }, current.duration + emotionPauseMs);

    return () => clearTimeout(timer);
  }, [
    autoAdvance,
    current,
    isLast,
    isPaused,
    next,
    pauseByEmotion,
    pauseMsByEmotion,
  ]);

  return {
    current,
    index,
    total: screens.length,
    next,
    prev,
    goTo,
    isFirst,
    isLast,
    pause,
    resume,
    isPaused,
    emotionPath,
    pushEmotionSignal,
    resetProgress,
  };
}
