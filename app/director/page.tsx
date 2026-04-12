import { Suspense } from 'react';
import DirectorExperienceClientWrapper from '@/components/experiences/director/DirectorExperienceClientWrapper';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';

interface DirectorPageProps {
  searchParams: Promise<{
    start?: string | string[];
    path?: string | string[];
    ending?: string | string[];
    name?: string | string[];
    memory?: string | string[];
    message?: string | string[];
  }>;
}

function takeFirst(value?: string | string[]): string | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export default async function DirectorPage({ searchParams }: DirectorPageProps) {
  const params = await searchParams;

  return (
    <>
      <CharacterPageOverlayClient />
      <Suspense fallback={null}>
        <DirectorExperienceClientWrapper
          startParam={takeFirst(params.start)}
          pathParam={takeFirst(params.path)}
          endingParam={takeFirst(params.ending)}
          nameParam={takeFirst(params.name)}
          memoryParam={takeFirst(params.memory)}
          messageParam={takeFirst(params.message)}
        />
      </Suspense>
    </>
  );
}
