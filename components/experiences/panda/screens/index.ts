import type { ComponentType } from 'react';
import { Screen80Intro } from '@/components/experiences/panda/screens/Screen80Intro';
import { Screen81CutThroughSilence } from '@/components/experiences/panda/screens/Screen81CutThroughSilence';
import { Screen82ClearCut } from '@/components/experiences/panda/screens/Screen82ClearCut';

export interface ApologyScreenMeta {
  screen: string;
  title: string;
  description: string;
}

export const APOLOGY_SCREEN_COMPONENTS: Record<string, ComponentType> = {
  '80': Screen80Intro,
  '81': Screen81CutThroughSilence,
  '82': Screen82ClearCut,
};

export const APOLOGY_SCREEN_METADATA: ApologyScreenMeta[] = [
  {
    screen: '80',
    title: 'I Love You Intro',
    description: 'A cinematic opening note for a breakup apology and love confession.',
  },
  {
    screen: '81',
    title: 'Cut Through Silence',
    description: 'An interaction where a single drag symbolizes cutting through ego and avoidance.',
  },
  {
    screen: '82',
    title: 'Clear Cut Confirmation',
    description: 'A visual confirmation that the silence is broken and repair can begin.',
  },
];

export const APOLOGY_SCREEN_KEYS = APOLOGY_SCREEN_METADATA.map((item) => item.screen);
