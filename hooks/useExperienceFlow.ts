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

  // ── Initialise index in a single synchronous pass ──────────────────────────
  // Using a lazy initializer means sessionStorage is read and clamped BEFORE the
  // first render, so `current` is never null due to an out-of-bounds index.
  // Previous code did this in a subsequent effect, leaving a frame where
  // `index` could exceed `screens.length - 1` and `current` would be null.
  const [index, setIndex] = useState<number>(() => {
    const safeMax = Math.max(screens.length - 1, 0);

    // Explicit initialIndex wins over persisted state
    if (typeof options.initialIndex === 'number') {
      return Math.min(Math.max(options.initialIndex, 0), safeMax);
    }

    // Attempt to restore from sessionStorage (not localStorage — flow progress is
    // private, per-tab state that must not bleed across browser sessions or
    // shared devices).
    if (options.persistKey && typeof window !== 'undefined') {
      const saved = window.sessionStorage.getItem(options.persistKey);
      if (saved) {
        const parsed = Number(saved);
        if (Number.isFinite(parsed)) {
          return Math.min(Math.max(parsed, 0), safeMax);
        }
      }
    }

    return Math.min(Math.max(initialIndex, 0), safeMax);
  });
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

  // Clamp index whenever the screens array shrinks (e.g. after a hot-reload
  // that reduces the screen count).  The lazy initializer handles the very first
  // render; this effect handles subsequent changes to `screens.length`.
  useEffect(() => {
    setIndex((currentIndex) => Math.min(Math.max(currentIndex, 0), safeLastIndex));
  }, [safeLastIndex]);

  useEffect(() => {
    if (!persistKey || typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(persistKey, String(index));
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
      window.sessionStorage.removeItem(persistKey);
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
