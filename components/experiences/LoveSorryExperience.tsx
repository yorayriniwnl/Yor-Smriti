'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { MouseEvent } from 'react';

const SCREENS = ['envelope', 'cards', 'letter', 'sealing', 'playlist', 'final'] as const;

const SORRY_CARDS = [
  {
    id: 'c1',
    front: { emoji: '💔', title: 'Card 1', hint: 'Tap to open' },
    back: {
      text: 'I chose my ego over you. That was the biggest mistake I have ever made.',
      sub: 'I am truly, deeply sorry.',
    },
  },
  {
    id: 'c2',
    front: { emoji: '🌙', title: 'Card 2', hint: 'Tap to open' },
    back: {
      text: 'I made you feel like you were too much. You were never too much. I was just not enough.',
      sub: 'You deserved better than that.',
    },
  },
  {
    id: 'c3',
    front: { emoji: '✨', title: 'Card 3', hint: 'Tap to open' },
    back: {
      text: 'I still think about you every single day. That never stopped.',
      sub: 'It probably never will.',
    },
  },
];

const SONGS = [
  {
    id: 's1',
    title: 'Tere Liye',
    artist: 'Atif Aslam',
    note: 'Because this is what I feel 💭',
    color: '#f472b6',
    bar: 0.38,
  },
  {
    id: 's2',
    title: 'Pehli Nazar Mein',
    artist: 'Atif Aslam',
    note: 'The way I still see you 🌸',
    color: '#fb7185',
    bar: 0.61,
  },
  {
    id: 's3',
    title: 'Raabta',
    artist: 'Arijit Singh',
    note: 'We are connected, always 🔗',
    color: '#c084fc',
    bar: 0.5,
  },
];

const LETTER_PARAGRAPHS = [
  { id: 0, salutation: true, text: 'My dearest,' },
  {
    id: 1,
    text: "I don't know if you'll read this. But I needed to write it. For you, and honestly - for me.",
  },
  {
    id: 2,
    text: 'I hurt you. Not by accident. I made choices that pushed you away, and I watched it happen without doing enough to stop it. That is something I carry every day.',
  },
  {
    id: 3,
    text: 'I love you. Still. Quietly. Without conditions or deadlines. And I am deeply, genuinely sorry.',
  },
  {
    id: 4,
    signature: true,
    text: 'Yours, always -\nAyrin',
  },
];

type ScreenKey = (typeof SCREENS)[number];

type HeartParticle = {
  id: number;
  x: number;
  y: number;
  dx: number;
};

