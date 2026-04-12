export type SymbolKind = 'light' | 'shadow' | 'distance';

export const LETTER_PARAGRAPHS = [
  'I wrote this slowly because every fast word I ever used is part of what hurt us.',
  'I am done defending old versions of myself. The person writing this knows what he broke.',
  'If there is even a small chance left, I will rebuild with patience, not performance.',
  'Even if you never come back, I want you to know this apology is real.',
];

export const TIMELINE_CARDS = [
  {
    title: 'First Talk',
    detail: 'The night where time ran fast and still was not enough.',
  },
  {
    title: 'First Laugh',
    detail: 'The one where your shoulders dropped and you finally felt safe with me.',
  },
  {
    title: 'First Fight',
    detail: 'The day we chose pride before listening.',
  },
  {
    title: 'Last Silence',
    detail: 'The moment words ended but the feeling stayed.',
  },
];

export const FRAGMENT_WORDS = ['Sorry', 'Why?', 'Leave it', "It's nothing", 'Later', 'I am fine'];

export const SMALL_THINGS = ['Late night talks', 'Random laughs', 'Stupid fights'];

export const LETTER_PAGE_LINES = {
  101: 'I... missed... what your silence meant.',
  102: 'I... waited... and called it time.',
  103: 'Time... showed me everything.',
  104: 'How deeply... I hurt you.',
  105: 'How much... I lost.',
} as const;

export const LETTER_PAGE_LINE_LOOKUP: Record<number, string> = LETTER_PAGE_LINES;

export const LETTER_PAGE_ALIGNMENT: Record<number, 'left' | 'center' | 'right'> = {
  101: 'left',
  102: 'center',
  103: 'right',
  104: 'left',
  105: 'right',
};

export const STORY_HINT_FRAGMENTS = [
  '17 Sep 11:42 PM',
  'draft: "tomorrow, i promise"',
  'last seen 2:11 AM',
] as const;
