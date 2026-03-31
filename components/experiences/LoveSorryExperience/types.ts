export type ScreenKey =
  | 'envelope'
  | 'cards'
  | 'letter'
  | 'sealing'
  | 'playlist'
  | 'final';

export type CardFace = {
  emoji: string;
  title: string;
  hint: string;
};

export type CardBack = {
  text: string;
  sub: string;
};

export type SorryCard = {
  id: string;
  front: CardFace;
  back: CardBack;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  note: string;
  color: string;
  bar: number;
};

export type LetterParagraph = {
  id: number;
  text: string;
  salutation?: boolean;
  signature?: boolean;
};

export type HeartParticle = {
  id: number;
  x: number;
  y: number;
  dx: number;
};
