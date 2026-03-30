import type {
  ChatMessage,
  Memory,
  AccountabilityLine,
  ApologyLine,
  GradientDefinition,
  MemoryGradient,
} from '@/types';

// ─── Chat Messages ───────────────────────────────────────────────────────────

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    text: "I know things haven't been right.",
    typingDuration: 2200,
    revealDelay: 800,
  },
  {
    id: 'msg-2',
    text: "And I don't want to pretend it's okay.",
    typingDuration: 2600,
    revealDelay: 1400,
  },
  {
    id: 'msg-3',
    text: 'So I made something instead of just texting.',
    typingDuration: 2800,
    revealDelay: 1800,
  },
  {
    id: 'msg-4',
    text: 'Please just hear me out.',
    typingDuration: 1800,
    revealDelay: 2200,
    isLast: true,
  },
];

// ─── Memory Cards ────────────────────────────────────────────────────────────

export const MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    gradient: 'warm-dusk',
    caption: 'These moments still live in me.',
    subCaption: 'Every little detail.',
    pauseBefore: 800,
    pauseAfter: 2400,
  },
  {
    id: 'mem-2',
    gradient: 'golden-hour',
    caption: 'You were never replaceable.',
    subCaption: 'Not then, not now.',
    pauseBefore: 1200,
    pauseAfter: 2400,
  },
  {
    id: 'mem-3',
    gradient: 'cool-morning',
    caption: 'I still pause at this memory.',
    pauseBefore: 1600,
    pauseAfter: 2400,
  },
  {
    id: 'mem-4',
    gradient: 'rainy-afternoon',
    caption: 'I did not forget us.',
    subCaption: 'I never did.',
    pauseBefore: 1200,
    pauseAfter: 2800,
  },
];

// ─── Gradient Definitions ─────────────────────────────────────────────────────

export const MEMORY_GRADIENTS: Record<MemoryGradient, GradientDefinition> = {
  'warm-dusk': {
    id: 'warm-dusk',
    colors: ['#2d1b0e', '#5c3317', '#8b4513', '#c4752d', '#e8a058'],
    direction: '135deg',
    overlayOpacity: 0.3,
  },
  'cool-morning': {
    id: 'cool-morning',
    colors: ['#0d1520', '#1a2a40', '#243450', '#2e4060', '#3a5070'],
    direction: '160deg',
    overlayOpacity: 0.25,
  },
  'golden-hour': {
    id: 'golden-hour',
    colors: ['#1a0d00', '#4a2800', '#8b5000', '#c8800a', '#e8a830'],
    direction: '120deg',
    overlayOpacity: 0.35,
  },
  'rainy-afternoon': {
    id: 'rainy-afternoon',
    colors: ['#12161a', '#1e2830', '#283845', '#324858', '#3c5868'],
    direction: '175deg',
    overlayOpacity: 0.20,
  },
  'late-night': {
    id: 'late-night',
    colors: ['#0a0a10', '#12121e', '#1a1a2e', '#22223e', '#2a2a50'],
    direction: '180deg',
    overlayOpacity: 0.15,
  },
};

// Helper to build gradient CSS string from definition
export function buildGradientCSS(gradient: MemoryGradient): string {
  const def = MEMORY_GRADIENTS[gradient];
  const stops = def.colors
    .map((color, i) => {
      const pct = Math.round((i / (def.colors.length - 1)) * 100);
      return `${color} ${pct}%`;
    })
    .join(', ');
  return `linear-gradient(${def.direction ?? '135deg'}, ${stops})`;
}

// ─── Accountability Lines ─────────────────────────────────────────────────────

export const ACCOUNTABILITY_LINES: AccountabilityLine[] = [
  {
    id: 'acc-1',
    text: 'I hurt you.',
    pauseAfter: 2000,
    emphasis: true,
  },
  {
    id: 'acc-2',
    text: 'I chose pride when I should have chosen honesty.',
    pauseAfter: 2400,
  },
  {
    id: 'acc-3',
    text: 'You did not deserve that.',
    pauseAfter: 2400,
  },
  {
    id: 'acc-4',
    text: 'I know sorry cannot erase it.',
    pauseAfter: 2400,
  },
  {
    id: 'acc-5',
    text: 'But I am taking responsibility, fully.',
    pauseAfter: 3000,
  },
];

// ─── Apology Lines ────────────────────────────────────────────────────────────

export const APOLOGY_LINES: ApologyLine[] = [
  {
    id: 'apo-1',
    text: 'I am truly sorry.',
    pauseAfter: 2600,
    emphasis: true,
  },
  {
    id: 'apo-2',
    text: 'No performance. No excuses.',
    pauseAfter: 2400,
    italic: true,
  },
  {
    id: 'apo-3',
    text: 'I know trust returns slowly.',
    pauseAfter: 2400,
  },
  {
    id: 'apo-4',
    text: 'If you give me a chance, I will prove change with actions.',
    pauseAfter: 3000,
    isOptional: true,
    italic: true,
  },
];

// ─── Transition Text ──────────────────────────────────────────────────────────

export const TRANSITION_TEXT = {
  primary: 'Before anything else...',
  sub: 'please feel this.',
};

// ─── Hold Button ──────────────────────────────────────────────────────────────

export const HOLD_BUTTON_CONFIG = {
  label: 'Hold to read my last confession',
  holdDuration: 2400,  // ms
  revealText: 'I still love you.',
};

// ─── Ending Content ───────────────────────────────────────────────────────────

export const ENDING_CONTENT = {
  finalLine: 'I love you. I am sorry.',
  buttons: [
    { id: 'btn-1', label: 'No pressure to reply tonight' },
    { id: 'btn-2', label: 'I will prove it with actions' },
  ],
};

// ─── Opening Content ──────────────────────────────────────────────────────────

export const OPENING_CONTENT = {
  headline: 'Hey... give me one honest minute.',
  buttonLabel: 'Okay',
};
