'use client';

import dynamic from 'next/dynamic';
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

  return (
    <div
      className="relative h-dvh w-dvw overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Layer 1: Background atmosphere */}
      <AmbientBackground stage={currentStage} />

      {/* Layer 2: Particle atmosphere */}
      <PetalCanvas stage={currentStage} />

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
