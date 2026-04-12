import type { LetterParagraph, ScreenKey, Song, SorryCard } from './types';

export const SCREENS: ScreenKey[] = ['envelope', 'cards', 'letter', 'sealing', 'playlist', 'final'];

export const SORRY_CARDS: SorryCard[] = [
  {
    id: 'c1',
    front: { emoji: '💔', title: 'Card 1', hint: 'Tap to open' },
    back: {
      text: 'I chose my ego over you. That was the biggest mistake I have ever made.',
      sub: 'I am truly, deeply sorry.',
    },
  },
  {
    id: 'c2',
    front: { emoji: '🌙', title: 'Card 2', hint: 'Tap to open' },
    back: {
      text: 'I made you feel like you were too much. You were never too much. I was just not enough.',
      sub: 'You deserved better than that.',
    },
  },
  {
    id: 'c3',
    front: { emoji: '✨', title: 'Card 3', hint: 'Tap to open' },
    back: {
      text: 'I still think about you every single day. That never stopped.',
      sub: 'It probably never will.',
    },
  },
];

export const SONGS: Song[] = [
  {
    id: 's1',
    title: 'Tere Liye',
    artist: 'Atif Aslam',
    note: 'Because this is what I feel 💭',
    color: '#f472b6',
    bar: 0.38,
  },
  {
    id: 's2',
    title: 'Pehli Nazar Mein',
    artist: 'Atif Aslam',
    note: 'The way I still see you 🌸',
    color: '#fb7185',
    bar: 0.61,
  },
  {
    id: 's3',
    title: 'Raabta',
    artist: 'Arijit Singh',
    note: 'We are connected, always 🔗',
    color: '#c084fc',
    bar: 0.5,
  },
];

export const LETTER_PARAGRAPHS: LetterParagraph[] = [
  { id: 0, salutation: true, text: 'My dearest,' },
  {
    id: 1,
    text: "I don't know if you'll read this. But I needed to write it. For you, and honestly - for me.",
  },
  {
    id: 2,
    text: 'I hurt you. Not by accident. I made choices that pushed you away, and I watched it happen without doing enough to stop it. That is something I carry every day.',
  },
  {
    id: 3,
    text: 'I love you. Still. Quietly. Without conditions or deadlines. And I am deeply, genuinely sorry.',
  },
  {
    id: 4,
    signature: true,
    text: 'Yours, always -\nAyrin',
  },
];
