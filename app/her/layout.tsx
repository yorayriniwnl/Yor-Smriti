import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Who She Is',
  description: 'Not about what I lost. Entirely about her.',
  openGraph: {
    title: 'Who She Is — Yor Smriti',
    description: 'Not about what I lost. Entirely about her.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
