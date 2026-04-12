import type { Screen, ScreenPacingKind } from '@/hooks/useExperienceFlow';
import type { Emotion } from '@/lib/emotionThemes';
import {
  SCRIPT_NARRATIVE_LINES,
  createScriptNarrativeComponent,
} from '@/components/experiences/director/screens/ScriptNarrativeScreens';
import {
  Screen83WhatIMiss,
  Screen85MyPromises,
  Screen86ALetter,
  Screen87ComeBack,
  Screen84WeightICarry,
} from '@/components/experiences/director/screens/CinematicApologyScreens';

const DIRECTOR_CUSTOM_COMPONENTS: Partial<Record<number, Screen['component']>> = {
  83: Screen83WhatIMiss,
  84: Screen84WeightICarry,
  85: Screen85MyPromises,
  86: Screen86ALetter,
  87: Screen87ComeBack,
};

const DIRECTOR_CUSTOM_EMOTIONS: Partial<Record<number, Emotion>> = {
  83: 'love',
  84: 'regret',
  85: 'hope',
  86: 'love',
  87: 'hope',
};

const DIRECTOR_CUSTOM_KINDS: Partial<Record<number, ScreenPacingKind>> = {
  85: 'normal',
  86: 'normal',
  87: 'normal',
};

const DIRECTOR_CUSTOM_DURATIONS: Partial<Record<number, number>> = {
  83: 0,
  84: 0,
  85: 0,
  86: 0,
  87: 0,
};

const DIRECTOR_CUSTOM_ATTENTION_LOCK_MS: Partial<Record<number, number>> = {
  83: 3000,
  84: 4600,
  85: 1000,
  86: 7200,
  87: 1400,
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveScriptEmotion(screenId: number): Emotion {
  if (screenId <= 82) {
    return 'love';
  }

  if (screenId <= 87) {
    return 'regret';
  }

  if (screenId <= 92) {
    return 'pain';
  }

  if (screenId <= 95) {
    return 'silence';
  }

  if (screenId <= 99) {
    return 'closure';
  }

  if (screenId <= 104) {
    return 'love';
  }

  if (screenId <= 108) {
    return 'regret';
  }

  if (screenId <= 120) {
    return 'pain';
  }

  if (screenId <= 125) {
    return 'closure';
  }

  if (screenId <= 130) {
    return 'hope';
  }

  if (screenId <= 136) {
    return 'closure';
  }

  return 'silence';
}

function resolveScriptKind(screenId: number): ScreenPacingKind {
  if (screenId === 85) {
    return 'flash';
  }

  if (screenId === 110 || screenId === 136) {
    return 'mute';
  }

  if (screenId >= 137) {
    return 'afterglow';
  }

  if (screenId >= 115 && screenId <= 120) {
    return 'peak';
  }

  if (screenId >= 109 && screenId <= 114) {
    return 'frozen';
  }

  if (screenId >= 96 && screenId <= 99) {
    return 'silence';
  }

  if (screenId >= 100 && screenId <= 108) {
    return 'memory-fragment';
  }

  return 'normal';
}

function resolveScriptDuration(screenId: number, line: string): number {
  if (screenId === 138) {
    return 0;
  }

  const baseDuration = 1700 + line.length * 48;

  if (screenId >= 115 && screenId <= 120) {
    return clampNumber(baseDuration + 700, 2800, 4600);
  }

  if (screenId >= 135) {
    return clampNumber(baseDuration + 840, 3000, 5200);
  }

  if (screenId >= 109 && screenId <= 114) {
    return clampNumber(baseDuration + 520, 2600, 4300);
  }

  return clampNumber(baseDuration, 2200, 3900);
}

function resolveAttentionLockMs(screenId: number): number | undefined {
  if (screenId === 110 || screenId === 136) {
    return 1500;
  }

  if (screenId === 137) {
    return 1200;
  }

  if (screenId >= 115 && screenId <= 120) {
    return 900;
  }

  return undefined;
}

function resolveTiming(screenId: number): Screen['timing'] {
  const drift = (screenId - 80) % 6;
  const duration = clampNumber(0.82 + drift * 0.08, 0.72, 1.34);
  const delay = screenId >= 111 ? 0.22 : 0.1;

  return {
    duration,
    delay,
    easing: screenId >= 109 ? 'easeInOut' : 'easeOut',
  };
}

const directorScriptScreens: Screen[] = SCRIPT_NARRATIVE_LINES.map((definition) => ({
  id: definition.id,
  component:
    DIRECTOR_CUSTOM_COMPONENTS[definition.id] ?? createScriptNarrativeComponent(definition),
  emotion: DIRECTOR_CUSTOM_EMOTIONS[definition.id] ?? resolveScriptEmotion(definition.id),
  duration:
    DIRECTOR_CUSTOM_DURATIONS[definition.id]
    ?? resolveScriptDuration(definition.id, definition.line),
  kind: DIRECTOR_CUSTOM_KINDS[definition.id] ?? resolveScriptKind(definition.id),
  attentionLockMs:
    DIRECTOR_CUSTOM_ATTENTION_LOCK_MS[definition.id]
    ?? resolveAttentionLockMs(definition.id),
  timing: resolveTiming(definition.id),
}));

export const directorCoreScreens: Screen[] = directorScriptScreens.filter(
  (screen) => screen.id >= 80 && screen.id <= 84,
);

const interactionScreen = directorScriptScreens.find((screen) => screen.id === 85);

if (!interactionScreen) {
  throw new Error('Missing script interaction screen definition (id 85).');
}

export const directorInteractionScreen: Screen = interactionScreen;

export const directorCinematicScreens: Screen[] = directorScriptScreens.filter(
  (screen) => screen.id >= 86 && screen.id <= 87,
);
