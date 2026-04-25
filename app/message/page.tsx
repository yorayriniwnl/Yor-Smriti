import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A letter for you',
  description: 'Something written just for you.',
  openGraph: {
    title: 'A letter — Yor Smriti',
    description: 'Something written just for you.',
  },
};

const SINCE_DATE = '2025-XX-XX';

function daysSince(dateStr: string): number | null {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export default function MessagePage() {
  const days = daysSince(SINCE_DATE);

  return (
    <>
      <style>{`
        html, body { background: #05030a; margin: 0; }

        .letter-root {
          min-height: 100dvh;
          background: #05030a;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 5rem 1.5rem 6rem;
        }

        .letter-column {
          width: 100%;
          max-width: 640px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .letter-day-counter {
          font-family: var(--font-dm-mono, monospace);
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          color: rgba(255, 193, 219, 0.38);
          margin-bottom: 4.5rem;
          text-align: center;
          user-select: none;
        }

        .letter-body {
          width: 100%;
          font-family: var(--font-crimson, Georgia, serif);
          font-size: clamp(1.05rem, 2.4vw, 1.2rem);
          font-style: italic;
          line-height: 1.9;
          color: rgba(255, 225, 240, 0.88);
          text-align: left;
        }

        .letter-body p {
          margin: 0 0 1.75em;
        }

        .letter-body p:last-child {
          margin-bottom: 0;
        }

        .letter-divider {
          width: 3rem;
          height: 1px;
          background: rgba(244, 173, 210, 0.18);
          margin: 4rem 0;
          align-self: center;
        }

        .letter-cta {
          display: inline-block;
          font-family: var(--font-dm-mono, monospace);
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: lowercase;
          color: rgba(255, 193, 219, 0.6);
          text-decoration: none;
          padding: 0.8rem 2rem;
          border: 1px solid rgba(244, 173, 210, 0.18);
          border-radius: 100px;
          transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
          background: transparent;
        }

        .letter-cta:hover {
          color: rgba(255, 220, 238, 0.9);
          border-color: rgba(244, 173, 210, 0.38);
          background: rgba(244, 173, 210, 0.05);
        }
      `}</style>

      <main className="letter-root">
        <div className="letter-column">

          {days !== null && (
            <p className="letter-day-counter" aria-hidden="true">
              day {days}
            </p>
          )}

          <div className="letter-body">
            {/* ── Replace these paragraphs with the real letter ── */}
            <p>
              There are things I have been meaning to say for a long time. Not because I did not
              know them, but because I did not know how to hold them carefully enough to hand them
              to you.
            </p>
            <p>
              This is me trying. Slowly. With everything I have.
            </p>
            <p>
              I am not asking you to forgive me right now. I am just asking you to read this — all
              of it — and know that every word was chosen as if your eyes were already on it.
            </p>
            <p>
              Because they were.
            </p>
            <p>
              — always yours
            </p>
          </div>

          <div className="letter-divider" aria-hidden="true" />

          <Link href="/reply" className="letter-cta">
            I want to tell you something →
          </Link>

        </div>
      </main>
    </>
  );
}
