import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memory Timeline',
  description: 'Relive the moments that shaped everything.',
  openGraph: {
    title: 'Memory Timeline — Yor Smriti',
    description: 'Relive the moments that shaped everything.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
