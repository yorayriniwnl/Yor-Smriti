import Link from 'next/link';

// ─── Home Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
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
        className="w-full max-w-2xl rounded-3xl border px-6 py-10 text-center md:px-12"
        style={{
          background: 'rgba(255, 248, 251, 0.9)',
          borderColor: 'rgba(247, 85, 144, 0.25)',
          boxShadow: '0 28px 56px rgba(247, 85, 144, 0.16)',
        }}
      >
        <p
          className="mb-3 uppercase tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.62rem',
          }}
        >
          relationship repair note
        </p>

        <h1
          className="mb-4"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'var(--text-primary)',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            lineHeight: 1.12,
            fontWeight: 400,
          }}
        >
          Anya are you mad at Ayrin ?
        </h1>

        <p
          className="mx-auto mb-8 max-w-[46ch]"
          style={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            lineHeight: 1.6,
          }}
        >
          Wana see how much I love you ?
        </p>

        <Link
          href="/landing"
          className="inline-flex items-center justify-center rounded-full px-8 py-3"
          style={{
            background:
              'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
            color: '#fff',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.74rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            boxShadow: '0 10px 28px rgba(247, 85, 144, 0.28)',
          }}
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}
