import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Things I Noticed and Never Said',
  description: 'The proof that he was watching. All along.',
  openGraph: {
    title: 'Things I Noticed and Never Said — Yor Smriti',
    description: 'The proof that he was watching. All along.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
