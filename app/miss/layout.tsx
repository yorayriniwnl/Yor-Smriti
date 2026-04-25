import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What I Miss About You',
  description: 'Specific. Not sentimental. Just true.',
  openGraph: {
    title: 'What I Miss About You — Yor Smriti',
    description: 'Specific. Not sentimental. Just true.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
