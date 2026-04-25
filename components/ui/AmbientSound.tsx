'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * A single optional ambient sound toggle — top right corner.
 * Muted by default, never auto-plays.
 * Uses Web Audio API to synthesize a soft piano/pad tone:
 * layered sine oscillators + gentle reverb, no external file needed.
 *
 * Usage:
 *   <AmbientSound />
 */

function buildReverb(ctx: AudioContext, durationSec: number, decay: number): ConvolverNode {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * durationSec;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const channel = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  const reverb = ctx.createConvolver();
  reverb.buffer = impulse;
  return reverb;
}

interface SoundNodes {
  ctx: AudioContext;
  master: GainNode;
  oscillators: OscillatorNode[];
}

// A cluster of soft sine tones — a low A minor pad
const CHORD_FREQS = [
  110,       // A2
  165,       // E3
  220,       // A3
  261.63,    // C4
  329.63,    // E4
  440,       // A4
];

function startAmbient(): SoundNodes {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 3.5);

  const reverb = buildReverb(ctx, 4, 2.2);
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.55;

  master.connect(reverb);
  reverb.connect(reverbGain);
  reverbGain.connect(ctx.destination);
  master.connect(ctx.destination);

  const oscillators: OscillatorNode[] = CHORD_FREQS.map((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Slight detuning per voice for warmth
    osc.detune.value = (i % 2 === 0 ? 1 : -1) * (i * 0.7);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(
      0.12 + Math.random() * 0.05,
      ctx.currentTime + 2 + i * 0.3,
    );

    osc.connect(gain);
    gain.connect(master);
    osc.start();

    return osc;
  });

  return { ctx, master, oscillators };
}

export function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const nodesRef = useRef<SoundNodes | null>(null);

  useEffect(() => {
    if (typeof AudioContext === 'undefined' && typeof (window as Window & { webkitAudioContext?: unknown }).webkitAudioContext === 'undefined') {
      setSupported(false);
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (playing) {
      // Fade out and stop
      const nodes = nodesRef.current;
      if (nodes) {
        const { ctx, master, oscillators } = nodes;
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
        setTimeout(() => {
          oscillators.forEach((o) => {
            try { o.stop(); } catch { /* already stopped */ }
          });
          try { ctx.close(); } catch { /* ignore */ }
          nodesRef.current = null;
        }, 2200);
      }
      setPlaying(false);
    } else {
      // Start
      try {
        const nodes = startAmbient();
        nodesRef.current = nodes;
        setPlaying(true);
      } catch {
        setSupported(false);
      }
    }
  }, [playing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const nodes = nodesRef.current;
      if (nodes) {
        nodes.master.gain.setValueAtTime(0, nodes.ctx.currentTime);
        nodes.oscillators.forEach((o) => {
          try { o.stop(); } catch { /* ignore */ }
        });
        try { nodes.ctx.close(); } catch { /* ignore */ }
        nodesRef.current = null;
      }
    };
  }, []);

  if (!supported) return null;

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      title={playing ? 'Turn off ambient sound' : 'Turn on ambient sound'}
      aria-label={playing ? 'Turn off ambient sound' : 'Turn on ambient sound'}
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 50,
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: playing
          ? 'rgba(247, 85, 144, 0.14)'
          : 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${playing ? 'rgba(247, 130, 175, 0.4)' : 'rgba(244, 173, 210, 0.18)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Sound wave icon — SVG, no external deps */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        style={{ opacity: playing ? 0.9 : 0.45 }}
      >
        {playing ? (
          // Waveform bars
          <>
            <rect x="0" y="4" width="2" height="6" rx="1" fill="rgba(247,130,175,0.9)" />
            <rect x="3" y="2" width="2" height="10" rx="1" fill="rgba(247,130,175,0.9)" />
            <rect x="6" y="0" width="2" height="14" rx="1" fill="rgba(247,130,175,0.9)" />
            <rect x="9" y="2" width="2" height="10" rx="1" fill="rgba(247,130,175,0.9)" />
            <rect x="12" y="4" width="2" height="6" rx="1" fill="rgba(247,130,175,0.9)" />
          </>
        ) : (
          // Muted — flat bars
          <>
            <rect x="0" y="6" width="2" height="2" rx="1" fill="rgba(244,173,210,0.55)" />
            <rect x="3" y="6" width="2" height="2" rx="1" fill="rgba(244,173,210,0.55)" />
            <rect x="6" y="6" width="2" height="2" rx="1" fill="rgba(244,173,210,0.55)" />
            <rect x="9" y="6" width="2" height="2" rx="1" fill="rgba(244,173,210,0.55)" />
            <rect x="12" y="6" width="2" height="2" rx="1" fill="rgba(244,173,210,0.55)" />
          </>
        )}
      </svg>
    </motion.button>
  );
}
