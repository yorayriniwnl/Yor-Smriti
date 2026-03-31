export const STORY_BEAT_ORDER = [
  'build-up',
  'tension',
  'silence',
  'peak',
  'release',
] as const;

export type StoryBeat = (typeof STORY_BEAT_ORDER)[number];
