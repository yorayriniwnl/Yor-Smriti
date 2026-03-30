'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';

// ─── SoundToggle ──────────────────────────────────────────────────────────────

export const SoundToggle = memo(function SoundToggle() {
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);

  return (
    <motion.button
      className="sound-toggle"
      onClick={toggleSound}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 2, duration: 1 } }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
      title={soundEnabled ? 'Sound on' : 'Sound off'}
    >
      {soundEnabled ? (
        <SoundOnIcon />
      ) : (
        <SoundOffIcon />
      )}
    </motion.button>
  );
});

// ─── Icons ────────────────────────────────────────────────────────────────────

function SoundOnIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: 'var(--accent-dim)' }}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: 'var(--text-muted)' }}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
