import type { ExperienceMood } from '@/hooks/useExperienceFlow';
import type { Emotion } from '@/lib/emotionThemes';

export const emotionTemperatureTint: Record<Emotion, string> = {
  regret: 'rgba(126, 162, 255, 0.24)',
  silence: 'rgba(177, 186, 218, 0.16)',
  pain: 'rgba(255, 122, 122, 0.17)',
  love: 'rgba(255, 147, 202, 0.24)',
  hope: 'rgba(255, 196, 112, 0.24)',
  closure: 'rgba(220, 220, 220, 0.18)',
};

export const moodOverlayTint: Record<ExperienceMood, string> = {
  default: 'rgba(255, 255, 255, 0.06)',
  dark: 'rgba(0, 0, 0, 0.28)',
  hopeful: 'rgba(255, 207, 148, 0.12)',
  minimal: 'rgba(255, 255, 255, 0.03)',
};

export const moodTransitionDrag: Record<ExperienceMood, number> = {
  default: 1,
  dark: 1.08,
  hopeful: 0.94,
  minimal: 0.9,
};

export type TimeContext = 'day' | 'twilight' | 'night';

export const timeContextVisuals: Record<
  TimeContext,
  {
    centerLift: number;
    edgeDarkness: number;
    washTint: string;
  }
> = {
  day: {
    centerLift: 0.065,
    edgeDarkness: 0.42,
    washTint: 'rgba(255, 224, 186, 0.08)',
  },
  twilight: {
    centerLift: 0.056,
    edgeDarkness: 0.5,
    washTint: 'rgba(194, 183, 255, 0.06)',
  },
  night: {
    centerLift: 0.046,
    edgeDarkness: 0.6,
    washTint: 'rgba(134, 156, 228, 0.05)',
  },
};

export const emotionLinkedMotion: Record<
  Emotion,
  {
    x: number[];
    y: number[];
    rotate: number[];
    duration: number;
    ease: 'easeInOut' | 'linear';
  }
> = {
  regret: {
    x: [-10, 10, -8],
    y: [-6, 8, -5],
    rotate: [-0.35, 0.35, -0.25],
    duration: 18,
    ease: 'easeInOut',
  },
  silence: {
    x: [-2, 2, -2],
    y: [0, 2, 0],
    rotate: [0, 0.08, 0],
    duration: 14,
    ease: 'easeInOut',
  },
  pain: {
    x: [-2, 2, -1.5, 1.5, 0],
    y: [0.8, -0.8, 0.7, -0.6, 0],
    rotate: [0, -0.18, 0.14, -0.12, 0],
    duration: 2.8,
    ease: 'linear',
  },
  love: {
    x: [-4, 4, -3],
    y: [4, -7, 4],
    rotate: [-0.2, 0.2, -0.18],
    duration: 10,
    ease: 'easeInOut',
  },
  hope: {
    x: [-5, 5, -4],
    y: [3, -5, 3],
    rotate: [-0.16, 0.16, -0.14],
    duration: 9,
    ease: 'easeInOut',
  },
  closure: {
    x: [-3, 3, -2],
    y: [2, -3, 2],
    rotate: [-0.1, 0.1, -0.08],
    duration: 11,
    ease: 'easeInOut',
  },
};

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function resolveTimeContext(): TimeContext {
  const hour = new Date().getHours();

  if (hour >= 20 || hour < 5) {
    return 'night';
  }

  if ((hour >= 5 && hour < 8) || (hour >= 18 && hour < 20)) {
    return 'twilight';
  }

  return 'day';
}
