export type Emotion =
  | 'regret'
  | 'silence'
  | 'pain'
  | 'love'
  | 'hope'
  | 'closure';

export interface EmotionTheme {
  className: string;
  background: string;
  textColor: string;
  accentColor: string;
  glowColor: string;
}

export const emotionThemes: Record<Emotion, EmotionTheme> = {
  regret: {
    className: 'bg-blue-950 text-white',
    background:
      'radial-gradient(ellipse 80% 60% at 50% 8%, rgba(111, 151, 255, 0.3) 0%, rgba(16, 27, 59, 0.92) 46%, #050814 100%)',
    textColor: 'rgba(234, 240, 255, 0.96)',
    accentColor: '#93b4ff',
    glowColor: 'rgba(137, 172, 255, 0.35)',
  },
  silence: {
    className: 'bg-slate-950 text-slate-100',
    background:
      'radial-gradient(ellipse 84% 56% at 50% 4%, rgba(180, 186, 220, 0.16) 0%, rgba(17, 20, 31, 0.94) 42%, #05060a 100%)',
    textColor: 'rgba(234, 236, 246, 0.94)',
    accentColor: '#a8b0d4',
    glowColor: 'rgba(180, 186, 220, 0.26)',
  },
  pain: {
    className: 'bg-black text-red-300',
    background:
      'radial-gradient(ellipse 78% 54% at 50% 6%, rgba(255, 116, 116, 0.2) 0%, rgba(38, 8, 8, 0.92) 44%, #040202 100%)',
    textColor: 'rgba(255, 209, 209, 0.95)',
    accentColor: '#ff8e8e',
    glowColor: 'rgba(255, 116, 116, 0.32)',
  },
  love: {
    className: 'bg-pink-100 text-rose-800',
    background:
      'radial-gradient(ellipse 84% 56% at 50% 4%, rgba(255, 204, 226, 0.66) 0%, rgba(94, 34, 70, 0.62) 34%, rgba(22, 7, 20, 0.96) 68%, #05030a 100%)',
    textColor: 'rgba(255, 233, 245, 0.97)',
    accentColor: '#ff86bd',
    glowColor: 'rgba(255, 136, 197, 0.34)',
  },
  hope: {
    className: 'bg-orange-100 text-yellow-800',
    background:
      'radial-gradient(ellipse 84% 58% at 50% 4%, rgba(255, 219, 164, 0.5) 0%, rgba(102, 64, 21, 0.64) 36%, rgba(24, 13, 8, 0.96) 69%, #060402 100%)',
    textColor: 'rgba(255, 238, 204, 0.96)',
    accentColor: '#ffc06d',
    glowColor: 'rgba(255, 194, 104, 0.34)',
  },
  closure: {
    className: 'bg-neutral-900 text-neutral-100',
    background:
      'radial-gradient(ellipse 84% 56% at 50% 4%, rgba(213, 213, 213, 0.2) 0%, rgba(40, 40, 40, 0.9) 42%, #070707 100%)',
    textColor: 'rgba(241, 241, 241, 0.94)',
    accentColor: '#bfbfbf',
    glowColor: 'rgba(204, 204, 204, 0.3)',
  },
};

export const emotionAutoPauseMs: Record<Emotion, number> = {
  regret: 1200,
  silence: 900,
  pain: 1450,
  love: 700,
  hope: 550,
  closure: 950,
};
