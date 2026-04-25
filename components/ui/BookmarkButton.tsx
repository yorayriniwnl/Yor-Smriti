'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'ys_bookmark';

export interface BookmarkData {
  href: string;
  title: string;
  savedAt: number;
}

/**
 * A small, unobtrusive bookmark button fixed to the bottom-right of the page.
 * Saves { href, title } to localStorage so /hub can show a "Come back" prompt.
 *
 * Usage:
 *   <BookmarkButton title="Things I Never Said" />
 */
export function BookmarkButton({ title }: { title: string }) {
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Check if this page is already bookmarked on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: BookmarkData = JSON.parse(raw);
        if (data.href === pathname) setSaved(true);
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  const handleSave = () => {
    try {
      const data: BookmarkData = { href: pathname, title, savedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaved(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    } catch {
      // ignore storage errors
    }
  };

  const handleClear = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: BookmarkData = JSON.parse(raw);
        if (data.href === pathname) {
          localStorage.removeItem(STORAGE_KEY);
          setSaved(false);
        }
      }
    } catch {
      // ignore
    }
  };

  return (
    <motion.button
      type="button"
      onClick={saved ? handleClear : handleSave}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      title={saved ? 'Remove bookmark' : 'Come back to this later'}
      aria-label={saved ? 'Remove bookmark' : 'Come back to this later'}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 50,
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: saved
          ? 'rgba(247, 85, 144, 0.18)'
          : 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${saved ? 'rgba(247, 130, 175, 0.45)' : 'rgba(244, 173, 210, 0.2)'}`,
        boxShadow: saved
          ? '0 4px 16px rgba(247,85,144,0.2)'
          : '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={saved ? 'saved' : 'unsaved'}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: pulse ? 1.2 : 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: '0.85rem', lineHeight: 1 }}
          aria-hidden="true"
        >
          {saved ? '🔖' : '📌'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * Reads the stored bookmark from localStorage.
 * Returns null if none, or { href, title }.
 */
export function getStoredBookmark(): BookmarkData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookmarkData) : null;
  } catch {
    return null;
  }
}
