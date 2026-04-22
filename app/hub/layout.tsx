import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Experiences',
  description: 'Every chapter of the story, in one place.',
  openGraph: {
    title: 'All Experiences — Yor Smriti',
    description: 'Every chapter of the story, in one place.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
