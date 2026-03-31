import type { ExperienceFlowMode, Screen } from '@/hooks/useExperienceFlow';

function createSeededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function shuffleBySeed<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  const random = createSeededRandom(seed);

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

export function buildScreenSequence(
  screens: Screen[],
  flowMode: ExperienceFlowMode,
  seed: number,
  replayCount: number,
): Screen[] {
  const hasReplayDistortion = replayCount > 0;
  let workingScreens = screens;

  if (hasReplayDistortion) {
    const hiddenScreenIds = replayCount > 1 ? new Set([94, 103, 108]) : new Set([94, 103]);
    const durationRandom = createSeededRandom(seed + replayCount * 7919);

    workingScreens = screens
      .filter((screen) => !hiddenScreenIds.has(screen.id))
      .map((screen) => {
        if (!screen.duration || screen.duration <= 0 || screen.id < 88 || screen.id > 138) {
          return screen;
        }

        const durationDistortion = 0.9 + durationRandom() * 0.24;
        return {
          ...screen,
          duration: Math.round(screen.duration * durationDistortion),
        };
      });
  }

  if (flowMode !== 'non-linear') {
    return workingScreens;
  }

  const prefix = workingScreens.filter((screen) => screen.id <= 87);
  const memoryBand = workingScreens.filter((screen) => screen.id >= 88 && screen.id <= 105);
  const suffix = workingScreens.filter((screen) => screen.id >= 106);

  if (memoryBand.length <= 1) {
    return workingScreens;
  }

  return [...prefix, ...shuffleBySeed(memoryBand, seed), ...suffix];
}