export default function LoveSorryExperience() {
  const [screen, setScreen] = useState<ScreenKey>('envelope');
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [allFlipped, setAllFlipped] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [sealAnim, setSealAnim] = useState(false);
  const [activeSong, setActiveSong] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [letterLines, setLetterLines] = useState(0);
  const heartIdRef = useRef(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (screen === 'letter') {
      setLetterLines(0);
      const timers: ReturnType<typeof setTimeout>[] = [];
      LETTER_PARAGRAPHS.forEach((_, i) => {
        timers.push(setTimeout(() => setLetterLines((p) => p + 1), 600 + i * 1400));
      });
      return () => timers.forEach(clearTimeout);
    }
  }, [screen]);

  useEffect(() => {
    const count = Object.values(flipped).filter(Boolean).length;
    setAllFlipped(count === SORRY_CARDS.length);
  }, [flipped]);

  useEffect(() => {
    if (playing) {
      progressRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false);
            return 0;
          }
          return p + 0.4;
        });
      }, 80);
    } else if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [playing]);

  const toggleFlip = (id: string) => setFlipped((f) => ({ ...f, [id]: !f[id] }));

  const handleSeal = () => {
    setSealAnim(true);
    setTimeout(() => {
      setSealed(true);
      setSealAnim(false);
      setScreen('playlist');
    }, 2200);
  };

  const spawnHearts = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - btn.left;
    const cy = e.clientY - btn.top;
    const newH = Array.from({ length: 5 }, () => ({
      id: ++heartIdRef.current,
      x: cx + (Math.random() - 0.5) * 50,
      y: cy,
      dx: (Math.random() - 0.5) * 40,
    }));
    setHearts((h) => [...h, ...newH]);
    setTapCount((t) => t + 1);
    setTimeout(
      () => setHearts((h) => h.filter((hh) => !newH.find((n) => n.id === hh.id))),
      1200,
    );
  }, []);

  const tapMsg =
    tapCount === 0
      ? 'Tap to send love'
      : tapCount < 3
        ? 'Keep going...'
        : tapCount < 7
          ? 'I feel it ♡'
          : 'Thank you. For everything.';

  const currentScreenIndex = Math.max(0, SCREENS.indexOf(screen));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg,#fff5f8 0%,#fde8f0 50%,#fdf0fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Georgia', serif",
        padding: '24px 16px',
      }}
    >
      <style>{`
        @keyframes floatUp { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-70px) scale(0.6)} }
        @keyframes popIn { 0%{opacity:0;transform:scale(0.85) translateY(10px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeSlideUp { 0%{opacity:0;transform:translateY(18px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes sealSpin { 0%{transform:scale(0) rotate(-20deg)} 60%{transform:scale(1.15) rotate(5deg)} 100%{transform:scale(1) rotate(0deg)} }
        @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .card-scene { perspective:900px; }
        .card-inner { position:relative; width:100%; transform-style:preserve-3d; transition:transform 0.55s cubic-bezier(.4,0,.2,1); }
        .card-inner.flipped { transform:rotateY(180deg); }
        .card-face { position:absolute; width:100%; height:100%; backface-visibility:hidden; border-radius:20px; }
        .card-back-face { transform:rotateY(180deg); }
        .btn-primary { background:linear-gradient(90deg,#e8509a,#c83c82); color:#fff; border:none; border-radius:50px; padding:14px 32px; font-size:15px; font-family:'Georgia',serif; cursor:pointer; font-weight:600; letter-spacing:0.03em; transition:transform 0.15s,box-shadow 0.15s; box-shadow:0 8px 24px rgba(232,80,154,0.35); }
        .btn-primary:hover { transform:translateY(-1px); box-shadow:0 12px 28px rgba(232,80,154,0.4); }
        .btn-primary:active { transform:scale(0.97); }
        .btn-secondary { background:linear-gradient(90deg,#5ecb8a,#3aaa6e); color:#fff; border:none; border-radius:50px; padding:14px 32px; font-size:15px; font-family:'Georgia',serif; cursor:pointer; font-weight:600; letter-spacing:0.03em; transition:transform 0.15s; box-shadow:0 8px 24px rgba(58,170,110,0.3); }
        .btn-secondary:hover { transform:translateY(-1px); }
        .screen-enter { animation:popIn 0.55s cubic-bezier(.4,0,.2,1) forwards; }
        .progress-bar { height:5px; background:linear-gradient(90deg,#f472b6,#fb7185); border-radius:10px; transition:width 0.08s linear; }
      `}</style>

      <div className="screen-enter" style={{ width: '100%', maxWidth: '420px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '4px',
            marginBottom: '14px',
          }}
        >
          {SCREENS.map((item, idx) => (
            <div
              key={item}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '999px',
                background:
                  idx <= currentScreenIndex ? 'rgba(200, 60, 130, 0.75)' : 'rgba(200, 60, 130, 0.2)',
                transition: 'background 0.25s ease',
              }}
            />
          ))}
        </div>

        {/* SCREEN 1: ENVELOPE */}
        {screen === 'envelope' && (
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

            <div
              onClick={() => {
                setEnvelopeOpen(true);
                setTimeout(() => setScreen('cards'), 900);
              }}
              style={{ cursor: 'pointer', display: 'inline-block', position: 'relative', userSelect: 'none' }}
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
            </div>
            <p style={{ color: '#d4548a', fontSize: '14px', marginTop: '20px', fontStyle: 'italic' }}>
              Click to open your surprise
            </p>
          </div>
        )}

        {/* SCREEN 2: FLIP CARDS */}
        {screen === 'cards' && (
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
              {SORRY_CARDS.map((card, i) => (
                <div key={card.id} className="card-scene" style={{ height: '140px', animationDelay: `${i * 0.12}s` }}>
                  <div
                    className={`card-inner ${flipped[card.id] ? 'flipped' : ''}`}
                    style={{ height: '140px' }}
                    onClick={() => toggleFlip(card.id)}
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
                  </div>
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
                <button className="btn-primary" onClick={() => setScreen('letter')} style={{ width: '100%' }}>
                  Read my letter →
                </button>
              </div>
            )}
          </div>
        )}

        {/* SCREEN 3: LETTER */}
        {screen === 'letter' && (
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
                {LETTER_PARAGRAPHS.map(
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

              {letterLines >= LETTER_PARAGRAPHS.length && !sealed && (
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
                    <button className="btn-primary" style={{ flex: 1 }} onClick={handleSeal} disabled={sealAnim}>
                      {sealAnim ? 'Sealing...' : 'Seal The Letter 💌'}
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setScreen('envelope');
                        setEnvelopeOpen(false);
                      }}
                    >
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
        )}

        {/* SCREEN 4: PLAYLIST */}
        {screen === 'playlist' && (
          <div>
            <div
              style={{
                background: 'linear-gradient(160deg,#ffd6e8,#ffc4d4)',
                borderRadius: '24px 24px 0 0',
                padding: '14px 20px 10px',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: '0 0 2px', color: '#c83c82', fontWeight: 700, fontSize: '17px' }}>
                Birthday Vibes Playlist 🎵
              </p>
              <p style={{ margin: 0, color: '#d4548a', fontSize: '13px', fontStyle: 'italic' }}>
                Songs that carry what words cannot
              </p>
            </div>

            <div
              style={{
                background: '#fff0f6',
                border: '1px solid rgba(232,80,154,0.15)',
                borderTop: 'none',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg,${SONGS[activeSong].color},#c83c82)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                }}
              >
                🎵
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: '0 0 1px',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#7a2255',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {SONGS[activeSong].title}
                </p>
                <p
                  style={{
                    margin: '0 0 6px',
                    fontSize: '11px',
                    color: '#a07080',
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {SONGS[activeSong].artist}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: '#aaa', fontFamily: "'Courier New', monospace" }}>
                    0:{Math.floor(progress * 0.36)
                      .toString()
                      .padStart(2, '0')}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '5px',
                      background: 'rgba(232,80,154,0.15)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#aaa', fontFamily: "'Courier New', monospace" }}>
                    0:36
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setPlaying((p) => !p);
                  setProgress(0);
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#e8509a,#c83c82)',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 14px rgba(232,80,154,0.4)',
                }}
              >
                {playing ? '⏸' : '▶'}
              </button>
            </div>

            <div
              style={{
                background: '#fff9fc',
                border: '1px solid rgba(232,80,154,0.12)',
                borderTop: 'none',
                borderBottom: 'none',
                padding: '16px 8px',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {SONGS.map((song, i) => (
                  <div
                    key={song.id}
                    onClick={() => {
                      setActiveSong(i);
                      setPlaying(true);
                      setProgress(0);
                    }}
                    style={{
                      flexShrink: 0,
                      width: '200px',
                      borderRadius: '16px',
                      border: `2px solid ${activeSong === i ? song.color : 'rgba(232,80,154,0.12)'}`,
                      background: activeSong === i ? `linear-gradient(135deg,${song.color}18,#fff5fa)` : '#fff',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'border-color 0.25s,background 0.25s',
                    }}
                  >
                    <div
                      style={{
                        height: '110px',
                        borderRadius: '10px',
                        background: `linear-gradient(135deg,${song.color}55,#ffd6e8)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '40px',
                        marginBottom: '10px',
                      }}
                    >
                      🎶
                    </div>
                    <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '13px', color: '#7a2255' }}>{song.title}</p>
                    <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#a07080', fontFamily: "'Courier New', monospace" }}>
                      {song.artist}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#c83c82', fontStyle: 'italic' }}>{song.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: '#fff9fc',
                border: '1px solid rgba(232,80,154,0.12)',
                borderTop: 'none',
                borderRadius: '0 0 24px 24px',
                padding: '14px 16px',
              }}
            >
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => setScreen('final')}>
                Continue → The Last Thing ✨
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: FINAL */}
        {screen === 'final' && (
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
                  onClick={spawnHearts}
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

              <button
                className="btn-primary"
                style={{ width: '100%', marginBottom: '10px' }}
                onClick={() => {
                  setScreen('envelope');
                  setEnvelopeOpen(false);
                  setFlipped({});
                  setAllFlipped(false);
                  setSealed(false);
                  setTapCount(0);
                  setHearts([]);
                  setProgress(0);
                  setPlaying(false);
                }}
              >
                Experience Again ✨
              </button>
              <button className="btn-secondary" style={{ width: '100%' }} onClick={() => alert('Sending birthday kisses 💋')}>
                Send a Kiss 💋
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}