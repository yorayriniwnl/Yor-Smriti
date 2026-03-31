import type { ScreenPacingKind } from '@/hooks/useExperienceFlow';

export interface SceneAudioProfile {
  enabled: boolean;
  volume: number;
  fadeMs: number;
}

export function resolveSceneAudioProfile(kind: ScreenPacingKind | undefined): SceneAudioProfile {
  if (kind === 'freeze') {
    return {
      enabled: false,
      volume: 0,
      fadeMs: 540,
    };
  }

  if (kind === 'mute') {
    return {
      enabled: false,
      volume: 0,
      fadeMs: 1650,
    };
  }

  if (kind === 'peak') {
    return {
      enabled: true,
      volume: 0.12,
      fadeMs: 620,
    };
  }

  if (kind === 'afterglow') {
    return {
      enabled: true,
      volume: 0.16,
      fadeMs: 1700,
    };
  }

  return {
    enabled: true,
    volume: 0.28,
    fadeMs: 950,
  };
}
