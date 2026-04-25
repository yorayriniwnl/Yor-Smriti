'use client';

import Link from 'next/link';
import { ScrollReset } from '@/components/ui/ScrollReset';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useMemo } from 'react';

// ─── Fill in the date you want to count from ────────────────────────────────
// Format: YYYY-MM-DD
const SINCE_DATE = 'YYYY-MM-DD';

function useDayCount(since: string): number | null {
  return useMemo(() => {
    if (!since || since === 'YYYY-MM-DD') return null;
    const start = new Date(since);
    if (isNaN(start.getTime())) return null;
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }, [since]);
}

export default function LetterPage() {
  const dayCount = useDayCount(SINCE_DATE);

  return (
    <main
      id="main-content"
      className="relative flex min-h-dvh w-full flex-col items-center justify-start"
      style={{
        background: '#05030a',
      }}
    >
      <ScrollReset />
      <ReadingProgress />
      <BookmarkButton title="The Letter" />
      {/* Very faint radial gradient — barely visible, just enough depth */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(95, 45, 82, 0.22) 0%, transparent 60%)',
        }}
      />

      {/* Content column */}
      <div
        className="relative z-10 w-full px-6"
        style={{
          maxWidth: 620,
          paddingTop: 'clamp(5rem, 12vh, 9rem)',
          paddingBottom: 'clamp(4rem, 10vh, 8rem)',
        }}
      >
        {/* Day counter — DM Mono, faded pink, 0.6rem */}
        {dayCount !== null && (
          <p
            className="mb-10"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              color: 'rgba(247, 130, 175, 0.58)',
              textTransform: 'lowercase',
            }}
          >
            day {dayCount}
          </p>
        )}

        {dayCount === null && (
          <p
            className="mb-10"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              color: 'rgba(247, 130, 175, 0.38)',
              textTransform: 'lowercase',
            }}
          >
            {/* placeholder — set SINCE_DATE to show day count */}
            day —
          </p>
        )}

        {/* Letter body */}
        <div
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.05rem, 2.2vw, 1.22rem)',
            lineHeight: 1.95,
            color: 'rgba(255, 200, 225, 0.48)',
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          {/* ── Write your letter here ── */}
          <p>
            [Your letter goes here — write it yourself, in your own words]
          </p>
          {/* ───────────────────────────── */}
        </div>

        {/* Closing — faint author line */}
        <p
          className="mt-14"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            color: 'rgba(247, 110, 160, 0.45)',
          }}
        >
          — Ayrin
        </p>

        {/* CTA button — links to /reply */}
        <div className="mt-16">
          <Link
            href="/reply"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.66rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(247, 130, 175, 0.85)',
              border: '1px solid rgba(247, 130, 175, 0.28)',
              borderRadius: '2rem',
              padding: '0.7rem 1.5rem',
              background: 'rgba(255,255,255,0.02)',
              transition: 'color 0.3s ease, border-color 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = 'rgba(247, 130, 175, 1)';
              el.style.borderColor = 'rgba(247, 130, 175, 0.55)';
              el.style.background = 'rgba(247, 130, 175, 0.05)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = 'rgba(247, 130, 175, 0.85)';
              el.style.borderColor = 'rgba(247, 130, 175, 0.28)';
              el.style.background = 'rgba(255,255,255,0.02)';
            }}
          >
            Tell him something →
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/hub"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              color: 'rgba(255, 171, 210, 0.28)',
              textTransform: 'uppercase',
            }}
          >
            ← back
          </Link>
        </div>
      </div>
    </main>
  );
}
