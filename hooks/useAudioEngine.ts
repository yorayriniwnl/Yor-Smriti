'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import type { Emotion } from '@/lib/emotionThemes';


interface BackgroundMusicOptions {
  enabled?: boolean;
  volume?: number;
  fadeMs?: number;
}

export type EmotionTrackMap = Partial<Record<Emotion, string>>;

interface SoundNodes {
  context: AudioContext;
  masterGain: GainNode;
  oscillators: OscillatorNode[];
  gains: GainNode[];
  reverb: ConvolverNode | null;
  filter: BiquadFilterNode;
}

const MASTER_TARGET_GAIN = 0.4;

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

export function useAmbientSound(soundEnabled = false) {
  const nodesRef = useRef<SoundNodes | null>(null);
  const isStartedRef = useRef(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createReverb = useCallback((ctx: AudioContext): ConvolverNode => {
    const convolver = ctx.createConvolver();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 3.5;
    const impulse = ctx.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] =
          (Math.random() * 2 - 1) *
          Math.pow(1 - i / length, 2.5);
      }
    }

    convolver.buffer = impulse;
    return convolver;
  }, []);

  const buildGraph = useCallback((): SoundNodes => {
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.Q.setValueAtTime(0.5, ctx.currentTime);

    let reverb: ConvolverNode | null = null;
    try {
      reverb = createReverb(ctx);
    } catch {
      // Reverb unavailable, skip.
    }

    const oscConfigs: Array<{ freq: number; type: OscillatorType; gain: number; detune?: number }> = [
      { freq: 110.0, type: 'sine', gain: 0.24 },
      { freq: 164.81, type: 'sine', gain: 0.18 },
      { freq: 220.0, type: 'triangle', gain: 0.14 },
      { freq: 261.63, type: 'sine', gain: 0.11 },
      { freq: 329.63, type: 'triangle', gain: 0.09 },
      { freq: 110.0, type: 'sine', gain: 0.07, detune: 8 },
      { freq: 55.0, type: 'sine', gain: 0.2 },
    ];

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    oscConfigs.forEach(({ freq, type, gain, detune }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (detune) {
        osc.detune.setValueAtTime(detune, ctx.currentTime);
      }

      gainNode.gain.setValueAtTime(gain, ctx.currentTime);

      osc.connect(gainNode);

      if (reverb) {
        const reverbGain = ctx.createGain();
        reverbGain.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.connect(reverbGain);
        reverbGain.connect(reverb);
        reverb.connect(filter);
      }

      gainNode.connect(filter);

      osc.start();
      oscillators.push(osc);
      gains.push(gainNode);
    });

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    return { context: ctx, masterGain, oscillators, gains, reverb, filter };
  }, [createReverb]);

  const fadeIn = useCallback((nodes: SoundNodes) => {
    const { context, masterGain } = nodes;
    const now = context.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(MASTER_TARGET_GAIN, now + 3.5);
  }, []);

  const fadeOut = useCallback((nodes: SoundNodes, onComplete?: () => void) => {
    const { context, masterGain } = nodes;
    const now = context.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 2.5);

    if (onComplete) {
      fadeTimerRef.current = setTimeout(onComplete, 2600);
    }
  }, []);

  const stop = useCallback(() => {
    if (!nodesRef.current) {
      return;
    }

    const nodes = nodesRef.current;
    fadeOut(nodes, () => {
      nodes.oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch {
          // Already stopped.
        }
      });

      void nodes.context.close().catch(() => {});
      nodesRef.current = null;
      isStartedRef.current = false;
    });
  }, [fadeOut]);

  const start = useCallback(async () => {
    if (isStartedRef.current) {
      return;
    }

    try {
      const nodes = buildGraph();
      nodesRef.current = nodes;
      isStartedRef.current = true;

      if (nodes.context.state === 'suspended') {
        await nodes.context.resume();
      }

      fadeIn(nodes);
    } catch {
      // Audio unavailable silently.
    }
  }, [buildGraph, fadeIn]);

  useEffect(() => {
    if (soundEnabled) {
      void start();
    } else {
      stop();
    }

    return () => {
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    };
  }, [soundEnabled, start, stop]);

  useEffect(() => {
    return () => {
      if (nodesRef.current) {
        nodesRef.current.oscillators.forEach((osc) => {
          try {
            osc.stop();
          } catch {
            // No-op.
          }
        });

        void nodesRef.current.context.close().catch(() => {});
      }
    };
  }, []);
}