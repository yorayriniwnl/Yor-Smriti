import Link from 'next/link';

export default function WhySmritiPage() {
  return (
    <main
      id="main-content"
      className="flex h-dvh w-dvw items-center justify-center overflow-auto px-4 py-8"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <section
        className="w-full max-w-2xl rounded-[2rem] border px-6 py-8 md:px-10"
        style={{
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow:
            '0 36px 74px rgba(0, 0, 0, 0.56), 0 16px 34px rgba(247, 85, 144, 0.22)',
        }}
      >
        <p
          className="mb-2 uppercase tracking-[0.18em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 193, 223, 0.8)',
            fontSize: '0.62rem',
          }}
        >
          explanation
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
          Why Smriti?
        </h1>

        <div
          className="mt-4 space-y-4"
          style={{
            color: 'rgba(255, 210, 230, 0.88)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1.02rem, 2.2vw, 1.2rem)',
            lineHeight: 1.6,
          }}
        >
          <p>Because Smriti means memory, and this whole space is built from our memories.</p>
          <p>
            I named it Smriti because I do not want to run away from what I did. I want to remember,
            accept my mistakes, and explain my heart honestly.
          </p>
          <p>The cards, apology, and letter are my complete answer.</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/landing"
            className="inline-flex items-center justify-center rounded-full px-8 py-3"
            style={{
              background:
                'linear-gradient(90deg, rgba(240, 91, 160, 0.95), rgba(204, 57, 127, 0.95))',
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

          <Link
            href="/hub"
            className="inline-flex items-center justify-center rounded-full border px-6 py-3"
            style={{
              borderColor: 'rgba(244, 173, 210, 0.38)',
              color: 'rgba(255, 214, 234, 0.9)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            More Experiences ✨
          </Link>

          <Link
            href="/message"
            className="inline-flex items-center justify-center rounded-full border px-6 py-3"
            style={{
              borderColor: 'rgba(244, 173, 210, 0.2)',
              color: 'rgba(255, 200, 225, 0.55)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Back
          </Link>
        </div>
      </section>
    </main>
  );
}