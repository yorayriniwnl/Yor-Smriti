import { notFound } from 'next/navigation';
import {
  APOLOGY_SCREEN_COMPONENTS,
  APOLOGY_SCREEN_KEYS,
} from '@/components/experiences/panda/screens';

export function generateStaticParams() {
  return APOLOGY_SCREEN_KEYS.map((screen) => ({ screen }));
}

interface PandaScreenPageProps {
  params: Promise<{ screen: string }>;
}

export default async function PandaScreenPage({ params }: PandaScreenPageProps) {
  const { screen } = await params;
  const ScreenComponent = APOLOGY_SCREEN_COMPONENTS[screen];

  if (!ScreenComponent) {
    notFound();
  }

  return <ScreenComponent />;
}
