export const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

export type WeightLine = {
  id: string;
  text: string;
  delay: number;
  emphasis?: boolean;
};

export type LetterParagraph = {
  id: string;
  text: string;
  delay: number;
  style?: 'salutation' | 'signature';
};

export const MISS_ITEMS = [
  {
    id: 'miss-1',
    emoji: '🌙',
    text: 'Our 10 AM to 10 PM texts.',
    sub: 'The random ones that made me smile.',
    color: 'rgba(200, 160, 220, 0.18)',
    delay: 0.1,
  },
  {
    id: 'miss-2',
    emoji: '☕',
    text: 'How you used to call me Ayrin.',
    sub: 'No one else says it like that.',
    color: 'rgba(255, 180, 140, 0.15)',
    delay: 0.7,
  },
  {
    id: 'miss-3',
    emoji: '🎵',
    text: "The videocalls, I still remember your face so clearly as if it's next to me.",
    sub: 'I still listen to it.',
    color: 'rgba(140, 200, 255, 0.14)',
    delay: 1.4,
  },
  {
    id: 'miss-4',
    emoji: '🌸',
    text: 'The way you laugh and Scream.',
    sub: 'Especially when you try not to.',
    color: 'rgba(255, 160, 190, 0.17)',
    delay: 2.1,
  },
  {
    id: 'miss-5',
    emoji: '✨',
    text: 'You, simply existing near me.',
    sub: undefined,
    color: 'rgba(255, 215, 140, 0.15)',
    delay: 2.8,
  },
] as const;

export const WEIGHT_LINES: WeightLine[] = [
  { id: 'l1', text: 'I chose silence when you needed words.', delay: 0.6 },
  { id: 'l2', text: 'I made you feel small. That was never okay.', delay: 1.8 },
  { id: 'l3', text: 'I let my ego sit where my love should have been.', delay: 3.2 },
  {
    id: 'l4',
    text: 'That is the weight I carry now. Every single day.',
    delay: 4.8,
    emphasis: true,
  },
] as const;

export const PROMISES = [
  { id: 'p1', text: 'I will listen. Fully. Without preparing my reply.', icon: '👂' },
  { id: 'p2', text: 'I will choose you over my pride. Every time.', icon: '🤝' },
  { id: 'p3', text: 'I will be honest even when it is uncomfortable.', icon: '💬' },
  { id: 'p4', text: 'I will show up for you the way you deserved all along.', icon: '🌹' },
] as const;

export const LETTER_PARAGRAPHS: LetterParagraph[] = [
  { id: 'p1', text: 'Meri Anya <3,', style: 'salutation', delay: 0.3 },
  {
    id: 'p2',
    text: 'I have been carrying this for a while. And I think it is time I stopped hiding it in late-night overthinking and actually gave it to you.',
    delay: 0.9,
  },
  {
    id: 'p3',
    text: 'You are one of the most important people in my life. I ruined something that was beautiful and rare, and I know that. I am not writing this to ask for a reset - I am writing this because you deserve to know exactly where I stand.',
    delay: 2.2,
  },
  {
    id: 'p4',
    text: 'I was wrong. Not in the vague, uncertain way people use when they want credit without changing. I was wrong specifically, knowingly, and I chose myself when I should have chosen us.',
    delay: 3.8,
  },
  {
    id: 'p5',
    text: 'If you ever find it in you to let me try again - I will do it differently. Quietly, consistently, with no grand gestures. Just showing up the way I should have from the start.',
    delay: 5.2,
  },
  {
    id: 'p6',
    text: 'With all the love I have,\n- Ayrin',
    style: 'signature',
    delay: 6.4,
  },
] as const;

export interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
}
