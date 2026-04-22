import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Promises',
  description: 'Not performance. The part I want to live.',
  openGraph: {
    title: 'My Promises — Yor Smriti',
    description: 'Not performance. The part I want to live.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
