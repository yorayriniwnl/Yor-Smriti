'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { MouseEvent } from 'react';
import EnvelopeScreen from './EnvelopeScreen';
import FlipCardsScreen from './FlipCardsScreen';
import LetterScreen from './LetterScreen';
import PlaylistScreen from './PlaylistScreen';
import FinalScreen from './FinalScreen';

const SCREENS = ['envelope', 'cards', 'letter', 'playlist', 'final'] as const;

const SORRY_CARDS = [
  {
    id: 'c1',
    front: { emoji: '💔', title: 'Card 1', hint: 'Tap to open' },
    back: {
      text: 'I went quiet when you needed me to stay. Not once — it was a pattern. I told myself I was giving you space. I was not. I was protecting myself from the discomfort of being fully present, and I made you pay for that.',
      sub: 'You deserved someone who stayed. I am sorry I kept leaving.',
    },
  },
  {
    id: 'c2',
    front: { emoji: '🌙', title: 'Card 2', hint: 'Tap to open' },
    back: {
      text: 'I made you feel like you were asking for too much when you were asking for the bare minimum. Consistency. Honesty. Presence. Those are not big asks. I made them feel like they were, and that was wrong.',
      sub: 'You were never too much. I was not enough.',
    },
  },
  {
    id: 'c3',
    front: { emoji: '✨', title: 'Card 3', hint: 'Tap to open' },
    back: {
      text: 'I still think about the night we stayed on the call until it dropped on its own. I think about the quiet evenings that felt like everything. I think about your voice when you talked about the things you loved. None of that went away.',
      sub: 'It probably never will.',
    },
  },
];

const SONGS = [
  {
    id: 's1',
    title: 'Tum Se Hi',
    artist: 'Mohit Chauhan',
    note: 'Because this is what mornings felt like with you in them — quiet, unhurried, enough.',
    color: '#f472b6',
    bar: 0.44,
  },
  {
    id: 's2',
    title: 'Agar Tum Saath Ho',
    artist: 'Arijit Singh & Alka Yagnik',
    note: 'I could not get through this song for a long time after. Now I think it is the most honest thing I have.',
    color: '#fb7185',
    bar: 0.62,
  },
  {
    id: 's3',
    title: 'Channa Mereya',
    artist: 'Arijit Singh',
    note: 'Loving someone well means letting them go if that is what they need. This song taught me that.',
    color: '#c084fc',
    bar: 0.51,
  },
];

const LETTER_PARAGRAPHS = [
  { id: 0, salutation: true, text: 'Smriti,' },
  {
    id: 1,
    text: 'I have started this letter more times than I can count. I kept deleting it because it never sounded right. Then I realised — I was editing it into something careful, something that protected me. So this time I am not going to do that.',
  },
  {
    id: 2,
    text: 'I keep thinking about the night we stayed on the call after everything had already been said. Neither of us hung up. I fell quiet and you stayed there with me. I did not know how rare that was. I do now.',
  },
  {
    id: 3,
    text: 'I pulled away when I should have stayed. I went quiet when you needed words. I called it needing space and it was not that — it was fear. You deserved someone who moved toward you when things got hard. I moved away. That is the thing I am most sorry for.',
  },
  {
    id: 4,
    text: 'I love you. Still. I am not saying that to create pressure or to ask for anything. I am saying it because you deserve to hear it said plainly, without performance, without an agenda attached.',
  },
  {
    id: 5,
    text: 'I hope you are well. I hope the people around you are treating you the way you deserve to be treated. And if you ever want to talk — I am here. No conditions. No timeline. Just here.',
  },
  {
    id: 6,
    signature: true,
    text: 'Yours, always —\nAyrin',
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
  const [activeSong, setActiveSong] = useState<string | null>(SONGS[0]?.id ?? null);
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
    setTimeout(() => setHearts((h) => h.filter((hh) => !newH.find((n) => n.id === hh.id))), 1200);
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

  // handlers passed to extracted child screens
  const openEnvelope = () => {
    setEnvelopeOpen(true);
    setTimeout(() => setScreen('cards'), 900);
  };

  const readLetter = () => setScreen('letter');

  const selectSong = (id: string) => {
    setActiveSong(id);
    setPlaying(true);
    setProgress(0);
  };

  const togglePlay = () => {
    setPlaying((p) => !p);
    setProgress(0);
  };

  const continueToFinal = () => setScreen('final');

  const resetExperience = () => {
    setScreen('envelope');
    setEnvelopeOpen(false);
    setFlipped({});
    setAllFlipped(false);
    setSealed(false);
    setTapCount(0);
    setHearts([]);
    setProgress(0);
    setPlaying(false);
  };

  const sendKiss = () => alert('Sending birthday kisses 💋');

  return (
    <div
      id="main-content"
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
                background: idx <= currentScreenIndex ? 'rgba(200, 60, 130, 0.75)' : 'rgba(200, 60, 130, 0.2)',
                transition: 'background 0.25s ease',
              }}
            />
          ))}
        </div>

        {screen === 'envelope' && (
          <EnvelopeScreen envelopeOpen={envelopeOpen} openEnvelope={openEnvelope} />
        )}

        {screen === 'cards' && (
          <FlipCardsScreen
            cards={SORRY_CARDS}
            flipped={flipped}
            toggleFlip={toggleFlip}
            allFlipped={allFlipped}
            onReadLetter={readLetter}
          />
        )}

        {screen === 'letter' && (
          <LetterScreen
            paragraphs={LETTER_PARAGRAPHS}
            letterLines={letterLines}
            sealed={sealed}
            sealAnim={sealAnim}
            onSeal={handleSeal}
            onExperienceAgain={() => {
              setScreen('envelope');
              setEnvelopeOpen(false);
            }}
          />
        )}

        {screen === 'playlist' && (
          <PlaylistScreen
            songs={SONGS}
            activeSong={activeSong}
            playing={playing}
            progress={progress}
            onTogglePlay={togglePlay}
            onSelectSong={selectSong}
            onContinue={continueToFinal}
          />
        )}

        {screen === 'final' && (
          <FinalScreen
            spawnHearts={spawnHearts}
            hearts={hearts}
            tapMsg={tapMsg}
            onExperienceAgainReset={resetExperience}
            onSendKiss={sendKiss}
          />
        )}
      </div>
    </div>
  );
}
