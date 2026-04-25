import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Then and Now',
  description: 'The same person. Different choices.',
  openGraph: {
    title: 'Then and Now — Yor Smriti',
    description: 'The same person. Different choices.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
