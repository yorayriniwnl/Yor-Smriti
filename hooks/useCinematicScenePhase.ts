'use client';

import { useEffect, useState } from 'react';

export type CinematicScenePhase = 'enter' | 'reveal' | 'drift' | 'exit' | 'complete';

export function useCinematicScenePhase(
  enabled: boolean,
  enterMs: number,
  revealMs: number,
  driftMs: number,
  exitMs: number,
) {
  const [phase, setPhase] = useState<CinematicScenePhase>(enabled ? 'enter' : 'drift');
  const totalDurationMs = enterMs + revealMs + driftMs + exitMs;

  useEffect(() => {
    if (!enabled) {
      setPhase('drift');
      return;
    }

    setPhase('enter');

    const timeoutIds = [
      window.setTimeout(() => setPhase('reveal'), enterMs),
      window.setTimeout(() => setPhase('drift'), enterMs + revealMs),
      window.setTimeout(() => setPhase('exit'), enterMs + revealMs + driftMs),
      window.setTimeout(() => setPhase('complete'), totalDurationMs),
    ];

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [driftMs, enabled, enterMs, exitMs, revealMs, totalDurationMs]);

  return {
    phase,
    totalDurationMs,
    isExiting: phase === 'exit' || phase === 'complete',
  };
}
