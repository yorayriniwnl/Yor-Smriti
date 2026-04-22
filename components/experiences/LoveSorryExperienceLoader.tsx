"use client";

import dynamic from 'next/dynamic';
import LoadingFallback from '@/components/ui/LoadingFallback';

const LoveSorryExperience = dynamic(
  () => import('@/components/experiences/LoveSorryExperience'),
  { ssr: false, loading: () => <LoadingFallback /> }
);

export default function LoveSorryExperienceLoader() {
  return <LoveSorryExperience />;
}
