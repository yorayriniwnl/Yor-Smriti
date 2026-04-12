import type { Emotion } from '@/lib/emotionThemes';

export type EndingVariant = 'hopeful' | 'closure' | 'goodbye';

export function resolveEndingFromEmotionPath(path: Emotion[]): EndingVariant {
  if (path.includes('hope')) {
    return 'hopeful';
  }

  if (path.includes('closure')) {
    return 'closure';
  }

  return 'goodbye';
}
