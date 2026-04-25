import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Things You Said That I Still Carry',
  description: 'Proof that he was listening. Every word.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
