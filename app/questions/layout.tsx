import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Things I Sit With',
  description: 'Not demands. Just things he sits with quietly.',
  openGraph: {
    title: 'Things I Sit With — Yor Smriti',
    description: 'Not demands. Just things he sits with quietly.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
