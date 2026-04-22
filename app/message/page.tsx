import { Suspense } from 'react';
import DirectorExperienceClientWrapper from '@/components/experiences/director/DirectorExperienceClientWrapper';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Experience',
  description: 'A cinematic experience built from love, regret, and hope.',
  openGraph: {
    title: 'The Experience — Yor Smriti',
    description: 'A cinematic experience built from love, regret, and hope.',
  },
};


interface MessagePageProps {
  searchParams: Promise<{
    start?: string | string[];
    path?: string | string[];
    ending?: string | string[];
    name?: string | string[];
    memory?: string | string[];
    message?: string | string[];
    mood?: string | string[];
    mode?: string | string[];
    private?: string | string[];
    silent?: string | string[];
  }>;
}

function takeFirst(value?: string | string[]): string | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export default async function MessagePage({ searchParams }: MessagePageProps) {
  const params = await searchParams;
  const startParam = takeFirst(params.start) ?? '0';

  return (
    <>
      <CharacterPageOverlayClient />
      <Suspense fallback={null}>
        <DirectorExperienceClientWrapper
          startParam={startParam}
          pathParam={takeFirst(params.path)}
          endingParam={takeFirst(params.ending)}
          nameParam={takeFirst(params.name)}
          memoryParam={takeFirst(params.memory)}
          messageParam={takeFirst(params.message)}
          moodParam={takeFirst(params.mood)}
          modeParam={takeFirst(params.mode)}
          privateParam={takeFirst(params.private)}
          silentParam={takeFirst(params.silent)}
        />
      </Suspense>
    </>
  );
}
