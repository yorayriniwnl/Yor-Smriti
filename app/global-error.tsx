'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: '#05030a', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '480px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(255,150,180,0.5)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Critical error
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,226,238,0.94)', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 400, lineHeight: 1.12, marginBottom: '1rem' }}>
            Something went wrong.
          </h1>
          <p style={{ color: 'rgba(255,190,215,0.65)', fontFamily: 'Georgia, serif', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            The experience hit an unexpected error. Refreshing usually fixes this.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                background: 'linear-gradient(90deg,rgba(255,120,165,0.95),rgba(240,70,130,0.95))',
                color: '#fff', border: 'none', borderRadius: '999px',
                padding: '0.75rem 2rem', fontFamily: 'monospace',
                fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/message"
              style={{
                border: '1px solid rgba(244,160,200,0.3)', borderRadius: '999px',
                padding: '0.75rem 1.5rem', fontFamily: 'monospace',
                fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'rgba(255,200,225,0.8)', textDecoration: 'none',
              }}
            >
              Go home
            </a>
          </div>
          {process.env.NODE_ENV !== 'production' && (
            <pre style={{ marginTop: '1.5rem', fontSize: '0.65rem', color: 'rgba(255,140,170,0.5)', textAlign: 'left', overflow: 'auto', fontFamily: 'monospace' }}>
              {error.message}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
