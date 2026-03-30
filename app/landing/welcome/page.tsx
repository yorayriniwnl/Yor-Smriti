import Link from 'next/link';

function sanitizeNextPath(nextValue: string | null): string | null {
  if (!nextValue) return null;
  if (!nextValue.startsWith('/')) return null;
  if (nextValue.startsWith('//')) return null;
  return nextValue;
}

interface LandingWelcomePageProps {
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function LandingWelcomePage({
  searchParams,
}: LandingWelcomePageProps) {
  const params = await searchParams;
  const rawNext = Array.isArray(params.next)
    ? (params.next[0] ?? null)
    : (params.next ?? null);
  const nextPath = sanitizeNextPath(rawNext) ?? '/message';

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
        className="w-full max-w-xl rounded-3xl border px-6 py-10 text-center md:px-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          borderColor: 'rgba(244, 173, 210, 0.28)',
          boxShadow:
            '0 36px 74px rgba(0, 0, 0, 0.56), 0 16px 34px rgba(247, 85, 144, 0.22)',
        }}
      >
        <p
          className="mb-2 uppercase tracking-[0.18em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 193, 223, 0.78)',
            fontSize: '0.62rem',
          }}
        >
          landing page
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 236, 246, 0.98)',
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
            color: 'rgba(255, 210, 230, 0.84)',
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
