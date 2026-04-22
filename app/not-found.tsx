import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found — Yor Smriti',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex h-dvh w-dvw items-center justify-center overflow-hidden px-4"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 50% 4%, rgba(255,200,220,0.4) 0%, rgba(80,20,60,0.5) 36%, rgba(15,5,15,0.98) 68%, #05030a 100%)',
      }}
    >
      <section className="w-full max-w-lg text-center">
        <p
          className="mb-3 uppercase tracking-[0.22em]"
          style={{ fontFamily: 'var(--font-dm-mono)', color: 'rgba(255,180,210,0.6)', fontSize: '0.6rem' }}
        >
          404
        </p>

        <h1
          className="mb-4"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255,232,244,0.96)',
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          This page doesn&apos;t exist.
        </h1>

        <p
          className="mx-auto mb-10 max-w-[38ch]"
          style={{
            color: 'rgba(255,200,225,0.72)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            lineHeight: 1.65,
          }}
        >
          Like some words I never said — this path leads nowhere.
          Let&apos;s take you somewhere that matters.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/message"
            className="inline-flex items-center justify-center rounded-full px-8 py-3"
            style={{
              background: 'linear-gradient(90deg, rgba(255,133,179,0.95), rgba(247,85,144,0.95))',
              color: '#fff',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 10px 28px rgba(247,85,144,0.3)',
            }}
          >
            Go to the experience
          </Link>

          <Link
            href="/hub"
            className="inline-flex items-center justify-center rounded-full border px-6 py-3"
            style={{
              borderColor: 'rgba(244,173,210,0.35)',
              color: 'rgba(255,210,232,0.85)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            All experiences
          </Link>
        </div>
      </section>
    </main>
  );
}
