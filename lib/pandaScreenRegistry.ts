import type { EndingVariant } from '@/lib/experienceEndings';

export interface PandaScreenRegistryItem {
  id: string;
  title: string;
  description: string;
  directorStartIndex: number;
  ending?: EndingVariant;
}

const SCREEN_DEFINITIONS: Array<Omit<PandaScreenRegistryItem, 'directorStartIndex' | 'ending'>> = [
  {
    id: '1',
    title: 'I Love You Intro',
    description: 'Opening note for the apology sequence.',
  },
  {
    id: '2',
    title: 'Cut Through Silence',
    description: 'Break the silence and begin the conversation.',
  },
  {
    id: '3',
    title: 'Clear Cut',
    description: 'Confirmation that the barrier is gone.',
  },
  {
    id: '4',
    title: 'What I Miss About You',
    description: 'Stacked memory tiles reveal one by one.',
  },
  {
    id: '5',
    title: 'The Weight I Carry',
    description: 'Slow confession reveal with emotional weight.',
  },
  {
    id: '6',
    title: 'My Promises',
    description: 'Interactive promise acknowledgements with progress.',
  },
  {
    id: '7',
    title: 'A Letter For You',
    description: 'Letter reveal with staggered paragraphs.',
  },
  {
    id: '8',
    title: 'Come Back To Me',
    description: 'Final cinematic CTA with heart particles.',
  },
];

export const PANDA_SCREEN_REGISTRY: PandaScreenRegistryItem[] = SCREEN_DEFINITIONS.map(
  (item, index) => ({
    ...item,
    directorStartIndex: index,
  }),
);

export const PANDA_SCREEN_IDS = PANDA_SCREEN_REGISTRY.map((item) => item.id);
