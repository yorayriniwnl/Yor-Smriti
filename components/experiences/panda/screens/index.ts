import type { ComponentType } from 'react';
import { Screen01Intro } from '@/components/experiences/panda/screens/Screen01Intro';
import { Screen02CutThroughSilence } from '@/components/experiences/panda/screens/Screen02CutThroughSilence';
import { Screen03ClearCut } from '@/components/experiences/panda/screens/Screen03ClearCut';
import { Screen04WhatIMiss } from '@/components/experiences/panda/screens/Screen04WhatIMiss';
import { Screen05WeightICarry } from '@/components/experiences/panda/screens/Screen05WeightICarry';
import { Screen06MyPromises } from '@/components/experiences/panda/screens/Screen06MyPromises';
import { Screen07ALetter } from '@/components/experiences/panda/screens/Screen07ALetter';
import { Screen08ComeBack } from '@/components/experiences/panda/screens/Screen08ComeBack';

export interface ApologyScreenMeta {
  screen: string;
  title: string;
  description: string;
}

export const APOLOGY_SCREEN_COMPONENTS: Record<string, ComponentType> = {
  '1': Screen01Intro,
  '2': Screen02CutThroughSilence,
  '3': Screen03ClearCut,
  '4': Screen04WhatIMiss,
  '5': Screen05WeightICarry,
  '6': Screen06MyPromises,
  '7': Screen07ALetter,
  '8': Screen08ComeBack,
};

export const APOLOGY_SCREEN_METADATA: ApologyScreenMeta[] = [
  {
    screen: '1',
    title: 'I Love You Intro',
    description: 'A cinematic opening note for a breakup apology and love confession.',
  },
  {
    screen: '2',
    title: 'Cut Through Silence',
    description: 'An interaction where a single drag symbolizes cutting through ego.',
  },
  {
    screen: '3',
    title: 'Clear Cut Confirmation',
    description: 'A visual confirmation that the silence is broken and repair can begin.',
  },
  {
    screen: '4',
    title: 'What I Miss',
    description: 'Staggered tiles reveal everything missed about you - one memory at a time.',
  },
  {
    screen: '5',
    title: 'The Weight I Carry',
    description: 'Slow blur-reveal of the truths I owe you. No excuses.',
  },
  {
    screen: '6',
    title: 'My Promises',
    description: 'Tap each promise to acknowledge it. All four must be accepted.',
  },
  {
    screen: '7',
    title: 'A Letter For You',
    description: 'A full hand-felt letter that reveals itself paragraph by paragraph.',
  },
  {
    screen: '8',
    title: 'Come Back To Me',
    description: 'The final screen. Tap the heart. No pressure.',
  },
];

export const APOLOGY_SCREEN_KEYS = APOLOGY_SCREEN_METADATA.map((item) => item.screen);
