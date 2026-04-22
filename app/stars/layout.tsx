import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Constellation',
  description: 'Every star holds a memory.',
  openGraph: {
    title: 'Our Constellation — Yor Smriti',
    description: 'Every star holds a memory.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
