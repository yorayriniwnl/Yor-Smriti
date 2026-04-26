import { Suspense } from 'react';
import DirectorExperienceClientWrapper from '@/components/experiences/director/DirectorExperienceClientWrapper';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';

interface DirectorPageProps {
  searchParams: Promise<{
    start?: string | string[];
    path?: string | string[];
    ending?: string | string[];
    // name / memory / message removed — personalization is fetched from /api/config
    // by the client; passing it through URLs leaks private content into browser
    // history, server logs, and referrer headers.
  }>;
}

function takeFirst(value?: string | string[]): string | null {
  if (!value) return null;
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
        />
      </Suspense>
    </>
  );
}
