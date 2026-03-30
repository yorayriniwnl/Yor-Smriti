'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '@/hooks/useStageController';

// ─── Ambient Sound Hook ───────────────────────────────────────────────────────
// Creates a soft ambient pad using Web Audio API oscillators
// No audio files needed — generated synthetically

interface SoundNodes {
  context: AudioContext;
  masterGain: GainNode;
  oscillators: OscillatorNode[];
  gains: GainNode[];
  reverb: ConvolverNode | null;
  filter: BiquadFilterNode;
}

const MASTER_TARGET_GAIN = 0.4;

export function useAmbientSound() {
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const nodesRef = useRef<SoundNodes | null>(null);
  const isStartedRef = useRef(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Create Reverb Impulse ─────────────────────────────────────────────────
  const createReverb = useCallback((ctx: AudioContext): ConvolverNode => {
    const convolver = ctx.createConvolver();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 3.5;  // 3.5s reverb tail
    const impulse = ctx.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Exponential decay with noise
        channelData[i] =
          (Math.random() * 2 - 1) *
          Math.pow(1 - i / length, 2.5);
      }
    }

    convolver.buffer = impulse;
    return convolver;
  }, []);

  // ─── Build Audio Graph ─────────────────────────────────────────────────────
  const buildGraph = useCallback((): SoundNodes => {
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);

    // Low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.Q.setValueAtTime(0.5, ctx.currentTime);

    // Optional reverb
    let reverb: ConvolverNode | null = null;
    try {
      reverb = createReverb(ctx);
    } catch {
      // Reverb unavailable, skip
    }

    // Oscillator frequency clusters for a warm pad chord
    // A minor / C major cluster: A2, E3, A3, C4, E4
    const oscConfigs: Array<{ freq: number; type: OscillatorType; gain: number; detune?: number }> = [
      { freq: 110.00,  type: 'sine',     gain: 0.24 },            // A2
      { freq: 164.81,  type: 'sine',     gain: 0.18 },            // E3
      { freq: 220.00,  type: 'triangle', gain: 0.14 },            // A3
      { freq: 261.63,  type: 'sine',     gain: 0.11 },            // C4
      { freq: 329.63,  type: 'triangle', gain: 0.09 },            // E4
      { freq: 110.00,  type: 'sine',     gain: 0.07, detune: 8 }, // slight detune for warmth
      { freq: 55.00,   type: 'sine',     gain: 0.2 },             // A1 sub
    ];

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    oscConfigs.forEach(({ freq, type, gain, detune }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (detune) osc.detune.setValueAtTime(detune, ctx.currentTime);
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

  // ─── Fade In ──────────────────────────────────────────────────────────────
  const fadeIn = useCallback((nodes: SoundNodes) => {
    const { context, masterGain } = nodes;
    const now = context.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(MASTER_TARGET_GAIN, now + 3.5);
  }, []);

  // ─── Fade Out ─────────────────────────────────────────────────────────────
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

  // ─── Stop & Cleanup ───────────────────────────────────────────────────────
  const stop = useCallback(() => {
    if (!nodesRef.current) return;

    const nodes = nodesRef.current;
    fadeOut(nodes, () => {
      nodes.oscillators.forEach((osc) => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      nodes.context.close().catch(() => {});
      nodesRef.current = null;
      isStartedRef.current = false;
    });
  }, [fadeOut]);

  // ─── Start ────────────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    if (isStartedRef.current) return;

    try {
      const nodes = buildGraph();
      nodesRef.current = nodes;
      isStartedRef.current = true;

      // Resume context if needed (autoplay policy)
      if (nodes.context.state === 'suspended') {
        await nodes.context.resume();
      }

      fadeIn(nodes);
    } catch {
      // Audio unavailable silently
    }
  }, [buildGraph, fadeIn]);

  // ─── Effect: React to soundEnabled ────────────────────────────────────────
  useEffect(() => {
    if (soundEnabled) {
      start();
    } else {
      stop();
    }

    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [soundEnabled, start, stop]);

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (nodesRef.current) {
        nodesRef.current.oscillators.forEach((osc) => {
          try { osc.stop(); } catch { /* noop */ }
        });
        nodesRef.current.context.close().catch(() => {});
      }
    };
  }, []);
}
