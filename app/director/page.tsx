import { DirectorExperienceClient } from '@/components/experiences/director/DirectorExperienceClient';

interface DirectorPageProps {
  searchParams: Promise<{
    start?: string | string[];
    path?: string | string[];
    ending?: string | string[];
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
    <DirectorExperienceClient
      startParam={takeFirst(params.start)}
      pathParam={takeFirst(params.path)}
      endingParam={takeFirst(params.ending)}
    />
  );
}
