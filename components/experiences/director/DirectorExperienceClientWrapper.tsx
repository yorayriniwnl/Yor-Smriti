"use client";

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

const DirectorExperienceClient = dynamic(
  () => import('./DirectorExperienceClient').then((m) => m.DirectorExperienceClient),
  { ssr: false, loading: () => null }
);

export default function DirectorExperienceClientWrapper(props: ComponentProps<typeof DirectorExperienceClient>) {
  return <DirectorExperienceClient {...(props as any)} />;
}
