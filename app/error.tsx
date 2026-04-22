'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to console in dev; swap for Sentry/Datadog in prod
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex h-dvh w-dvw items-center justify-center overflow-hidden px-4"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 50% 4%, rgba(255,160,180,0.3) 0%, rgba(80,10,40,0.5) 36%, rgba(12,4,12,0.98) 68%, #05030a 100%)',
      }}
    >
      <section className="w-full max-w-lg text-center">
        <p
          className="mb-3 uppercase tracking-[0.22em]"
          style={{ fontFamily: 'var(--font-dm-mono)', color: 'rgba(255,150,180,0.6)', fontSize: '0.6rem' }}
        >
          Something broke
        </p>

        <h1
          className="mb-4"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255,226,238,0.96)',
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            lineHeight: 1.12,
            fontWeight: 400,
          }}
        >
          An unexpected error occurred.
        </h1>

        <p
          className="mx-auto mb-10 max-w-[40ch]"
          style={{
            color: 'rgba(255,190,215,0.7)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            lineHeight: 1.65,
          }}
        >
          Even carefully built things sometimes break.
          Try refreshing — it usually helps.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full px-8 py-3"
            style={{
              background: 'linear-gradient(90deg, rgba(255,120,165,0.95), rgba(240,70,130,0.95))',
              color: '#fff',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 10px 28px rgba(240,70,130,0.3)',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>

          <a
            href="/message"
            className="inline-flex items-center justify-center rounded-full border px-6 py-3"
            style={{
              borderColor: 'rgba(244,160,200,0.35)',
              color: 'rgba(255,200,225,0.85)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Go home
          </a>
        </div>

        {process.env.NODE_ENV !== 'production' && error.message && (
          <details className="mt-8 rounded-xl border p-4 text-left" style={{ borderColor: 'rgba(244,100,150,0.2)' }}>
            <summary
              className="cursor-pointer select-none"
              style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.65rem', color: 'rgba(255,140,180,0.7)' }}
            >
              Dev details
            </summary>
            <pre
              className="mt-3 overflow-auto text-xs"
              style={{ color: 'rgba(255,160,190,0.65)', fontFamily: 'monospace' }}
            >
              {error.message}
              {error.digest ? `\nDigest: ${error.digest}` : ''}
            </pre>
          </details>
        )}
      </section>
    </main>
  );
}
