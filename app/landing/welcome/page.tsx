'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function sanitizeNextPath(nextValue: string | null): string | null {
  if (!nextValue) return null;
  if (!nextValue.startsWith('/')) return null;
  if (nextValue.startsWith('//')) return null;
  return nextValue;
}

export default function LandingWelcomePage() {
  const searchParams = useSearchParams();

  const nextPath = sanitizeNextPath(searchParams.get('next')) ?? '/message';

  return (
    <main
      id="main-content"
      className="flex h-dvh w-dvw items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 20% 10%, #ffd6e760 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 80%, #ffb3cf40 0%, transparent 60%), var(--bg)',
      }}
    >
      <section
        className="w-full max-w-xl rounded-3xl border px-6 py-10 text-center md:px-10"
        style={{
          background: 'rgba(255, 248, 251, 0.94)',
          borderColor: 'rgba(247, 85, 144, 0.22)',
          boxShadow: '0 28px 56px rgba(247, 85, 144, 0.16)',
        }}
      >
        <p
          className="mb-2 uppercase tracking-[0.18em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.62rem',
          }}
        >
          landing page
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'var(--text-primary)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: 1.14,
            fontWeight: 500,
          }}
        >
          Are you ready for the good part sweety ?
        </h1>

        <p
          className="mx-auto mt-3 max-w-[40ch]"
          style={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1rem, 2.2vw, 1.18rem)',
            lineHeight: 1.58,
          }}
        >
          Tap continue and I will show you all the cards, apology, and everything from my heart.
        </p>

        <div className="mt-7 flex items-center justify-center gap-3">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--accent)' }}
          />
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--accent)', animationDelay: '180ms' }}
          />
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--accent)', animationDelay: '360ms' }}
          />
        </div>

        <Link
          href={nextPath}
          className="mt-8 inline-flex items-center justify-center rounded-full px-8 py-3"
          style={{
            background:
              'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
            color: '#fff',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            boxShadow: '0 10px 28px rgba(247, 85, 144, 0.28)',
          }}
        >
          Continue To The Cards
        </Link>
      </section>
    </main>
  );
}
