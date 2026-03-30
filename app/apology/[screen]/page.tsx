import { notFound } from 'next/navigation';
import { DirectorExperienceClient } from '@/components/experiences/director/DirectorExperienceClient';
import {
  APOLOGY_SCREEN_KEYS,
} from '@/components/experiences/panda/screens';
import { getDirectorRouteConfig } from '@/lib/apologyDirectorRouting';

export function generateStaticParams() {
  return APOLOGY_SCREEN_KEYS.map((screen) => ({ screen }));
}

interface ApologyScreenPageProps {
  params: Promise<{ screen: string }>;
}

export default async function ApologyScreenPage({ params }: ApologyScreenPageProps) {
  const { screen } = await params;
  const routeConfig = getDirectorRouteConfig(screen);

  if (!routeConfig) {
    notFound();
  }

  return (
    <DirectorExperienceClient
      startParam={String(routeConfig.start)}
      endingParam={routeConfig.ending ?? null}
      pathParam={null}
    />
  );
}
