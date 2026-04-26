'use client';

/**
 * Shown in place of any content page whose data arrays are still bracket
 * placeholders. Gives the recipient a graceful holding screen instead of
 * raw "[SHORT TITLE]" text, and reminds the author what still needs writing.
 */
export function ContentComingSoon({ title }: { title: string }) {
  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center justify-center px-6 text-center"
      style={{ background: '#05030a' }}
    >
      <p
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.18em',
          color: 'rgba(247, 130, 175, 0.38)',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          color: 'rgba(255, 210, 230, 0.45)',
          fontStyle: 'italic',
          lineHeight: 1.7,
          maxWidth: '36ch',
        }}
      >
        this part is still being written.
      </p>
    </div>
  );
}
