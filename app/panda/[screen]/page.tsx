import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import DirectorExperienceClientWrapper from '@/components/experiences/director/DirectorExperienceClientWrapper';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';
import { getDirectorRouteConfig } from '@/lib/apologyDirectorRouting';
import { PANDA_SCREEN_IDS } from '@/lib/pandaScreenRegistry';

export function generateStaticParams() {
  return PANDA_SCREEN_IDS.map((screen) => ({ screen }));
}

interface PandaScreenPageProps {
  params: Promise<{ screen: string }>;
}

export default async function PandaScreenPage({
  params,
}: PandaScreenPageProps) {
  const { screen } = await params;
  const routeConfig = getDirectorRouteConfig(screen);

  if (!routeConfig) {
    notFound();
  }

  return (
    <>
      <CharacterPageOverlayClient />
      <Suspense fallback={null}>
        <DirectorExperienceClientWrapper
          startParam={String(routeConfig.start)}
          endingParam={routeConfig.ending ?? null}
          pathParam={null}
        />
      </Suspense>
    </>
  );
}
