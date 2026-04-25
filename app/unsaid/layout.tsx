import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Things I Never Said',
  description: 'The things that stayed in his throat. All of them, finally out.',
  openGraph: {
    title: 'Things I Never Said — Yor Smriti',
    description: 'The things that stayed in his throat. All of them, finally out.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
