import React from 'react';
import type { MouseEvent } from 'react';

import type { HeartParticle } from '../types';

interface FinalScreenProps {
  hearts: HeartParticle[];
  tapMsg: string;
  onSpawnHearts: (e: MouseEvent<HTMLButtonElement>) => void;
  onRestart: () => void;
  onSendKiss: () => void;
}

export function FinalScreen({ hearts, tapMsg, onSpawnHearts, onRestart, onSendKiss }: FinalScreenProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          background: 'linear-gradient(160deg,#ffd6e8,#ffc4d4)',
          borderRadius: '24px 24px 0 0',
          padding: '14px 20px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0 0 2px', color: '#c83c82', fontWeight: 700, fontSize: '17px' }}>
          Come Back To Me 💕
        </p>
        <p style={{ margin: 0, color: '#d4548a', fontSize: '13px', fontStyle: 'italic' }}>
          No pressure. Just love.
        </p>
      </div>

      <div
        style={{
          background: 'linear-gradient(180deg,#fff9fc,#fff5fa)',
          border: '1px solid rgba(232,80,154,0.15)',
          borderTop: 'none',
          borderRadius: '0 0 24px 24px',
          padding: '28px 20px 22px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
            gap: '10px',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: '52px',
              filter: 'drop-shadow(0 4px 12px rgba(232,80,154,0.25))',
              animation: 'pulse 2.5s ease-in-out infinite',
            }}
          >
            🐱
          </span>
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: 'calc(50% - 60px)',
              fontSize: '18px',
              animation: 'shimmer 1.8s ease-in-out infinite',
            }}
          >
            💕
          </div>
        </div>

        <h2 style={{ fontSize: 'clamp(1.5rem,5vw,2rem)', color: '#b52a6e', margin: '0 0 6px', lineHeight: 1.15 }}>
          I Love You.
          <br />I Am Sorry.
        </h2>
        <p
          style={{
            color: '#4a1e35',
            fontSize: 'clamp(0.95rem,3vw,1.05rem)',
            fontStyle: 'italic',
            lineHeight: 1.65,
            margin: '0 0 10px',
            maxWidth: '320px',
            display: 'inline-block',
          }}
        >
          No pressure. No deadline.
          <br />I am here - whenever you are ready.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', margin: '10px 0 20px', fontSize: '20px' }}>
          {['♡', '♡', '♡', '♡', '♡', '♡', '♡'].map((h, i) => (
            <span
              key={`outline-heart-${i}`}
              style={{
                color: '#f9a8c9',
                animation: 'shimmer 1.8s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {h}
            </span>
          ))}
        </div>

        <p style={{ color: '#7a2255', fontWeight: 600, fontSize: '16px', margin: '0 0 4px' }}>Forever Yours, Ayrin</p>
        <p
          style={{
            color: '#a07080',
            fontSize: '12px',
            fontFamily: "'Courier New', monospace",
            margin: '0 0 22px',
            letterSpacing: '0.05em',
          }}
        >
          Monday, March 30, 2026
        </p>

        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '18px' }}>
          <button
            onClick={onSpawnHearts}
            aria-label="Send love hearts"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,rgba(232,80,154,0.2),rgba(200,60,130,0.15))',
              border: '1.5px solid rgba(232,80,154,0.4)',
              cursor: 'pointer',
              fontSize: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s ease-in-out infinite',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            ♡
            {hearts.map((h) => (
              <span
                key={h.id}
                style={{
                  position: 'absolute',
                  left: `${h.x}px`,
                  top: `${h.y}px`,
                  fontSize: '18px',
                  color: 'rgba(232,80,154,0.85)',
                  pointerEvents: 'none',
                  animation: 'floatUp 1.2s ease-out forwards',
                  transform: `translateX(${h.dx}px)`,
                }}
              >
                ♡
              </span>
            ))}
          </button>
        </div>
        <p
          style={{
            color: '#c83c82',
            fontSize: '12px',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '22px',
          }}
        >
          {tapMsg}
        </p>

        <button className="btn-primary" style={{ width: '100%', marginBottom: '10px' }} onClick={onRestart}>
          Experience Again ✨
        </button>
        <button className="btn-secondary" style={{ width: '100%' }} onClick={onSendKiss}>
          Send a Kiss 💋
        </button>
      </div>
    </div>
  );
}
