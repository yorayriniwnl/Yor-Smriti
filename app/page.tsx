import Link from 'next/link';

// ─── Home Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="flex h-dvh w-dvw items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <section
        className="w-full max-w-2xl rounded-3xl border px-6 py-10 text-center md:px-12"
        style={{
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          borderColor: 'rgba(244, 173, 210, 0.28)',
          boxShadow:
            '0 36px 74px rgba(0, 0, 0, 0.56), 0 16px 34px rgba(247, 85, 144, 0.22)',
        }}
      >
        <p
          className="mb-3 uppercase tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 193, 223, 0.78)',
            fontSize: '0.62rem',
          }}
        >
          relationship repair note
        </p>

        <h1
          className="mb-4"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 236, 246, 0.98)',
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
            color: 'rgba(255, 210, 230, 0.84)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            lineHeight: 1.6,
          }}
        >
          Wana see how much I love you ?
        </p>

        <div className="flex items-center justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full px-9 py-3"
            style={{
              background:
                'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
              color: '#fff',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.76rem',
              letterSpacing: '0.04em',
              boxShadow: '0 10px 28px rgba(247, 85, 144, 0.28)',
            }}
          >
            Are you ready for it baby ?
          </Link>
        </div>
      </section>
    </main>
  );
}
