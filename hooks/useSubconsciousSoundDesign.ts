'use client';

import { useEffect, useRef } from 'react';
import type { Emotion } from '@/lib/emotionThemes';
import type { ScreenPacingKind } from '@/hooks/useExperienceFlow';

interface SubconsciousSoundDesignOptions {
  enabled: boolean;
  screenId: number;
  emotion: Emotion;
  kind?: ScreenPacingKind;
}

interface SoundGraph {
  context: AudioContext;
  masterGain: GainNode;
  humGain: GainNode;
  humOscA: OscillatorNode;
  humOscB: OscillatorNode;
  humLfo: OscillatorNode;
  humLfoGain: GainNode;
  whooshNoise: AudioBuffer;
}

const TEXT_REVEAL_EVENT = 'yor:text-reveal';
const MASTER_TARGET_GAIN = 0.2;

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createNoiseBuffer(context: AudioContext, durationSeconds: number): AudioBuffer {
  const frameCount = Math.max(1, Math.floor(context.sampleRate * durationSeconds));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function resolveEmotionGain(emotion: Emotion): number {
  if (emotion === 'pain') {
    return 1;
  }

  if (emotion === 'regret' || emotion === 'silence') {
    return 0.9;
  }

  if (emotion === 'love' || emotion === 'hope') {
    return 0.78;
  }

  return 0.84;
}

function createSoundGraph(): SoundGraph {
  const context = new AudioContext();
  const masterGain = context.createGain();
  masterGain.gain.setValueAtTime(0, context.currentTime);

  const humFilter = context.createBiquadFilter();
  humFilter.type = 'lowpass';
  humFilter.frequency.setValueAtTime(230, context.currentTime);
  humFilter.Q.setValueAtTime(0.72, context.currentTime);

  const humGain = context.createGain();
  humGain.gain.setValueAtTime(0.0062, context.currentTime);

  const humOscA = context.createOscillator();
  humOscA.type = 'sine';
  humOscA.frequency.setValueAtTime(58, context.currentTime);

  const humOscB = context.createOscillator();
  humOscB.type = 'triangle';
  humOscB.frequency.setValueAtTime(116, context.currentTime);
  humOscB.detune.setValueAtTime(6, context.currentTime);

  const humLfo = context.createOscillator();
  humLfo.type = 'sine';
  humLfo.frequency.setValueAtTime(0.07, context.currentTime);

  const humLfoGain = context.createGain();
  humLfoGain.gain.setValueAtTime(0.0016, context.currentTime);

  humLfo.connect(humLfoGain);
  humLfoGain.connect(humGain.gain);

  humOscA.connect(humFilter);
  humOscB.connect(humFilter);
  humFilter.connect(humGain);
  humGain.connect(masterGain);
  masterGain.connect(context.destination);

  humOscA.start();
  humOscB.start();
  humLfo.start();

  const whooshNoise = createNoiseBuffer(context, 0.34);

  return {
    context,
    masterGain,
    humGain,
    humOscA,
    humOscB,
    humLfo,
    humLfoGain,
    whooshNoise,
  };
}

function rampMasterGain(context: AudioContext, gainNode: GainNode, value: number, durationSeconds: number) {
  const now = context.currentTime;
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  gainNode.gain.linearRampToValueAtTime(clampNumber(value, 0, 1), now + Math.max(durationSeconds, 0.01));
}

function playWhoosh(graph: SoundGraph, kind: ScreenPacingKind | undefined, emotion: Emotion) {
  if (kind === 'mute' || kind === 'freeze') {
    return;
  }

  const { context, masterGain, whooshNoise } = graph;
  const now = context.currentTime;

  const source = context.createBufferSource();
  source.buffer = whooshNoise;

  const filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(420, now);
  filter.frequency.exponentialRampToValueAtTime(2200, now + 0.26);
  filter.Q.setValueAtTime(0.75, now);

  const gain = context.createGain();
  const emotionGain = resolveEmotionGain(emotion);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.012 * emotionGain, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  source.start(now);
  source.stop(now + 0.32);

  source.onended = () => {
    source.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

function playTextReverb(graph: SoundGraph, emotion: Emotion) {
  const { context, masterGain } = graph;
  const now = context.currentTime;

  const voice = context.createOscillator();
  voice.type = 'triangle';
  voice.frequency.setValueAtTime(480, now);
  voice.frequency.exponentialRampToValueAtTime(330, now + 0.2);

  const envelope = context.createGain();
  const emotionGain = resolveEmotionGain(emotion);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.linearRampToValueAtTime(0.0034 * emotionGain, now + 0.022);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);

  const bandpass = context.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(1120, now);
  bandpass.Q.setValueAtTime(0.8, now);

  const delay = context.createDelay();
  delay.delayTime.setValueAtTime(0.09, now);

  const feedback = context.createGain();
  feedback.gain.setValueAtTime(0.18, now);

  const wetGain = context.createGain();
  wetGain.gain.setValueAtTime(0.28, now);

  voice.connect(bandpass);
  bandpass.connect(envelope);

  envelope.connect(masterGain);
  envelope.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wetGain);
  wetGain.connect(masterGain);

  voice.start(now);
  voice.stop(now + 0.24);

  voice.onended = () => {
    voice.disconnect();
    bandpass.disconnect();
    envelope.disconnect();
    delay.disconnect();
    feedback.disconnect();
    wetGain.disconnect();
  };
}

export function useSubconsciousSoundDesign({
  enabled,
  screenId,
  emotion,
  kind,
}: SubconsciousSoundDesignOptions) {
  const graphRef = useRef<SoundGraph | null>(null);
  const previousScreenRef = useRef<number | null>(null);
  const lastTextTriggerRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      if (graphRef.current) {
        rampMasterGain(graphRef.current.context, graphRef.current.masterGain, 0, 0.34);
      }
      return;
    }

    if (!graphRef.current) {
      graphRef.current = createSoundGraph();
    }

    const graph = graphRef.current;
    const activate = () => {
      if (graph.context.state === 'suspended') {
        void graph.context.resume();
      }
      rampMasterGain(graph.context, graph.masterGain, MASTER_TARGET_GAIN, 1.8);
    };

    activate();

    const onGesture = () => {
      activate();
    };

    window.addEventListener('pointerdown', onGesture, { passive: true });
    window.addEventListener('keydown', onGesture);
    window.addEventListener('touchstart', onGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      window.removeEventListener('touchstart', onGesture);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !graphRef.current) {
      previousScreenRef.current = screenId;
      return;
    }

    const previousScreen = previousScreenRef.current;
    previousScreenRef.current = screenId;

    if (previousScreen === null || previousScreen === screenId) {
      return;
    }

    playWhoosh(graphRef.current, kind, emotion);
  }, [emotion, enabled, kind, screenId]);

  useEffect(() => {
    const onTextReveal = () => {
      if (!enabled || !graphRef.current) {
        return;
      }

      const now = performance.now();
      if (now - lastTextTriggerRef.current < 120) {
        return;
      }

      lastTextTriggerRef.current = now;
      playTextReverb(graphRef.current, emotion);
    };

    window.addEventListener(TEXT_REVEAL_EVENT, onTextReveal);
    return () => {
      window.removeEventListener(TEXT_REVEAL_EVENT, onTextReveal);
    };
  }, [emotion, enabled]);

  useEffect(() => {
    return () => {
      if (!graphRef.current) {
        return;
      }

      const graph = graphRef.current;
      rampMasterGain(graph.context, graph.masterGain, 0, 0.25);

      window.setTimeout(() => {
        try {
          graph.humOscA.stop();
          graph.humOscB.stop();
          graph.humLfo.stop();
        } catch {
          // No-op when already stopped.
        }

        void graph.context.close();
      }, 280);

      graphRef.current = null;
    };
  }, []);
}
