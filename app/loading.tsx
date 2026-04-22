export default function GlobalLoading() {
  return (
    <div
      className="flex h-dvh w-dvw items-center justify-center"
      style={{ background: '#05030a' }}
      aria-label="Loading…"
      role="status"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Pulsing heart */}
        <svg
          width="48"
          height="44"
          viewBox="0 0 48 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ animation: 'heartbeat 1.4s ease-in-out infinite' }}
        >
          <path
            d="M24 41S3 27 3 14a10 10 0 0 1 21-1 10 10 0 0 1 21 1c0 13-21 27-21 27Z"
            fill="rgba(247,85,144,0.85)"
          />
        </svg>

        <p
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,193,219,0.5)',
          }}
        >
          Loading
        </p>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          14%       { transform: scale(1.18); opacity: 1; }
          28%       { transform: scale(1); opacity: 0.85; }
          42%       { transform: scale(1.12); opacity: 0.95; }
          56%       { transform: scale(1); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
