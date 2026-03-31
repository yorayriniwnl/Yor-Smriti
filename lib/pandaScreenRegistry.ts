import type { EndingVariant } from '@/lib/experienceEndings';

export interface PandaScreenRegistryItem {
  id: string;
  title: string;
  description: string;
  directorStartIndex: number;
  ending?: EndingVariant;
}

const SCRIPT_LINES = [
  'Do you remember?',
  'Because I do.',
  'Too clearly.',
  'Every small thing...',
  "That I should've valued.",
  "But didn't.",
  'Not when it mattered.',
  'Not when it was you.',

  'It started quietly...',
  'Things... slipping.',
  "Words I didn't think twice about.",
  'But you felt every one.',
  'And then...',
  'You went quiet.',
  'Not angry.',
  'Just... distant.',

  'We were still there.',
  'Just not... together.',
  'Same space.',
  'Different silence.',

  'I miss you.',
  'But not just you...',
  'Us.',
  'The version that laughed...',
  'Before things got heavy.',

  "I left because I felt I didn't deserve you.",
  "I wasn't stable mentally.",
  "I wasn't stable physically.",
  "It wasn't you.",

  'It was me.',
  'And I knew I was not enough then.',

  'I stepped away... and called it protection.',
  'But it hurt you too.',
  'I see that now.',
  'It showed me everything.',

  "I'm sorry.",
  'For leaving when you needed me.',
  'For making you question yourself.',
  'It was never your fault.',
  'It was my instability.',
  'Not your worth.',

  'I see it now.',
  'Too late, maybe.',
  'But clearly.',
  "You weren't asking for much.",
  'Just... me.',

  "I don't expect anything.",
  'Not even forgiveness.',
  'But if someday...',
  'You think of me-',
  "I hope it doesn't hurt.",

  "I'll be here.",
  "Even if you're not.",
  'Or maybe...',
  'This is where it ends.',

  'Take care.',
  'Always.',

  'Still here?',
  'I thought you might be.',
] as const;

const SHIFT_LABEL_BY_ID: Partial<Record<number, string>> = {
  88: 'Memory -> Realization',
  96: 'Distance',
  100: 'Longing',
  105: 'Accountability',
  109: 'Regret Peak',
  111: 'Extended Peak',
  115: 'The Apology Core',
  121: 'Letter Fragments',
  126: 'Letting Go / Hope',
  131: 'Final Emotional Fade',
  135: 'Final Line',
  137: 'Afterglow',
};

const SCREEN_DEFINITIONS: Array<
  Omit<PandaScreenRegistryItem, 'directorStartIndex' | 'ending'>
> = SCRIPT_LINES.map((line, index) => {
  const screenId = 80 + index;
  const shiftLabel = SHIFT_LABEL_BY_ID[screenId];

  return {
    id: String(screenId),
    title: line,
    description: shiftLabel ? `${shiftLabel}: ${line}` : `Narrative beat: ${line}`,
  };
});

export const PANDA_SCREEN_REGISTRY: PandaScreenRegistryItem[] = SCREEN_DEFINITIONS.map(
  (item, index) => ({
    ...item,
    id: String(index + 1),
    directorStartIndex: index,
  }),
);

export const PANDA_SCREEN_IDS = PANDA_SCREEN_REGISTRY.map((item) => item.id);
