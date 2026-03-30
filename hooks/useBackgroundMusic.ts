'use client';

import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import type { Emotion } from '@/lib/emotionThemes';

interface BackgroundMusicOptions {
  enabled?: boolean;
  volume?: number;
  fadeMs?: number;
}

export type EmotionTrackMap = Partial<Record<Emotion, string>>;

function fadeVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  durationMs: number,
  frameRef: MutableRefObject<number | null>,
  onComplete?: () => void,
) {
  if (frameRef.current !== null) {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }

  if (durationMs <= 0) {
    audio.volume = to;
    onComplete?.();
    return;
  }

  const start = performance.now();
  const safeFrom = Math.max(0, Math.min(1, from));
  const safeTo = Math.max(0, Math.min(1, to));

  const step = (now: number) => {
    const elapsed = now - start;
    const progress = Math.max(0, Math.min(1, elapsed / durationMs));
    audio.volume = safeFrom + (safeTo - safeFrom) * progress;

    if (progress < 1) {
      frameRef.current = requestAnimationFrame(step);
      return;
    }

    frameRef.current = null;
    onComplete?.();
  };

  frameRef.current = requestAnimationFrame(step);
}

export function useBackgroundMusic(src: string, options: BackgroundMusicOptions = {}) {
  const frameRef = useRef<number | null>(null);

  const enabled = options.enabled ?? true;
  const targetVolume = Math.max(0, Math.min(1, options.volume ?? 0.3));
  const fadeMs = Math.max(options.fadeMs ?? 900, 0);

  useEffect(() => {
    if (!enabled || !src) {
      return;
    }

    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;

    let disposed = false;

    const playWithFade = async () => {
      try {
        await audio.play();
        if (!disposed) {
          fadeVolume(audio, 0, targetVolume, fadeMs, frameRef);
        }
      } catch {
        // Autoplay can be blocked until user gesture.
      }
    };

    const handleFirstGesture = () => {
      if (disposed || !audio.paused) {
        return;
      }

      void playWithFade();
    };

    void playWithFade();

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      disposed = true;

      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);

      fadeVolume(audio, audio.volume, 0, fadeMs, frameRef, () => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [enabled, fadeMs, src, targetVolume]);
}

export function useEmotionBackgroundMusic(
  emotion: Emotion,
  tracks: EmotionTrackMap,
  options?: BackgroundMusicOptions,
) {
  const src = tracks[emotion] ?? '';

  useBackgroundMusic(src, {
    ...options,
    enabled: options?.enabled ?? Boolean(src),
  });
}
