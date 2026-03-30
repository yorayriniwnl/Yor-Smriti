import type { ComponentType } from 'react';
import { Screen80Intro } from '@/components/experiences/panda/screens/Screen80Intro';
import { Screen81CutThroughSilence } from '@/components/experiences/panda/screens/Screen81CutThroughSilence';
import { Screen82ClearCut } from '@/components/experiences/panda/screens/Screen82ClearCut';
import { Screen83WhatIMiss } from '@/components/experiences/panda/screens/Screen83WhatIMiss';
import { Screen84WeightICarry } from '@/components/experiences/panda/screens/Screen84WeightICarry';
import { Screen85MyPromises } from '@/components/experiences/panda/screens/Screen85MyPromises';
import { Screen86ALetter } from '@/components/experiences/panda/screens/Screen86ALetter';
import { Screen87ComeBack } from '@/components/experiences/panda/screens/Screen87ComeBack';

export interface ApologyScreenMeta {
  screen: string;
  title: string;
  description: string;
}

export const APOLOGY_SCREEN_COMPONENTS: Record<string, ComponentType> = {
  '80': Screen80Intro,
  '81': Screen81CutThroughSilence,
  '82': Screen82ClearCut,
  '83': Screen83WhatIMiss,
  '84': Screen84WeightICarry,
  '85': Screen85MyPromises,
  '86': Screen86ALetter,
  '87': Screen87ComeBack,
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
    description: 'An interaction where a single drag symbolizes cutting through ego.',
  },
  {
    screen: '82',
    title: 'Clear Cut Confirmation',
    description: 'A visual confirmation that the silence is broken and repair can begin.',
  },
  {
    screen: '83',
    title: 'What I Miss',
    description: 'Staggered tiles reveal everything missed about you - one memory at a time.',
  },
  {
    screen: '84',
    title: 'The Weight I Carry',
    description: 'Slow blur-reveal of the truths I owe you. No excuses.',
  },
  {
    screen: '85',
    title: 'My Promises',
    description: 'Tap each promise to acknowledge it. All four must be accepted.',
  },
  {
    screen: '86',
    title: 'A Letter For You',
    description: 'A full hand-felt letter that reveals itself paragraph by paragraph.',
  },
  {
    screen: '87',
    title: 'Come Back To Me',
    description: 'The final screen. Tap the heart. No pressure.',
  },
];

export const APOLOGY_SCREEN_KEYS = APOLOGY_SCREEN_METADATA.map((item) => item.screen);
