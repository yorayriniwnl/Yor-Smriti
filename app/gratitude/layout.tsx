import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What I\'m Grateful For',
  description: 'Not what he lost. What she gave him.',
  openGraph: {
    title: 'What I\'m Grateful For — Yor Smriti',
    description: 'Not what he lost. What she gave him.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
