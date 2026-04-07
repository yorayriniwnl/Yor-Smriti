"use client";

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

const LoveSorryExperience = dynamic(
  () => import('@/components/experiences/LoveSorryExperience').then((m) => m.default || m),
  { ssr: false, loading: () => null }
);

export default function LoveSorryExperienceLoader(props: ComponentProps<typeof LoveSorryExperience>) {
  return <LoveSorryExperience {...(props as any)} />;
}
