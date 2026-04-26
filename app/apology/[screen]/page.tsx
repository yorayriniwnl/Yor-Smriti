// app/apology/[screen]/page.tsx
//
// Fix: this route was previously wired to DirectorExperienceClientWrapper which
// renders the director script flow (screens 80–87). The panda screen components
// (Screen01Intro through Screen08ComeBack) were never rendered despite being
// fully built and exported from components/experiences/panda/screens/index.ts.
//
// This file now renders the correct panda screen for each URL segment using the
// APOLOGY_SCREEN_COMPONENTS registry that already exists for this purpose.

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

export default async function ApologyScreenPage({
  params,
}: ApologyScreenPageProps) {
  const { screen } = await params;

  // Guard against manually typed slugs that are not in the registry.
  if (!APOLOGY_SCREEN_KEYS.includes(screen)) {
    notFound();
  }

  const ScreenComponent = APOLOGY_SCREEN_COMPONENTS[screen];

  // Narrowing: TypeScript knows APOLOGY_SCREEN_COMPONENTS[screen] exists after
  // the key check above, but we guard explicitly for runtime safety.
  if (!ScreenComponent) {
    notFound();
  }

  return <ScreenComponent />;
}

