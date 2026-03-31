import type { EndingVariant } from '@/lib/experienceEndings';

export interface PandaScreenRegistryItem {
  id: string;
  title: string;
  description: string;
  directorStartIndex: number;
  ending?: EndingVariant;
}

const SCREEN_DEFINITIONS: Array<
  Omit<PandaScreenRegistryItem, 'directorStartIndex' | 'ending'>
> = [
  {
    id: '80',
    title: 'I Love You Intro',
    description: 'A cinematic opening note for a breakup apology and love confession.',
  },
  {
    id: '81',
    title: 'Cut Through Silence',
    description: 'An interaction where a single drag symbolizes cutting through ego.',
  },
  {
    id: '82',
    title: 'Clear Cut Confirmation',
    description: 'A visual confirmation that the silence is broken and repair can begin.',
  },
  {
    id: '83',
    title: 'What I Miss',
    description: 'Memory timeline and emotional recall.',
  },
  {
    id: '84',
    title: 'The Weight I Carry',
    description: 'Growth and reflection with slow reveal pacing.',
  },
  {
    id: '85',
    title: 'Your Choice Matters',
    description: 'Interactive layer with tap, hold, and choice-based direction.',
  },
  {
    id: '86',
    title: 'The Letter',
    description: 'A scrollable confession letter with cinematic typewriter pacing.',
  },
  {
    id: '87',
    title: 'Freeze Moment',
    description: 'A silent two-second stillness that holds attention before release.',
  },
  {
    id: '88',
    title: 'The Timeline',
    description: 'Horizontal memory timeline with first talk, laugh, fight, and last silence.',
  },
  {
    id: '89',
    title: 'The First Crack',
    description: 'Regret-focused center narrative with subtle crack overlays.',
  },
  {
    id: '90',
    title: 'The Things I Said',
    description: 'Guilt peak with floating word fragments and slow zoom.',
  },
  {
    id: '91',
    title: 'Your Silence',
    description: 'A heavy silence screen with blinking cursor and muted audio.',
  },
  {
    id: '92',
    title: 'The Distance',
    description: 'Separation release with lingering afterglow transition.',
  },
  {
    id: '93',
    title: 'What I Miss Again',
    description: 'Longing-driven warm pulse about missing us, not just you.',
  },
  {
    id: '94',
    title: 'Small Things',
    description: 'Tender nostalgia list where each memory appears with delay.',
  },
  {
    id: '95',
    title: 'My Mistakes',
    description: 'Minimal accountability frame with slow fade on dark background.',
  },
  {
    id: '96',
    title: 'I Realize Now',
    description: 'Reflection beat with a center glow expanding outward.',
  },
  {
    id: '97',
    title: 'You Deserved Better',
    description: 'Deep regret frame with soft vignette and slight zoom.',
  },
  {
    id: '98',
    title: 'If I Could Go Back',
    description: 'What-if sequence with rewind-like background motion.',
  },
  {
    id: '99',
    title: 'The Apology',
    description: 'Peak apology frame with dramatic text and forced pause.',
  },
  {
    id: '100',
    title: 'The Letter Begins',
    description: 'Transition moment that fades into the letter pages.',
  },
  {
    id: '101',
    title: 'Letter I',
    description: 'I did not understand your silence.',
  },
  {
    id: '102',
    title: 'Letter II',
    description: 'I thought time would fix things.',
  },
  {
    id: '103',
    title: 'Letter III',
    description: 'But time only made me realize.',
  },
  {
    id: '104',
    title: 'Letter IV',
    description: 'How much I hurt you.',
  },
  {
    id: '105',
    title: 'Letter V',
    description: 'And how much I lost.',
  },
  {
    id: '106',
    title: 'No Expectations',
    description: 'Letting go without demanding forgiveness.',
  },
  {
    id: '107',
    title: 'But If',
    description: 'Hopeful bridge toward a possible someday.',
  },
  {
    id: '108',
    title: 'I Will Be Here',
    description: 'Soft hope statement in two quiet lines.',
  },
  {
    id: '109',
    title: 'Or Maybe',
    description: 'Acceptance that this might be where it ends.',
  },
  {
    id: '110',
    title: 'Goodbye / Fade',
    description: 'Final closure frame with a single line and deep fade.',
  },
  {
    id: '111',
    title: 'Ghost Echo',
    description: 'Unexpected after-end whisper: still here?',
  },
  {
    id: '112',
    title: 'No-Text Void',
    description: 'Pure feeling screen: atmosphere, light, and silence only.',
  },
  {
    id: '113',
    title: 'Almost Missed',
    description: 'A near-invisible line appears and vanishes before delayed honesty arrives.',
  },
  {
    id: '114',
    title: 'Fake End',
    description: 'Looks finished in black, then quietly returns with one last thing.',
  },
  {
    id: '115',
    title: 'Memory Distortion',
    description: 'Remembered lines return altered with unread-feeling blur and guilt mirror.',
  },
  {
    id: '116',
    title: 'Still There',
    description: 'Long silence asks if the viewer is still present, with hidden long-press text.',
  },
  {
    id: '117',
    title: 'Story Flip',
    description: 'Perspective turns toward the viewer and ends with an unfinished sentence.',
  },
  {
    id: '118',
    title: 'Final Micro Interaction',
    description: 'Click yields no immediate response, then a gentle it is okay appears.',
  },
  {
    id: '119',
    title: 'True Final State',
    description: 'No UI and no prompts, only darkness, silence, and memory.',
  },
];

export const PANDA_SCREEN_REGISTRY: PandaScreenRegistryItem[] = SCREEN_DEFINITIONS.map((item, index) => ({
  ...item,
  id: String(index + 1),
  directorStartIndex: index,
}));

export const PANDA_SCREEN_IDS = PANDA_SCREEN_REGISTRY.map((item) => item.id);
