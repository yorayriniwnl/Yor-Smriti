'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExperienceController } from '@/components/experiences/ExperienceController';
import {
  DEFAULT_PERSONALIZATION,
  type ExperienceFlowMode,
  type ExperienceMood,
  type PersonalizationData,
  type Screen,
} from '@/hooks/useExperienceFlow';
import {
  directorCinematicScreens,
  directorCoreScreens,
  directorInteractionScreen,
} from '@/lib/experienceScreens';

interface DirectorExperienceClientProps {
  startParam?: string | null;
  pathParam?: string | null;
  endingParam?: string | null;
  nameParam?: string | null;
  memoryParam?: string | null;
  messageParam?: string | null;
  moodParam?: string | null;
  modeParam?: string | null;
  privateParam?: string | null;
  silentParam?: string | null;
}

function parseInitialIndex(value: string | null | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.max(0, Math.floor(parsed));
}

function sanitizePersonalizationValue(
  value: string | null | undefined,
  fallback: string,
  maxLength: number,
): string {
  if (!value) {
    return fallback;
  }

  const normalized = value
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);

  return normalized.length > 0 ? normalized : fallback;
}

function parseMood(value: string | null | undefined): ExperienceMood | undefined {
  if (value === 'dark' || value === 'hopeful' || value === 'minimal' || value === 'default') {
    return value;
  }

  return undefined;
}

function parseFlowMode(value: string | null | undefined): ExperienceFlowMode | undefined {
  if (value === 'non-linear' || value === 'linear') {
    return value;
  }

  return undefined;
}

function parseBooleanFlag(
  value: string | null | undefined,
  defaultValue: boolean,
): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on') {
    return true;
  }

  if (normalized === '0' || normalized === 'false' || normalized === 'no' || normalized === 'off') {
    return false;
  }

  return defaultValue;
}

export function DirectorExperienceClient({
  startParam,
  pathParam,
  endingParam: _endingParam,
  nameParam,
  memoryParam,
  messageParam,
  moodParam,
  modeParam,
  privateParam,
  silentParam,
}: DirectorExperienceClientProps) {
  const searchParams = useSearchParams();

  const queryStartParam = searchParams.get('start');
  const queryPathParam = searchParams.get('path');
  const queryNameParam = searchParams.get('name');
  const queryMemoryParam = searchParams.get('memory');
  const queryMessageParam = searchParams.get('message');
  const queryMoodParam = searchParams.get('mood');
  const queryModeParam = searchParams.get('mode');
  const queryPrivateParam = searchParams.get('private');
  const querySilentParam = searchParams.get('silent');

  const hasPathHint = Boolean(queryPathParam ?? pathParam);

  const resolvedStartParam =
    queryStartParam
    ?? startParam
    ?? (hasPathHint ? '6' : null);

  const resolvedNameParam = queryNameParam ?? nameParam;
  const resolvedMemoryParam = queryMemoryParam ?? memoryParam;
  const resolvedMessageParam = queryMessageParam ?? messageParam;
  const resolvedMood = parseMood(queryMoodParam ?? moodParam) ?? 'default';
  const resolvedFlowMode = parseFlowMode(queryModeParam ?? modeParam) ?? 'linear';
  const resolvedPrivateMode = parseBooleanFlag(queryPrivateParam ?? privateParam, true);
  const resolvedSilentMode = parseBooleanFlag(querySilentParam ?? silentParam, false);

  const initialIndex = parseInitialIndex(resolvedStartParam);

  const personalization: PersonalizationData = useMemo(
    () => ({
      name: sanitizePersonalizationValue(resolvedNameParam, DEFAULT_PERSONALIZATION.name, 32),
      memory: sanitizePersonalizationValue(resolvedMemoryParam, DEFAULT_PERSONALIZATION.memory, 80),
      message: sanitizePersonalizationValue(resolvedMessageParam, DEFAULT_PERSONALIZATION.message, 180),
    }),
    [resolvedMemoryParam, resolvedMessageParam, resolvedNameParam],
  );

  const screens: Screen[] = useMemo(
    () => [
      ...directorCoreScreens,
      directorInteractionScreen,
      ...directorCinematicScreens,
    ],
    [],
  );

  return (
    <ExperienceController
      screens={screens}
      autoAdvance={true}
      allowTapToContinue={true}
      pauseByEmotion={true}
      persistKey="yor-smriti-director-progress"
      initialIndex={initialIndex}
      personalization={personalization}
      initialMood={resolvedMood}
      initialFlowMode={resolvedFlowMode}
      initialPrivateMode={resolvedPrivateMode}
      initialSilentMode={resolvedSilentMode}
      showControls={false}
      shareEnabled={true}
    />
  );
}
