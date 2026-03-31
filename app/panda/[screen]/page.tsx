import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { DirectorExperienceClient } from '@/components/experiences/director/DirectorExperienceClient';
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
    <Suspense fallback={null}>
      <DirectorExperienceClient
        startParam={String(routeConfig.start)}
        endingParam={routeConfig.ending ?? null}
        pathParam={null}
      />
    </Suspense>
  );
}
