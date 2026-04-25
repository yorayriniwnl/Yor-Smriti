import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'One Day With You',
  description: 'An ordinary day. The ordinariness is the point.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
