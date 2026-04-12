'use client';

type Paragraph = { id: number; salutation?: boolean; signature?: boolean; text: string };

type Props = {
  paragraphs: Paragraph[];
  letterLines: number;
  sealed: boolean;
  sealAnim: boolean;
  onSeal: () => void;
  onExperienceAgain: () => void;
};

export default function LetterScreen({ paragraphs, letterLines, sealed, sealAnim, onSeal, onExperienceAgain }: Props) {
  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(170deg,#ffd6e7,#ffc0d4)',
          borderRadius: '24px 24px 0 0',
          padding: '14px 20px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0 0 2px', color: '#c83c82', fontWeight: 700, fontSize: '17px', letterSpacing: '0.01em' }}>
          A Letter, Sealed with Love 💝
        </p>
        <p style={{ margin: 0, color: '#d4548a', fontSize: '13px', fontStyle: 'italic' }}>
          A message written from the heart
        </p>
      </div>

      <div
        style={{
          background: '#fff9fc',
          border: '1px solid rgba(232,80,154,0.15)',
          borderTop: 'none',
          borderRadius: '0 0 24px 24px',
          padding: '22px 20px 18px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={`line-${i}`}
            style={{
              position: 'absolute',
              left: '20px',
              right: '20px',
              top: `${50 + i * 38}px`,
              height: '1px',
              background: 'rgba(232,80,154,0.06)',
            }}
          />
        ))}

        <div style={{ position: 'absolute', top: '10px', right: '14px', fontSize: '32px', opacity: 0.85 }}>🐱</div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginBottom: '22px',
          }}
        >
          {paragraphs.map(
            (para, i) =>
              letterLines > i && (
                <p
                  key={para.id}
                  style={{
                    margin: 0,
                    fontSize: para.salutation ? '1.25rem' : para.signature ? '1rem' : '0.95rem',
                    lineHeight: 1.65,
                    fontStyle: 'italic',
                    color: para.salutation ? '#b52a6e' : para.signature ? '#c83c82' : '#4a1e35',
                    fontWeight: para.salutation ? 700 : 400,
                    whiteSpace: 'pre-line',
                    animation: 'fadeSlideUp 0.8s ease forwards',
                  }}
                >
                  {para.text}
                </p>
              ),
          )}
        </div>

        {letterLines >= paragraphs.length && !sealed && (
          <div style={{ animation: 'fadeSlideUp 0.6s ease forwards' }}>
            <p
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#a0697e',
                marginBottom: '14px',
                fontFamily: "'Courier New', monospace",
              }}
            >
              Sealing will complete your experience.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={onSeal} disabled={sealAnim}>
                {sealAnim ? 'Sealing...' : 'Seal The Letter 💌'}
              </button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={onExperienceAgain}>
                Experience Again
              </button>
            </div>
          </div>
        )}

        {sealAnim && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,240,248,0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '24px',
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: '52px', animation: 'sealSpin 0.7s cubic-bezier(.4,0,.2,1) forwards' }}>💌</div>
            <p
              style={{
                color: '#c83c82',
                fontFamily: "'Courier New', monospace",
                fontSize: '14px',
                marginTop: '14px',
                letterSpacing: '0.08em',
              }}
            >
              Sealing your love letter...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
