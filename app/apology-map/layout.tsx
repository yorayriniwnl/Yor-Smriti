import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Where I Went Wrong, In Order',
  description: 'A chronological account. Harder to read. More honest for it.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
