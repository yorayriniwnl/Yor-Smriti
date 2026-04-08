import dynamic from 'next/dynamic';

const AppShell = dynamic(() => import('@/components/layout/AppShell').then((m) => m.AppShell), {
  ssr: false,
  loading: () => <div className="stage-root" aria-hidden />,
});

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main id="main-content">
      <AppShell />
    </main>
  );
}
