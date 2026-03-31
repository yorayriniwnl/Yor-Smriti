import type { Emotion } from '@/lib/emotionThemes';
import type { ScreenPacingKind } from '@/hooks/useExperienceFlow';

export type TimingConfig = {
  duration: number;
  delay: number;
  easing: 'easeOut' | 'easeInOut' | 'easeIn' | 'linear';
};

export const emotionTiming: Record<Emotion, TimingConfig> = {
  regret: { duration: 1.4, delay: 0.4, easing: 'easeOut' },
  pain: { duration: 2.0, delay: 0.6, easing: 'easeInOut' },
  love: { duration: 0.9, delay: 0.2, easing: 'easeOut' },
  silence: { duration: 1.8, delay: 0.5, easing: 'easeInOut' },
  hope: { duration: 0.85, delay: 0.18, easing: 'easeOut' },
  closure: { duration: 1.15, delay: 0.34, easing: 'easeInOut' },
};

export function resolveEmotionTiming(
  emotion: Emotion,
  kind: ScreenPacingKind = 'normal',
  timingOverride?: Partial<TimingConfig>,
): TimingConfig {
  const base = emotionTiming[emotion];

  let resolved: TimingConfig = {
    ...base,
  };

  if (kind === 'flash') {
    resolved = {
      duration: Math.max(base.duration * 0.52, 0.45),
      delay: 0.06,
      easing: 'linear',
    };
  }

  if (kind === 'frozen') {
    resolved = {
      duration: Math.max(base.duration * 1.18, 1.2),
      delay: Math.max(base.delay, 0.3),
      easing: 'easeInOut',
    };
  }

  if (kind === 'silence') {
    resolved = {
      duration: Math.max(base.duration, 1.9),
      delay: Math.max(base.delay, 0.5),
      easing: 'easeInOut',
    };
  }

  if (kind === 'memory-fragment') {
    resolved = {
      duration: Math.max(base.duration * 0.88, 0.72),
      delay: Math.max(base.delay * 0.7, 0.1),
      easing: 'easeOut',
    };
  }

  if (kind === 'freeze') {
    resolved = {
      duration: Math.max(base.duration * 0.9, 0.7),
      delay: 0,
      easing: 'linear',
    };
  }

  if (kind === 'mute') {
    resolved = {
      duration: Math.max(base.duration * 0.82, 0.65),
      delay: Math.max(base.delay * 0.5, 0.08),
      easing: 'easeInOut',
    };
  }

  if (kind === 'peak') {
    resolved = {
      duration: Math.max(base.duration * 1.24, 1.1),
      delay: Math.max(base.delay, 0.28),
      easing: 'easeInOut',
    };
  }

  if (kind === 'afterglow') {
    resolved = {
      duration: Math.max(base.duration * 1.34, 1.25),
      delay: Math.max(base.delay, 0.34),
      easing: 'easeOut',
    };
  }

  if (!timingOverride) {
    return resolved;
  }

  return {
    duration: timingOverride.duration ?? resolved.duration,
    delay: timingOverride.delay ?? resolved.delay,
    easing: timingOverride.easing ?? resolved.easing,
  };
}
