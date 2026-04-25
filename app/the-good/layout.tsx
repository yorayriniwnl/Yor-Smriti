import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'What Was Actually Good Between Us',
  description: 'No agenda. No segue. Just the good things, held plainly.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
