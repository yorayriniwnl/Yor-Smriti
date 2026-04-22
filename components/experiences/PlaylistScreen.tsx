'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Song = { id: string; title: string; artist: string; note: string; color: string; bar: number };

type Props = {
  songs: Song[];
  activeSong: string | null;
  playing: boolean;
  progress: number;
  onTogglePlay: (id: string) => void;
  onSelectSong: (id: string) => void;
  onContinue: () => void;
};

// YouTube search URL for a song (opens in new tab)
function buildYouTubeUrl(title: string, artist: string): string {
  return `https://music.youtube.com/search?q=${encodeURIComponent(`${title} ${artist}`)}`;
}

export default function PlaylistScreen({
  songs, activeSong, onSelectSong, onContinue,
}: Props) {
  const [openedExternal, setOpenedExternal] = useState<string | null>(null);

  const handleSongClick = (song: Song) => {
    onSelectSong(song.id);
  };

  const handleOpenYouTube = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    setOpenedExternal(song.id);
    window.open(buildYouTubeUrl(song.title, song.artist), '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '0.25rem 0',
      }}
    >
      <div>
        <p
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.16em',
            color: 'rgba(255,180,210,0.5)',
            textTransform: 'uppercase',
            marginBottom: '0.6rem',
          }}
        >
          Songs that feel like us
        </p>
        <p
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: '0.88rem',
            color: 'rgba(255,190,220,0.5)',
            lineHeight: 1.5,
            marginBottom: '1rem',
          }}
        >
          Tap a song to open it in YouTube Music. Each one was chosen for a reason.
        </p>
      </div>

      {songs.map((song) => {
        const isActive = activeSong === song.id;
        const wasOpened = openedExternal === song.id;

        return (
          <motion.div
            key={song.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.015 }}
            onClick={() => handleSongClick(song)}
            style={{
              border: `1px solid ${isActive ? song.color.replace('0.9', '0.45') : 'rgba(244,173,210,0.15)'}`,
              borderRadius: '1.1rem',
              padding: '0.9rem 1.1rem',
              background: isActive
                ? `linear-gradient(135deg, ${song.color.replace('0.9', '0.12')}, rgba(20,8,19,0.9))`
                : 'linear-gradient(135deg, rgba(28,9,22,0.8), rgba(18,6,17,0.9))',
              cursor: 'pointer',
              transition: 'border-color 300ms, background 300ms',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '1.05rem',
                    color: isActive ? 'rgba(255,232,245,0.97)' : 'rgba(255,210,235,0.85)',
                    fontWeight: isActive ? 500 : 400,
                    lineHeight: 1.2,
                    marginBottom: '0.2rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {song.title}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.6rem',
                    color: 'rgba(255,170,205,0.5)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {song.artist}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '0.82rem',
                    color: 'rgba(255,185,218,0.55)',
                    fontStyle: 'italic',
                    marginTop: '0.4rem',
                    lineHeight: 1.4,
                  }}
                >
                  {song.note}
                </p>
              </div>

              {/* Open in YouTube Music button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleOpenYouTube(e, song)}
                title={`Open "${song.title}" in YouTube Music`}
                style={{
                  flexShrink: 0,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: `1px solid ${wasOpened ? song.color.replace('0.9', '0.6') : 'rgba(244,173,210,0.25)'}`,
                  background: wasOpened ? song.color.replace('0.9', '0.18') : 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  marginTop: '2px',
                  transition: 'border-color 200ms, background 200ms',
                }}
              >
                {wasOpened ? '✓' : '▶'}
              </motion.button>
            </div>

            {/* Color bar indicator */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '1.1rem',
                    right: '1.1rem',
                    height: '2px',
                    background: song.color,
                    borderRadius: '999px',
                    transformOrigin: 'left',
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Continue button */}
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        style={{
          marginTop: '0.5rem',
          background: 'linear-gradient(90deg, rgba(255,133,179,0.95), rgba(247,85,144,0.95))',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          padding: '0.75rem',
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 10px 24px rgba(247,85,144,0.25)',
        }}
      >
        Continue
      </motion.button>
    </div>
  );
}
