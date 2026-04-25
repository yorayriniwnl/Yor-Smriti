import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'For Her Alone',
  description: 'This one is just for you.',
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
