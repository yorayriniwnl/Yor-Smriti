import { LETTER_PAGE_LINE_LOOKUP } from './constants';

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function resolveLetterGhostLines(screen: number): string[] {
  return [screen - 2, screen - 1]
    .map((id) => LETTER_PAGE_LINE_LOOKUP[id])
    .filter((line): line is string => Boolean(line));
}

export function toPublicScreenNumber(legacyScreen: number) {
  return legacyScreen - 79;
}
