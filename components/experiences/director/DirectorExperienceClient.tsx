'use client';

import { useMemo, useState } from 'react';
import { ExperienceController } from '@/components/experiences/ExperienceController';
import { InteractionLayerScreen } from '@/components/experiences/director/screens/InteractionLayerScreen';
import type { Screen } from '@/hooks/useExperienceFlow';
import { resolveEndingFromEmotionPath, type EndingVariant } from '@/lib/experienceEndings';
import type { Emotion } from '@/lib/emotionThemes';
import {
  directorCoreScreens,
  directorEndingScreens,
  directorInteractionScreen,
} from '@/lib/experienceScreens';

interface DirectorExperienceClientProps {
  startParam?: string | null;
  pathParam?: string | null;
  endingParam?: string | null;
}

const allowedEmotions: Emotion[] = [
  'regret',
  'silence',
  'pain',
  'love',
  'hope',
  'closure',
];

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

function parseEmotionPath(value: string | null | undefined): Emotion[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is Emotion => allowedEmotions.includes(item as Emotion));
}

function parseEnding(value: string | null | undefined): EndingVariant | null {
  if (value === 'hopeful' || value === 'closure' || value === 'goodbye') {
    return value;
  }

  return null;
}

export function DirectorExperienceClient({
  startParam,
  pathParam,
  endingParam,
}: DirectorExperienceClientProps) {
  const initialIndex = parseInitialIndex(startParam);
  const initialPath = parseEmotionPath(pathParam);
  const initialEnding =
    parseEnding(endingParam) ??
    resolveEndingFromEmotionPath(initialPath);

  const [selectedEnding, setSelectedEnding] = useState<EndingVariant>(initialEnding);

  const screens: Screen[] = useMemo(() => {
    const interactionWrapped: Screen['component'] = (props) => (
      <InteractionLayerScreen
        {...props}
        onResolveEnding={setSelectedEnding}
      />
    );

    return [
      ...directorCoreScreens,
      {
        ...directorInteractionScreen,
        component: interactionWrapped,
      },
      directorEndingScreens[selectedEnding],
    ];
  }, [selectedEnding]);

  return (
    <ExperienceController
      screens={screens}
      autoAdvance={true}
      allowTapToContinue={true}
      pauseByEmotion={true}
      persistKey="yor-smriti-director-progress"
      initialIndex={initialIndex}
      showControls={true}
      shareEnabled={true}
    />
  );
}
