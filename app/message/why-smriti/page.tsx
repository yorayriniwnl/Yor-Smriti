import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A letter for you',
  description: 'Something written just for you.',
  openGraph: {
    title: 'A letter - Yor Smriti',
    description: 'Something written just for you.',
  },
};

const SINCE_DATE = process.env.NEXT_PUBLIC_SINCE_DATE ?? '';

function daysSince(dateStr: string): number | null {
  if (!dateStr) {
    return null;
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export default function LetterPage() {
  const days = daysSince(SINCE_DATE);

  return (
    <main className="min-h-dvh bg-[#05030a] px-6 py-20">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        {days !== null ? (
          <p
            className="mb-14 text-center"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              color: 'rgba(255, 193, 219, 0.38)',
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            day {days}
          </p>
        ) : null}

        <article
          className="w-full rounded-[2.5rem] border px-6 py-8 md:px-10 md:py-10"
          style={{
            borderColor: 'rgba(244, 173, 210, 0.18)',
            background:
              'linear-gradient(180deg, rgba(20, 8, 19, 0.96) 0%, rgba(10, 4, 12, 0.98) 100%)',
            boxShadow:
              '0 34px 84px rgba(0, 0, 0, 0.54), 0 12px 32px rgba(247, 85, 144, 0.12)',
          }}
        >
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              color: 'rgba(255, 193, 223, 0.5)',
              textTransform: 'uppercase',
            }}
          >
            a letter for you
          </p>

          <div
            className="space-y-7"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.05rem, 2.4vw, 1.2rem)',
              fontStyle: 'italic',
              lineHeight: 1.9,
              color: 'rgba(255, 225, 240, 0.88)',
            }}
          >
            <p>
              There are things I have been meaning to say for a long time. Not because I did not
              know them, but because I did not know how to hold them carefully enough to hand them
              to you.
            </p>
            <p>This is me trying. Slowly. With everything I have.</p>
            <p>
              I am not asking you to forgive me right now. I am just asking you to read this - all
              of it - and know that every word was chosen as if your eyes were already on it.
            </p>
            <p>Because they were.</p>
            <p>- always yours</p>
          </div>

          <div
            className="mx-auto my-12 h-px w-12"
            style={{ background: 'rgba(244, 173, 210, 0.18)' }}
            aria-hidden="true"
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/reply"
              className="inline-flex items-center justify-center rounded-full border px-8 py-3"
              style={{
                borderColor: 'rgba(244, 173, 210, 0.28)',
                background: 'rgba(244, 173, 210, 0.05)',
                color: 'rgba(255, 220, 238, 0.9)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                textTransform: 'lowercase',
                textDecoration: 'none',
              }}
            >
              I want to tell you something -&gt;
            </Link>

            <Link
              href="/message"
              className="inline-flex items-center justify-center rounded-full px-6 py-3"
              style={{
                color: 'rgba(255, 193, 219, 0.52)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.66rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Back to the experience
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
