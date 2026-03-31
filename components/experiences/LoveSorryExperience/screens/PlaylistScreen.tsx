import React from 'react';

import type { Song } from '../types';

interface PlaylistScreenProps {
  songs: Song[];
  activeSong: number;
  playing: boolean;
  progress: number;
  onTogglePlay: () => void;
  onSelectSong: (index: number) => void;
  onContinue: () => void;
}

export function PlaylistScreen({
  songs,
  activeSong,
  playing,
  progress,
  onTogglePlay,
  onSelectSong,
  onContinue,
}: PlaylistScreenProps) {
  const currentSong = songs[activeSong];

  return (
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
            background: `linear-gradient(135deg,${currentSong.color},#c83c82)`,
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
            {currentSong.title}
          </p>
          <p
            style={{
              margin: '0 0 6px',
              fontSize: '11px',
              color: '#a07080',
              fontFamily: "'Courier New', monospace",
            }}
          >
            {currentSong.artist}
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
            <span style={{ fontSize: '10px', color: '#aaa', fontFamily: "'Courier New', monospace" }}>0:36</span>
          </div>
        </div>
        <button
          onClick={onTogglePlay}
          aria-label={playing ? 'Pause song preview' : 'Play song preview'}
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
          {songs.map((song, i) => (
            <button
              type="button"
              key={song.id}
              onClick={() => onSelectSong(i)}
              aria-label={`Play ${song.title} by ${song.artist}`}
              style={{
                flexShrink: 0,
                width: '200px',
                borderRadius: '16px',
                border: `2px solid ${activeSong === i ? song.color : 'rgba(232,80,154,0.12)'}`,
                background: activeSong === i ? `linear-gradient(135deg,${song.color}18,#fff5fa)` : '#fff',
                padding: '12px',
                cursor: 'pointer',
                transition: 'border-color 0.25s,background 0.25s',
                textAlign: 'left',
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
            </button>
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
        <button className="btn-primary" style={{ width: '100%' }} onClick={onContinue}>
          Continue → The Last Thing ✨
        </button>
      </div>
    </div>
  );
}
