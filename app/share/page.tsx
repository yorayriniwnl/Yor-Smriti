import ShareCard from '@/components/share/ShareCard';

export const metadata = {
  title: 'Share Card',
  description: 'Generate a social-ready share image for your experience.',
};

export default function SharePage() {
  return (
    <main id="main-content" className="p-8 min-h-screen">
      <h1 className="font-display text-3xl mb-4">Share Card Generator</h1>
      <p className="mb-6 text-sm text-muted">Create a downloadable, social-optimized image for sharing.</p>
      <ShareCard />
    </main>
  );
}
