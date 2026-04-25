import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Three Moments',
  description: 'Three scenes. The kind you keep replaying.',
  openGraph: {
    title: 'Three Moments — Yor Smriti',
    description: 'Three scenes. The kind you keep replaying.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
