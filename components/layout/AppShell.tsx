'use client';

import { useEffect } from 'react';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { useAppStore } from '@/hooks/useStageController';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { StageRenderer } from '@/components/layout/StageRenderer';

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

      {/* Layer 2: Stage content */}
      <StageRenderer />

      {/* Layer 3: Grain texture (topmost visible) */}
      <GrainOverlay intensity="medium" animated />

      {/* Layer 4: Sound control */}
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
