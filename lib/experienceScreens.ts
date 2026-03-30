import type { Screen } from '@/hooks/useExperienceFlow';
import type { EndingVariant } from '@/lib/experienceEndings';
import {
  RegretIntroScreen,
  SilenceScreen,
  PainScreen,
} from '@/components/experiences/director/screens/CoreNarrativeScreens';
import { MemoryTimelineScreen } from '@/components/experiences/director/screens/MemoryTimelineScreen';
import { GrowthScreen } from '@/components/experiences/director/screens/GrowthScreen';
import { InteractionLayerScreen } from '@/components/experiences/director/screens/InteractionLayerScreen';
import {
  EndingHopefulScreen,
  EndingClosureScreen,
  EndingGoodbyeScreen,
} from '@/components/experiences/director/screens/EndingScreens';

export const directorCoreScreens: Screen[] = [
  { id: 80, component: RegretIntroScreen, emotion: 'regret', duration: 4200 },
  { id: 81, component: SilenceScreen, emotion: 'silence', duration: 3900 },
  { id: 82, component: PainScreen, emotion: 'pain', duration: 4200 },
  { id: 83, component: MemoryTimelineScreen, emotion: 'love', duration: 0 },
  { id: 84, component: GrowthScreen, emotion: 'love', duration: 0 },
];

export const directorInteractionScreen: Screen = {
  id: 85,
  component: InteractionLayerScreen,
  emotion: 'silence',
  duration: 0,
};

export const directorEndingScreens: Record<EndingVariant, Screen> = {
  hopeful: {
    id: 90,
    component: EndingHopefulScreen,
    emotion: 'hope',
    duration: 0,
  },
  closure: {
    id: 91,
    component: EndingClosureScreen,
    emotion: 'closure',
    duration: 0,
  },
  goodbye: {
    id: 92,
    component: EndingGoodbyeScreen,
    emotion: 'silence',
    duration: 0,
  },
};
