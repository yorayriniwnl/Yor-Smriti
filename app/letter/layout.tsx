import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Letter',
  description: 'No animations. No characters. Just his words, waiting.',
  openGraph: {
    title: 'The Letter — Yor Smriti',
    description: 'No animations. No characters. Just his words, waiting.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
