'use client';

/**
 * ComingSoon — shown when a content page's data array is still all placeholders.
 * Renders in-place so the page chrome (nav, back link, background) is preserved.
 * The author fills in the content and this component disappears automatically.
 */
export function ComingSoon({ label = 'this section' }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6"
      style={{ minHeight: '40vh', gap: '1.25rem' }}
    >
      {/* Hairline accent */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          width: 48,
          background: 'linear-gradient(to right, transparent, rgba(247, 85, 144, 0.4), transparent)',
        }}
      />

      <p
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255, 193, 223, 0.45)',
        }}
      >
        {label}
      </p>

      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          lineHeight: 1.7,
          color: 'rgba(255, 210, 230, 0.35)',
          maxWidth: '32ch',
        }}
      >
        still being written
      </p>

      <div
        aria-hidden="true"
        style={{
          height: 1,
          width: 48,
          background: 'linear-gradient(to right, transparent, rgba(247, 85, 144, 0.4), transparent)',
        }}
      />
    </div>
  );
}
