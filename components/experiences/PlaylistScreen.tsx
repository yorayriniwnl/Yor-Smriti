'use client';

// Bug 52 fix: real <audio> element replaces fake setInterval progress counter
// Bug 57 fix: AnalyserNode drives waveform bars instead of hardcoded `bar` fractions

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Song = {
  id: string;
  title: string;
  artist: string;
  note: string;
  color: string;
  src: string;
  ytUrl: string;
};

type Props = {
  songs: Song[];
  activeSong: string | null;
  onSelectSong: (id: string) => void;
  onContinue: () => void;
};

const BAR_COUNT = 24;

export default function PlaylistScreen({ songs, activeSong, onSelectSong, onContinue }: Props) {
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef      = useRef<number | null>(null);

  const [isPlaying,   setIsPlaying]   = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [barHeights, setBarHeights]   = useState<number[]>(() => Array(BAR_COUNT).fill(0));
  const [openedExternal, setOpenedExternal] = useState<string | null>(null);

  const currentSongIndex = Math.max(0, songs.findIndex((s) => s.id === activeSong));
  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') void audioCtxRef.current.close();

    setIsPlaying(false); setProgress(0); setCurrentTime(0); setDuration(0);
    setBarHeights(Array(BAR_COUNT).fill(0));

    if (!currentSong) return;

    const audio = new Audio(currentSong.src);
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const ctx      = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.78;
    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    const _tick = () => {
      analyser.getByteFrequencyData(freqData);
      const step = Math.floor(freqData.length / BAR_COUNT);
      setBarHeights(Array.from({ length: BAR_COUNT }, (_, i) => +((freqData[i * step] ?? 0) / 255).toFixed(3)));
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
      rafRef.current = requestAnimationFrame(_tick);
    };

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false); setProgress(0); setCurrentTime(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setBarHeights(Array(BAR_COUNT).fill(0));
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audio.pause(); audio.src = '';
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      if (ctx.state !== 'closed') void ctx.close();
      audioRef.current = null; audioCtxRef.current = null; analyserRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    const ctx   = audioCtxRef.current;
    if (!audio || !ctx) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    } else {
      if (ctx.state === 'suspended') await ctx.resume();
      try {
        await audio.play();
        setIsPlaying(true);
        const analyser = analyserRef.current!;
        const freqData = new Uint8Array(analyser.frequencyBinCount);
        const step = Math.floor(freqData.length / BAR_COUNT);
        const _tick2 = () => {
          analyser.getByteFrequencyData(freqData);
          setBarHeights(Array.from({ length: BAR_COUNT }, (_, i) => +((freqData[i * step] ?? 0) / 255).toFixed(3)));
          if (audio.duration) {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
          }
          rafRef.current = requestAnimationFrame(_tick2);
        };
        rafRef.current = requestAnimationFrame(_tick2);
      } catch {
        window.open(currentSong?.ytUrl, '_blank', 'noopener');
      }
    }
  }, [isPlaying, currentSong]);

  const formatTime = (s: number) => {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const handleOpenYouTube = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    setOpenedExternal(song.id);
    window.open(song.ytUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.25rem 0' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.58rem', letterSpacing: '0.16em', color: 'rgba(255,180,210,0.5)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Songs that feel like us
        </p>
        <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.88rem', color: 'rgba(255,190,220,0.5)', lineHeight: 1.5, marginBottom: '1rem' }}>
          Tap a song to play it. Each one was chosen for a reason.
        </p>
      </div>

      {songs.map((song) => {
        const isActive  = activeSong === song.id;
        const wasOpened = openedExternal === song.id;

        return (
          <motion.div
            key={song.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.015 }}
            onClick={() => onSelectSong(song.id)}
            style={{
              border: `1px solid ${isActive ? song.color.replace('0.9','0.45') : 'rgba(244,173,210,0.15)'}`,
              borderRadius: '1.1rem',
              padding: '0.9rem 1.1rem',
              background: isActive
                ? `linear-gradient(135deg, ${song.color.replace('0.9','0.12')}, rgba(20,8,19,0.9))`
                : 'linear-gradient(135deg, rgba(28,9,22,0.8), rgba(18,6,17,0.9))',
              cursor: 'pointer',
              transition: 'border-color 300ms, background 300ms',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '1.05rem', color: isActive ? 'rgba(255,232,245,0.97)' : 'rgba(255,210,235,0.85)', fontWeight: isActive ? 500 : 400, lineHeight: 1.2, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {song.title}
                </p>
                <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.6rem', color: 'rgba(255,170,205,0.5)', letterSpacing: '0.06em' }}>
                  {song.artist}
                </p>
                <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.82rem', color: 'rgba(255,185,218,0.55)', fontStyle: 'italic', marginTop: '0.4rem', lineHeight: 1.4 }}>
                  {song.note}
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleOpenYouTube(e, song)}
                title={`Open "${song.title}" in YouTube Music`}
                style={{
                  flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%',
                  border: `1px solid ${wasOpened ? song.color.replace('0.9','0.6') : 'rgba(244,173,210,0.25)'}`,
                  background: wasOpened ? song.color.replace('0.9','0.18') : 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '0.9rem', marginTop: '2px',
                  transition: 'border-color 200ms, background 200ms',
                }}
              >
                {wasOpened ? '✓' : '↗'}
              </motion.button>
            </div>

            {/* Bug 52+57: real player UI — only shown for active song */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginTop: '0.75rem' }}
                >
                  {/* Bug 57: real AnalyserNode-driven waveform bars */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '32px', marginBottom: '0.6rem' }}>
                    {barHeights.map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: isPlaying ? Math.max(h, 0.06) : 0.06 }}
                        transition={{ duration: 0.05, ease: 'linear' }}
                        style={{ flex: 1, height: '32px', borderRadius: '2px', background: 'rgba(247,85,144,0.85)', transformOrigin: 'bottom' }}
                      />
                    ))}
                  </div>

                  {/* Bug 52: seekable progress range input */}
                  <input
                    type="range" min={0} max={100} value={progress}
                    onChange={(e) => {
                      const audio = audioRef.current;
                      if (!audio || !audio.duration) return;
                      const pct = Number(e.target.value);
                      audio.currentTime = (pct / 100) * audio.duration;
                      setProgress(pct);
                    }}
                    style={{ width: '100%', accentColor: 'rgba(247,85,144,0.9)', cursor: 'pointer', marginBottom: '0.4rem' }}
                    aria-label="Seek"
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.58rem', color: 'rgba(255,170,205,0.5)', letterSpacing: '0.06em' }}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={(e) => { e.stopPropagation(); void togglePlay(); }}
                      style={{
                        background: 'linear-gradient(90deg, rgba(255,133,179,0.95), rgba(247,85,144,0.95))',
                        color: '#fff', border: 'none', borderRadius: '999px',
                        padding: '0.35rem 1rem', fontFamily: 'var(--font-dm-mono)',
                        fontSize: '0.65rem', letterSpacing: '0.08em', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(247,85,144,0.3)',
                      }}
                    >
                      {isPlaying ? '⏸ Pause' : '▶ Play'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  style={{ position: 'absolute', bottom: 0, left: '1.1rem', right: '1.1rem', height: '2px', background: song.color, borderRadius: '999px', transformOrigin: 'left' }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      <motion.button
        type="button"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        style={{
          marginTop: '0.5rem',
          background: 'linear-gradient(90deg, rgba(255,133,179,0.95), rgba(247,85,144,0.95))',
          color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem',
          fontFamily: 'var(--font-dm-mono)', fontSize: '0.72rem',
          letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
          boxShadow: '0 10px 24px rgba(247,85,144,0.25)',
        }}
      >
        Continue
      </motion.button>
    </div>
  );
}
