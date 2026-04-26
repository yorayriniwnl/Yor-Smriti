export interface ExperienceCatalogItem {
  href: string;
  eyebrow: string;
  title: string;
  navLabel?: string;
  description: string;
  emoji: string;
  action: string;
  feeling: string;
  /**
   * When true, this entry is shown in the hub but excluded from the
   * automated sequence runner. Use for password-gated pages that cannot
   * meaningfully play inside a 45-second iframe slot.
   */
  skipInSequence?: boolean;
}

export const EXPERIENCE_CATALOG: readonly ExperienceCatalogItem[] = [
  // ── Phase 1: Memory & Love (establishing her as the centre) ──────────────
  {
    href: '/timeline',
    eyebrow: 'memory',
    title: 'Memory Timeline',
    navLabel: 'Timeline',
    description: 'Every moment that mattered, laid out like constellations.',
    emoji: '🌙',
    action: 'Open',
    feeling: 'Every moment that mattered, in order. It is all still here.',
  },
  {
    href: '/reasons',
    eyebrow: 'reasons',
    title: 'Why I Love You',
    navLabel: 'Reasons',
    description: 'Short, honest reasons written when I was completely sure.',
    emoji: '🌸',
    action: 'Feel it',
    feeling: 'Fifteen reasons. Each one is about you specifically.',
  },
  {
    href: '/stars',
    eyebrow: 'constellation',
    title: 'Our Stars',
    navLabel: 'Stars',
    description: 'An interactive sky where every star is a memory of us.',
    emoji: '✨',
    action: 'Explore',
    feeling: 'An interactive sky made of things I still think about.',
  },
  // Portrait comes early — she should know this is about her, fully, before
  // the apology arc begins.
  {
    href: '/her',
    eyebrow: 'portrait',
    title: 'Who She Is',
    description: 'A page entirely about her presence, softness, and strength.',
    emoji: '🌘',
    action: 'See her',
    feeling: 'A page that keeps the attention where it belongs.',
  },
  // ── Phase 2: What I noticed, what I kept ────────────────────────────────
  {
    href: '/words-she-said',
    eyebrow: 'I was listening',
    title: 'Things You Said',
    navLabel: 'Her Words',
    description: 'Specific phrases she said, and why they stayed with him.',
    emoji: '🪶',
    action: 'Read',
    feeling: 'Proof that he was paying attention.',
  },
  {
    href: '/small-things',
    eyebrow: 'noticed',
    title: 'Small Things',
    navLabel: 'Noticed',
    description: 'The gestures, habits, and details he noticed but never said.',
    emoji: '👁️',
    action: 'Notice',
    feeling: 'The small things are where the truth usually lives.',
  },
  {
    href: '/moments',
    eyebrow: 'moments',
    title: 'Three Moments',
    navLabel: 'Moments',
    description: 'Three full-screen scenes, written as present-tense memory.',
    emoji: '🕰️',
    action: 'Replay',
    feeling: 'Three scenes. The kind you keep replaying.',
  },
  // ── Phase 3: The honest reckoning ────────────────────────────────────────
  {
    href: '/apology-map',
    eyebrow: 'accountability',
    title: 'Where I Went Wrong',
    navLabel: 'Apology Map',
    description: 'A chronological map of specific failures, with dates and impact.',
    emoji: '🗺️',
    action: 'Open',
    feeling: 'Harder to read. More honest for it.',
  },
  {
    href: '/unsaid',
    eyebrow: 'confessions',
    title: 'Things I Never Said',
    navLabel: 'Unsaid',
    description: 'A quiet scroll of things he felt but never said out loud.',
    emoji: '🤍',
    action: 'Read',
    feeling: 'The things that stayed in his throat. All of them, finally out.',
  },
  {
    href: '/miss',
    eyebrow: 'missing',
    title: 'What I Miss About You',
    navLabel: 'What I Miss',
    description: 'A soft grid of specific things, not generic, just true.',
    emoji: '🌷',
    action: 'Read',
    feeling: 'Specific. Not sentimental. Just true.',
  },
  // ── Phase 4: The journey (core emotional experiences) ────────────────────
  {
    href: '/panda',
    eyebrow: 'apology',
    title: 'Apology Journey',
    navLabel: 'Apology',
    description: 'Eight interactive screens shaped around an honest apology.',
    emoji: '🐼',
    action: 'Begin',
    feeling: 'The clearest apology path, screen by screen.',
  },
  {
    href: '/love-sorry',
    eyebrow: 'love and sorry',
    title: 'Love & Sorry',
    description: 'Envelope, cards, letter, playlist, and finale in one flow.',
    emoji: '💔',
    action: 'Open',
    feeling: 'A full little world of cards, music, and the letter.',
  },
  {
    href: '/one-day',
    eyebrow: 'fantasy',
    title: 'One Day With You',
    navLabel: 'One Day',
    description: 'A written fantasy of one ordinary day together, morning to night.',
    emoji: '☁️',
    action: 'Visit',
    feeling: 'Not a grand gesture. Just a day. The kind we had.',
  },
  // ── Phase 5: Promises and commitments ────────────────────────────────────
  {
    href: '/promise',
    eyebrow: 'commitments',
    title: 'My Promises',
    navLabel: 'Promises',
    description: 'Things I will do differently. Written to be kept, not forgotten.',
    emoji: '🕯️',
    action: 'Read',
    feeling: 'What I am committing to, not as performance, as record.',
  },
  {
    href: '/letter',
    eyebrow: 'letter',
    title: 'The Letter',
    navLabel: 'Letter',
    description: 'A full-screen, distraction-free letter waiting to be read.',
    emoji: '💌',
    action: 'Read',
    feeling: 'No animations. No characters. Just his words, waiting.',
  },
  // ── Phase 6: Closing arc (growth → gratitude → the end) ─────────────────
  {
    href: '/the-good',
    eyebrow: 'just the good',
    title: 'What Was Actually Good',
    navLabel: 'The Good',
    description: 'No agenda, no apology. Just what was genuinely beautiful between us.',
    emoji: '🌿',
    action: 'Remember',
    feeling: 'It was real. I want you to know I know that.',
  },
  {
    href: '/before-after',
    eyebrow: 'then and now',
    title: 'Before & After',
    navLabel: 'Then & Now',
    description: 'A before-and-after of what knowing her changed in him.',
    emoji: '🔄',
    action: 'Compare',
    feeling: 'A quiet map of who he was, and who he wants to be.',
  },
  {
    href: '/questions',
    eyebrow: 'wondering',
    title: 'Questions',
    description: 'Honest questions he still carries without demanding answers.',
    emoji: '❓',
    action: 'Read',
    feeling: 'Curiosity without accusation. Tender, careful, unfinished.',
  },
  {
    href: '/gratitude',
    eyebrow: 'gratitude',
    title: 'Gratitude',
    description: 'What she changed in him, without asking for credit.',
    emoji: '🙏',
    action: 'Thank her',
    feeling: 'Some people leave gifts inside you. This names them.',
  },
  // ── Hub-only (password-gated — excluded from automated sequence) ─────────
  // skipInSequence: the page sits behind a password gate that cannot play
  // meaningfully in a 45-second iframe slot. It is discoverable from the hub
  // and is meant to be opened intentionally, not auto-advanced through.
  {
    href: '/for-her-alone',
    eyebrow: 'private',
    title: 'For Her Alone',
    description: 'A password-protected page. Only she gets here.',
    emoji: '🔒',
    action: 'Unlock',
    feeling: 'This one is just for you.',
    skipInSequence: true,
  },
];
