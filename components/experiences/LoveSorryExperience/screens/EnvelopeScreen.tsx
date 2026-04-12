import React from 'react';

interface EnvelopeScreenProps {
  envelopeOpen: boolean;
  onOpen: () => void;
}

export function EnvelopeScreen({ envelopeOpen, onOpen }: EnvelopeScreenProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p
        style={{
          color: '#c83c82',
          fontSize: '13px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '6px',
          fontFamily: "'Courier New', monospace",
        }}
      >
        From my heart to yours
      </p>
      <h2
        style={{
          fontSize: 'clamp(1.4rem,5vw,1.8rem)',
          color: '#b52a6e',
          margin: '0 0 32px',
          fontWeight: 700,
        }}
      >
        I have something to tell you
      </h2>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open envelope"
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          position: 'relative',
          userSelect: 'none',
          border: 'none',
          padding: 0,
          background: 'transparent',
        }}
      >
        <div
          style={{
            width: '280px',
            height: '190px',
            background: 'linear-gradient(170deg,#ffd6e8,#ffc0d6)',
            borderRadius: '18px',
            position: 'relative',
            boxShadow: '0 12px 40px rgba(232,80,154,0.2)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 0,
              height: 0,
              borderLeft: '140px solid transparent',
              borderRight: '140px solid transparent',
              borderBottom: '100px solid rgba(255,182,210,0.7)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              borderLeft: '140px solid rgba(255,192,214,0.8)',
              borderTop: '95px solid transparent',
              borderBottom: '95px solid transparent',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderRight: '140px solid rgba(255,192,214,0.8)',
              borderTop: '95px solid transparent',
              borderBottom: '95px solid transparent',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#e8509a,#c83c82)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 6px 18px rgba(232,80,154,0.45)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            💌
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 0,
              borderLeft: '140px solid transparent',
              borderRight: '140px solid transparent',
              borderTop: `95px solid ${envelopeOpen ? 'rgba(255,182,210,0)' : 'rgba(255,182,210,0.95)'}`,
              transformOrigin: 'top center',
              transition: 'border-top-color 0.4s, transform 0.7s',
              transform: envelopeOpen ? 'rotateX(-180deg)' : 'none',
            }}
          />
        </div>

        {[{ top: '-10px', right: '-10px' }, { bottom: '20px', left: '-14px' }].map((pos, i) => (
          <div
            key={`heart-${i}`}
            style={{
              position: 'absolute',
              ...pos,
              fontSize: '18px',
              animation: 'shimmer 2.4s ease-in-out infinite',
              animationDelay: `${i * 0.6}s`,
            }}
          >
            💕
          </div>
        ))}
      </button>
      <p style={{ color: '#d4548a', fontSize: '14px', marginTop: '20px', fontStyle: 'italic' }}>
        Click to open your surprise
      </p>
    </div>
  );
}
