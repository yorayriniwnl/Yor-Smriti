import React from 'react';

import type { SorryCard } from '../types';

interface CardsScreenProps {
  cards: SorryCard[];
  flipped: Record<string, boolean>;
  allFlipped: boolean;
  onFlip: (id: string) => void;
  onContinue: () => void;
}

export function CardsScreen({ cards, flipped, allFlipped, onFlip, onContinue }: CardsScreenProps) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p
          style={{
            color: '#c83c82',
            fontSize: '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: "'Courier New', monospace",
            margin: '0 0 4px',
          }}
        >
          click each card to reveal
        </p>
        <h2 style={{ fontSize: 'clamp(1.3rem,5vw,1.7rem)', color: '#b52a6e', margin: 0 }}>
          Things I Need You to Know
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {cards.map((card, i) => (
          <div key={card.id} className="card-scene" style={{ height: '140px', animationDelay: `${i * 0.12}s` }}>
            <button
              type="button"
              className={`card-inner ${flipped[card.id] ? 'flipped' : ''}`}
              aria-label={
                flipped[card.id]
                  ? `Flip card back: ${card.front.hint}`
                  : `Flip card to reveal message: ${card.front.hint}`
              }
              style={{
                height: '140px',
                width: '100%',
                border: 'none',
                padding: 0,
                background: 'transparent',
              }}
              onClick={() => onFlip(card.id)}
            >
              <div
                className="card-face"
                style={{
                  background: 'linear-gradient(135deg,#fff0f6,#ffe4ef)',
                  border: '1px solid rgba(232,80,154,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '36px' }}>{card.front.emoji}</span>
                <p
                  style={{
                    margin: 0,
                    color: '#888',
                    fontSize: '13px',
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '0.08em',
                  }}
                >
                  {card.front.hint}
                </p>
              </div>
              <div
                className="card-face card-back-face"
                style={{
                  background: 'linear-gradient(135deg,#fff5fa,#ffeaf4)',
                  border: '1.5px solid rgba(232,80,154,0.35)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <p
                  style={{
                    margin: '0 0 8px',
                    fontSize: '15px',
                    lineHeight: 1.55,
                    color: '#7a2255',
                    fontStyle: 'italic',
                  }}
                >
                  {card.back.text}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#c83c82',
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '0.06em',
                  }}
                >
                  {card.back.sub}
                </p>
                <p
                  style={{
                    margin: '10px 0 0',
                    fontSize: '11px',
                    color: '#aaa',
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  Tap to flip back
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {allFlipped && (
        <div
          style={{
            marginTop: '22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeSlideUp 0.6s ease forwards',
          }}
        >
          <p style={{ color: '#c83c82', fontSize: '13px', fontStyle: 'italic', margin: 0 }}>
            There is more I want to say...
          </p>
          <button className="btn-primary" onClick={onContinue} style={{ width: '100%' }}>
            Read my letter →
          </button>
        </div>
      )}
    </div>
  );
}
