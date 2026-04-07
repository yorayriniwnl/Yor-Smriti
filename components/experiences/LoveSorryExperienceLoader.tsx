"use client";

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

import LoadingFallback from '@/components/ui/LoadingFallback';

const LoveSorryExperience = dynamic(
  () => import('@/components/experiences/LoveSorryExperience').then((m) => m.default || m),
  { ssr: false, loading: () => <LoadingFallback /> }
);

export default function LoveSorryExperienceLoader(props: ComponentProps<typeof LoveSorryExperience>) {
  return <LoveSorryExperience {...(props as any)} />;
}
