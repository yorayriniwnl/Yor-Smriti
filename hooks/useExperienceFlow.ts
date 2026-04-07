'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { emotionAutoPauseMs, type Emotion } from '@/lib/emotionThemes';
import type { TimingConfig } from '@/lib/timeDistortion';

export type ScreenPacingKind =
  | 'normal'
  | 'silence'
  | 'flash'
  | 'frozen'
  | 'memory-fragment'
  | 'freeze'
  | 'mute'
  | 'peak'
  | 'afterglow';

export type ExperienceMood = 'default' | 'dark' | 'hopeful' | 'minimal';

export type ExperienceFlowMode = 'linear' | 'non-linear';

export interface ExperienceRestartOptions {
  mood?: ExperienceMood;
  flowMode?: ExperienceFlowMode;
  silentMode?: boolean;
  privateMode?: boolean;
}

export interface PersonalizationData {
  name: string;
  memory: string;
  message: string;
}

export const DEFAULT_PERSONALIZATION: PersonalizationData = {
  name: 'Smriti',
  memory: 'that rainy chai walk',
  message: 'I am still here, trying to become better.',
};

export interface ExperienceScreenProps {
  onNext: () => void;
  onPrev: () => void;
  onRestart: (options?: ExperienceRestartOptions) => void;
  index: number;
  emotion: Emotion;
  emotionPath: Emotion[];
  pushEmotionSignal: (emotion: Emotion) => void;
  personalization: PersonalizationData;
  mood: ExperienceMood;
  setMood: (mood: ExperienceMood) => void;
  flowMode: ExperienceFlowMode;
  setFlowMode: (mode: ExperienceFlowMode) => void;
  isSilentMode: boolean;
  toggleSilentMode: () => void;
  isAttentionLocked: boolean;
  replayCount?: number;
}

export type Screen = {
  id: number;
  component: ComponentType<ExperienceScreenProps>;
  emotion: Emotion;
  duration?: number;
  kind?: ScreenPacingKind;
  timing?: Partial<TimingConfig>;
  attentionLockMs?: number;
};

interface UseExperienceFlowOptions {
  autoAdvance?: boolean;
  pauseByEmotion?: boolean;
  pauseMsByEmotion?: Partial<Record<Emotion, number>>;
  persistKey?: string;
  initialIndex?: number;
}

export interface UseExperienceFlowReturn {
  current: Screen | null;
  index: number;
  total: number;
  next: () => void;
  prev: () => void;
  goTo: (nextIndex: number) => void;
  isFirst: boolean;
  isLast: boolean;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
  emotionPath: Emotion[];
  pushEmotionSignal: (emotion: Emotion) => void;
  resetProgress: () => void;
}

export function useExperienceFlow(
  screens: Screen[],
  options: UseExperienceFlowOptions = {},
): UseExperienceFlowReturn {
  const initialIndex = options.initialIndex ?? 0;
  const [index, setIndex] = useState<number>(initialIndex);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [emotionPath, setEmotionPath] = useState<Emotion[]>([]);

  const autoAdvance = options.autoAdvance ?? true;
  const pauseByEmotion = options.pauseByEmotion ?? true;
  const pauseMsByEmotion = options.pauseMsByEmotion;
  const persistKey = options.persistKey;

  const safeLastIndex = Math.max(screens.length - 1, 0);
  const current = useMemo<Screen | null>(() => screens[index] ?? null, [screens, index]);
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
    if (!autoAdvance || isPaused || isLast || !current) {
      return;
    }

    const baseDuration = current.duration ?? (current.kind === 'silence' ? 500 : 0);
    if (baseDuration <= 0) {
      return;
    }

    const emotionPauseMs = pauseByEmotion
      ? (pauseMsByEmotion?.[current.emotion] ?? emotionAutoPauseMs[current.emotion] ?? 0)
      : 0;

    const silenceLeadDelayMs = current.kind === 'silence' ? 500 : 0;

    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      next();
    }, baseDuration + emotionPauseMs + silenceLeadDelayMs);

    return () => {
      clearTimeout(timer);
    };
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
