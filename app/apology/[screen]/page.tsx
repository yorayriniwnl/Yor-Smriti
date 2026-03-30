import { notFound } from 'next/navigation';
import {
  APOLOGY_SCREEN_COMPONENTS,
  APOLOGY_SCREEN_KEYS,
} from '@/components/experiences/panda/screens';

export function generateStaticParams() {
  return APOLOGY_SCREEN_KEYS.map((screen) => ({ screen }));
}

interface ApologyScreenPageProps {
  params: Promise<{ screen: string }>;
}

export default async function ApologyScreenPage({ params }: ApologyScreenPageProps) {
  const { screen } = await params;
  const ScreenComponent = APOLOGY_SCREEN_COMPONENTS[screen];

  if (!ScreenComponent) {
    notFound();
  }

  return <ScreenComponent />;
}
