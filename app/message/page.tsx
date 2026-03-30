import Link from 'next/link';

export default function MessagePage() {
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
        className="w-full max-w-xl rounded-3xl border px-6 py-10 md:px-10"
        style={{
          background: 'rgba(255, 248, 251, 0.94)',
          borderColor: 'rgba(247, 85, 144, 0.22)',
          boxShadow: '0 28px 56px rgba(247, 85, 144, 0.16)',
        }}
      >
        <p
          className="mb-5 uppercase tracking-[0.18em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.62rem',
          }}
        >
          message
        </p>

        <div
          className="space-y-5"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1.05rem, 2.6vw, 1.34rem)',
            lineHeight: 1.58,
          }}
        >
          <p>I know things haven&apos;t been right.</p>
          <p>And I don&apos;t want to pretend it&apos;s okay.</p>
          <p>So I made something instead of just texting.</p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border px-6 py-3"
            style={{
              borderColor: 'rgba(247, 85, 144, 0.28)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Back
          </Link>

          <Link
            href="/apology/80"
            className="inline-flex items-center justify-center rounded-full px-7 py-3"
            style={{
              background:
                'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
              color: '#fff',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 10px 28px rgba(247, 85, 144, 0.28)',
            }}
          >
            Continue
          </Link>
        </div>
      </section>
    </main>
  );
}
