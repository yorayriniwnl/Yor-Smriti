'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef, type TouchEvent } from 'react';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { useAppStore } from '@/hooks/useStageController';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
const PetalCanvas = dynamic(() => import('@/components/ui/PetalCanvas').then((m) => m.PetalCanvas), {
  ssr: false,
  loading: () => null,
});
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { StageProgressBar } from '@/components/ui/StageProgressBar';
import { SoundToggle } from '@/components/ui/SoundToggle';
const StageRenderer = dynamic(() => import('@/components/layout/StageRenderer').then((m) => m.StageRenderer), {
  ssr: false,
  loading: () => null,
});

// ─── AppShell ─────────────────────────────────────────────────────────────────

export function AppShell() {
  // Activate ambient sound system
  useAmbientSound();
  const currentStage = useAppStore((s) => s.currentStage);
  const advanceStage = useAppStore((s) => s.advanceStage);
  const goToStage = useAppStore((s) => s.goToStage);
  const previousStage = useAppStore((s) => s.previousStage);

  // On touch devices we hide heavy particle FX and enable swipe navigation.
  const [showPetals, setShowPetals] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: fine) and (min-width: 720px)');
    const update = () => setShowPetals(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!e.touches || e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? 0;
    const endY = e.changedTouches?.[0]?.clientY ?? 0;
    const dt = Date.now() - (touchStartTime.current ?? 0);
    const dx = endX - (touchStartX.current ?? 0);
    const dy = endY - (touchStartY.current ?? 0);
    // Horizontal swipe (left/right) threshold
    if (Math.abs(dx) > 60 && Math.abs(dy) < 80 && dt < 700) {
      if (dx < 0) {
        advanceStage();
      } else if (dx > 0 && previousStage) {
        // navigate back to previous stage when available
        goToStage(previousStage);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchStartTime.current = null;
  };

  return (
    <div
      className="relative h-dvh w-dvw overflow-hidden"
      style={{ backgroundColor: 'var(--bg)', touchAction: 'pan-y' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Layer 1: Background atmosphere */}
      <AmbientBackground stage={currentStage} />

      {/* Layer 2: Particle atmosphere (disabled on small/touch devices) */}
      {showPetals ? <PetalCanvas stage={currentStage} /> : null}

      {/* Layer 3: Stage content */}
      <StageRenderer />

      {/* Layer 4: Grain texture (topmost visible) */}
      <GrainOverlay intensity="medium" animated />

      {/* Layer 5: Progress + sound controls */}
      <StageProgressBar />
      <SoundToggle />

      {/* Accessible skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded focus:bg-amber-500 focus:px-3 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>
    </div>
  );
}
