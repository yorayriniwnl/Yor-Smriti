'use client';

/**
 * BackgroundLayers — single entry point for all ambient background effects.
 *
 * Previously ExperienceController lazy-loaded AnimatedGradient, FloatingParticles,
 * LightGlow and RainLayer as four separate dynamic() calls, each with its own
 * LoadingFallback. On first mount all four resolved simultaneously but still
 * triggered four independent loading placeholders, producing a visible flash
 * sequence before the background settled.
 *
 * Fix: all four components are imported here in a single module. The dynamic()
 * wrapper in ExperienceController now points to this file alone, so there is
 * exactly ONE loading boundary and ONE bundle request. The loading state is
 * transparent (null) so no placeholder flash is visible.
 */

import type { Emotion } from '@/lib/emotionThemes';
import { AnimatedGradient } from './AnimatedGradient';
import { FloatingParticles } from './FloatingParticles';
import { LightGlow } from './LightGlow';
import { RainLayer } from './RainLayer';

export interface BackgroundLayersProps {
  emotion: Emotion;
  showDecorativeLayers: boolean;
  showRainLayer: boolean;
  rainCount?: number;
}

export function BackgroundLayers({
  emotion,
  showDecorativeLayers,
  showRainLayer,
  rainCount = 72,
}: BackgroundLayersProps) {
  return (
    <>
      <AnimatedGradient emotion={emotion} />
      {showDecorativeLayers ? <FloatingParticles emotion={emotion} /> : null}
      {showDecorativeLayers ? <LightGlow emotion={emotion} /> : null}
      {showRainLayer ? <RainLayer count={rainCount} /> : null}
    </>
  );
}
