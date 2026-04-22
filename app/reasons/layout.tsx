import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why I Love You',
  description: 'Every reason, one at a time.',
  openGraph: {
    title: 'Why I Love You — Yor Smriti',
    description: 'Every reason, one at a time.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
