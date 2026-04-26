'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// ExperienceController is large (~40KB, 1200+ lines). Dynamic import keeps it
// out of the initial JS bundle — it loads only when the director experience
// route is actually visited.
const ExperienceController = dynamic(
  () => import('@/components/experiences/ExperienceController').then((m) => m.ExperienceController),
  { ssr: false, loading: () => null },
);

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

export interface DirectorExperienceClientProps {
  startParam?: string | null;
  pathParam?: string | null;
  endingParam?: string | null;
  // nameParam / memoryParam / messageParam intentionally removed — personalization
  // is fetched from /api/config server-side. Encoding it in URLs leaks private
  // content into browser history, server logs, and referrer headers.
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
  moodParam,
  modeParam,
  privateParam,
  silentParam,
}: DirectorExperienceClientProps) {
  const searchParams = useSearchParams();

  const queryStartParam = searchParams.get('start');
  const queryPathParam = searchParams.get('path');
  // name / memory / message are no longer read from URL params — see interface comment.
  const queryMoodParam = searchParams.get('mood');
  const queryModeParam = searchParams.get('mode');
  const queryPrivateParam = searchParams.get('private');
  const querySilentParam = searchParams.get('silent');

  const hasPathHint = Boolean(queryPathParam ?? pathParam);

  const resolvedStartParam =
    queryStartParam
    ?? startParam
    ?? (hasPathHint ? '6' : null);

  const resolvedMood = parseMood(queryMoodParam ?? moodParam) ?? 'default';
  const resolvedFlowMode = parseFlowMode(queryModeParam ?? modeParam) ?? 'linear';
  const resolvedPrivateMode = parseBooleanFlag(queryPrivateParam ?? privateParam, true);
  const resolvedSilentMode = parseBooleanFlag(querySilentParam ?? silentParam, false);

  const initialIndex = parseInitialIndex(resolvedStartParam);

  // Personalization is fetched from /api/config, not URL params.
  // This keeps private content (memory, message) out of browser history and logs.
  const [personalization, setPersonalization] = useState<PersonalizationData>(DEFAULT_PERSONALIZATION);
  useEffect(() => {
    fetch('/api/config', { headers: { 'x-yor-csrf': '1' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const p = data?.personalization;
        if (p && typeof p.recipientName === 'string') {
          setPersonalization({
            name:    sanitizePersonalizationValue(p.recipientName, DEFAULT_PERSONALIZATION.name,    32),
            memory:  sanitizePersonalizationValue(p.memory,        DEFAULT_PERSONALIZATION.memory,  80),
            message: sanitizePersonalizationValue(p.message,       DEFAULT_PERSONALIZATION.message, 180),
          });
        }
      })
      .catch(() => { /* keep DEFAULT_PERSONALIZATION on error */ });
  }, []);

  // Fix #22: directorInteractionScreen is now Screen | null (module-level throw
  // was removed). Filter null so a missing screen 85 degrades gracefully.
  const screens: Screen[] = useMemo(
    () => [
      ...directorCoreScreens,
      ...(directorInteractionScreen ? [directorInteractionScreen] : []),
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
      showPauseButton={true}
      shareEnabled={true}
    />
  );
}
