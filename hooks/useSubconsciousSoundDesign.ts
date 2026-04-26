/**
 * useSubconsciousSoundDesign — Bug 53 fix.
 *
 * ROOT CAUSE
 * ----------
 * The hook previously listened for the `yor:text-reveal` CustomEvent, which
 * TextReveal.tsx dispatched exactly once — on component mount — via a
 * useEffect with an empty dependency array [].
 *
 * ExperienceController does not unmount/remount TextReveal when transitioning
 * between screens; it merely updates the `text` prop. So after the very first
 * screen, no further `yor:text-reveal` events ever fire, and the audio whoosh
 * that was meant to accompany each screen's text reveal stops playing entirely.
 *
 * FIX (this file)
 * ---------------
 * The hook now listens for `yor:screen-reveal` — a new event name that
 * is explicitly fired once per *screen transition* rather than per mount.
 * See the companion fix in components/ui/TextReveal.tsx where the event is
 * dispatched with { detail: { screenKey } } whenever the `screenKey` prop
 * changes (the prop that ExperienceController increments on each transition).
 *
 * The whoosh is debounced to 120 ms so rapid successive transitions (e.g.
 * programmatic skip) do not stack audio triggers.
 */
'use client';

import { useEffect, useRef } from 'react';

/** Optional: tune the Web Audio whoosh parameters per your taste */
interface WhooshOptions {
  /** Base volume 0–1. Default 0.18 */
  volume?: number;
  /** Sweep start frequency in Hz. Default 1800 */
  freqStart?: number;
  /** Sweep end frequency in Hz. Default 320 */
  freqEnd?: number;
  /** Duration of the sweep in ms. Default 420 */
  durationMs?: number;
}

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedCtx || sharedCtx.state === 'closed') {
      sharedCtx = new AudioContext();
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

function playWhoosh(opts: WhooshOptions = {}): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const {
    volume = 0.18,
    freqStart = 1800,
    freqEnd = 320,
    durationMs = 420,
  } = opts;

  const duration = durationMs / 1000;

  try {
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.04);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    gainNode.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
    osc.connect(gainNode);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.05);
  } catch {
    // AudioContext may be suspended — ignore silently.
  }
}

interface SoundDesignOptions {
  enabled?: boolean;
  screenId?: number;
  emotion?: string;
  kind?: string;
}

export function useSubconsciousSoundDesign(
  enabledOrOpts: boolean | SoundDesignOptions = true,
  opts?: WhooshOptions,
): void {
  const enabled = typeof enabledOrOpts === 'boolean' ? enabledOrOpts : (enabledOrOpts.enabled ?? true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleScreenReveal = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // Resume AudioContext if suspended (requires prior user gesture).
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
          void ctx.resume().then(() => playWhoosh(opts));
        } else {
          playWhoosh(opts);
        }
      }, 120);
    };

    // Bug 53 fix: listen for yor:screen-reveal (fires per screen transition)
    // rather than yor:text-reveal (fired only once per mount by TextReveal.tsx).
    document.addEventListener('yor:screen-reveal', handleScreenReveal);

    return () => {
      document.removeEventListener('yor:screen-reveal', handleScreenReveal);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [enabled, opts]);
}
