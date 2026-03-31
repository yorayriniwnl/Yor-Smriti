import type { Emotion } from '@/lib/emotionThemes';
import type {
  ExperienceFlowMode,
  ExperienceMood,
  ScreenPacingKind,
} from '@/hooks/useExperienceFlow';

interface EmotionalPhysicsInput {
  screenId?: number;
  emotion: Emotion;
  kind?: ScreenPacingKind;
  progress: number;
  mood: ExperienceMood;
  flowMode: ExperienceFlowMode;
  isSilentMode: boolean;
}

export interface EmotionalPhysicsState {
  pulseScale: number;
  lightGain: number;
  audioGain: number;
  silenceWeight: number;
  textSpacingBoost: number;
  transitionDrag: number;
}

const emotionTension: Record<Emotion, number> = {
  regret: 0.82,
  silence: 0.9,
  pain: 1,
  love: 0.68,
  hope: 0.52,
  closure: 0.58,
};

const moodWeight: Record<ExperienceMood, number> = {
  default: 1,
  dark: 1.16,
  hopeful: 0.84,
  minimal: 0.72,
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolvePacingWave(screenId: number | undefined): {
  curve: number;
  releaseEcho: number;
} {
  if (typeof screenId !== 'number') {
    return {
      curve: 0.86,
      releaseEcho: 0.12,
    };
  }

  if (screenId <= 88) {
    const buildProgress = clampNumber((screenId - 80) / 8, 0, 1);
    return {
      curve: 0.58 + buildProgress * 0.24,
      releaseEcho: 0.04,
    };
  }

  if (screenId <= 95) {
    return {
      curve: 0.96,
      releaseEcho: 0.06,
    };
  }

  if (screenId <= 100) {
    return {
      curve: 1.14,
      releaseEcho: 0.02,
    };
  }

  if (screenId <= 110) {
    const releaseProgress = clampNumber((screenId - 101) / 9, 0, 1);
    return {
      curve: 0.84 - releaseProgress * 0.26,
      releaseEcho: 0.16 + releaseProgress * 0.26,
    };
  }

  return {
    curve: 0.82,
    releaseEcho: 0.14,
  };
}

export function resolveEmotionalPhysics(input: EmotionalPhysicsInput): EmotionalPhysicsState {
  const pacingWave = resolvePacingWave(input.screenId);
  const tension = emotionTension[input.emotion] * moodWeight[input.mood];
  const flowChaos = input.flowMode === 'non-linear' ? 1.08 : 1;
  const kindSilenceBoost = input.kind === 'mute' || input.kind === 'freeze' ? 0.22 : 0;
  const kindPeakBoost = input.kind === 'peak' ? 0.14 : 0;

  const progressWeight = 0.85 + input.progress * 0.34;
  const energy = tension * flowChaos * progressWeight * pacingWave.curve + kindPeakBoost;
  const silenceWeight = clampNumber(
    0.11 + tension * 0.2 + kindSilenceBoost - pacingWave.releaseEcho * 0.12,
    0.05,
    0.45,
  );

  const audioGain = input.isSilentMode
    ? 0
    : clampNumber(0.72 + energy * 0.24 - silenceWeight * 0.12, 0.35, 1.18);

  return {
    pulseScale: clampNumber(
      1 + (0.008 + input.progress * 0.014) * (0.7 + tension * 0.25) * pacingWave.curve,
      1.004,
      1.03,
    ),
    lightGain: clampNumber(
      0.6 + (1 - tension) * 0.42 + input.progress * 0.24 + pacingWave.releaseEcho * 0.2,
      0.55,
      1.35,
    ),
    audioGain,
    silenceWeight,
    textSpacingBoost: clampNumber(
      0.002 + input.progress * (0.006 + (1 - tension) * 0.003) + pacingWave.releaseEcho * 0.002,
      0.002,
      0.014,
    ),
    transitionDrag: clampNumber(
      0.9 + tension * 0.3 + kindSilenceBoost * 0.9 + (1 - pacingWave.curve) * 0.16,
      0.86,
      1.42,
    ),
  };
}
