"use client";

import dynamic from 'next/dynamic';
import LoadingFallback from '@/components/ui/LoadingFallback';

// Import the props type directly from the source module to avoid the
// "dynamic component props" widening issue without resorting to `any`.
import type { DirectorExperienceClientProps } from './DirectorExperienceClient';

const DirectorExperienceClient = dynamic(
  () => import('./DirectorExperienceClient').then((m) => m.DirectorExperienceClient),
  { ssr: false, loading: () => <LoadingFallback /> }
);

export default function DirectorExperienceClientWrapper(props: DirectorExperienceClientProps) {
  return <DirectorExperienceClient {...props} />;
}
