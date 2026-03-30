import Link from 'next/link';
import { APOLOGY_SCREEN_METADATA } from '@/components/experiences/panda/screens';

export default function PandaIndexPage() {
  return (
    <main
      id="main-content"
      className="flex h-dvh w-dvw items-center justify-center overflow-auto px-4 py-8"
      style={{
        background:
          'radial-gradient(ellipse 64% 52% at 18% 14%, rgba(254, 163, 205, 0.24) 0%, transparent 62%), radial-gradient(ellipse 58% 46% at 84% 86%, rgba(255, 227, 164, 0.17) 0%, transparent 66%), #060308',
      }}
    >
      <section
        className="w-full max-w-3xl rounded-[2rem] border px-5 py-6 sm:px-8 sm:py-8"
        style={{
          borderColor: 'rgba(247, 201, 226, 0.36)',
          background:
            'linear-gradient(180deg, rgba(36, 18, 33, 0.9) 0%, rgba(18, 8, 16, 0.93) 100%)',
          boxShadow: '0 40px 78px rgba(0, 0, 0, 0.52)',
        }}
      >
        <p
          className="uppercase tracking-[0.14em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 219, 238, 0.7)',
            fontSize: '0.64rem',
          }}
        >
          Apology Sequence
        </p>

        <h1
          className="mt-2"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 237, 245, 0.96)',
            fontSize: 'clamp(1.9rem, 4.2vw, 2.9rem)',
            lineHeight: 1.1,
            fontWeight: 600,
          }}
        >
          Love and Sorry Screens
        </h1>

        <p
          className="mt-2 max-w-[46ch]"
          style={{
            color: 'rgba(255, 203, 227, 0.86)',
            fontFamily: 'var(--font-crimson)',
            fontSize: '1.04rem',
            lineHeight: 1.45,
          }}
        >
          Each page mirrors a reference screenshot for an emotionally intentional apology story.
        </p>

        <div className="mt-6 grid gap-4">
          {APOLOGY_SCREEN_METADATA.map((item) => (
            <Link
              key={item.screen}
              href={`/apology/${item.screen}`}
              className="group rounded-2xl border px-5 py-4 transition-colors"
              style={{
                borderColor: 'rgba(247, 201, 226, 0.36)',
                background: 'rgba(255, 168, 213, 0.08)',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p
                    className="uppercase tracking-[0.12em]"
                    style={{
                      fontFamily: 'var(--font-dm-mono)',
                      color: 'rgba(255, 222, 239, 0.72)',
                      fontSize: '0.62rem',
                    }}
                  >
                    Screen {item.screen}
                  </p>
                  <h2
                    className="mt-1"
                    style={{
                      color: 'rgba(255, 240, 247, 0.94)',
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.55rem',
                      lineHeight: 1.1,
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    className="mt-1"
                    style={{
                      color: 'rgba(255, 200, 223, 0.88)',
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '0.98rem',
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <span
                  className="rounded-full border px-4 py-2"
                  style={{
                    borderColor: 'rgba(247, 201, 226, 0.42)',
                    color: 'rgba(255, 236, 246, 0.9)',
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Open
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="rounded-full border px-4 py-2"
            style={{
              borderColor: 'rgba(247, 201, 226, 0.36)',
              color: 'rgba(255, 220, 239, 0.86)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.64rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Back Home
          </Link>

          <Link
            href="/landing"
            className="rounded-full px-5 py-2"
            style={{
              background:
                'linear-gradient(90deg, rgba(255, 93, 166, 0.98), rgba(244, 53, 139, 0.98))',
              color: '#fff',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.64rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Open Main Experience
          </Link>
        </div>
      </section>
    </main>
  );
}


