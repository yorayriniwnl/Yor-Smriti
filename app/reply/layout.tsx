import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Reply',
  description: 'Send a reply.',
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
