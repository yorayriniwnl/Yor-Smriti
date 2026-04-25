'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AmbientSound } from '@/components/ui/AmbientSound';
import { ScrollReset } from '@/components/ui/ScrollReset';
import { ReadingProgress } from '@/components/ui/ReadingProgress';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

// ─── Set this to whatever password only she knows ────────────────────────────
// This is intentionally client-side — the content is emotional, not state-secret.
// Change this before deploying.
const HER_PASSWORD = 'change-this-password';
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'ys_her_unlocked';

// ─── The private content ─────────────────────────────────────────────────────
// This is the rawest, most private thing on the site.
// Replace this placeholder with whatever you actually want to say.
function PrivateContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: EASE_SOFT }}
      className="relative z-10 mx-auto px-6"
      style={{ maxWidth: 580, paddingTop: '8vh', paddingBottom: '16vh' }}
    >
      <ReadingProgress />

      <p
        className="mb-12 uppercase tracking-[0.22em]"
        style={{
          fontFamily: 'var(--font-dm-mono)',
          color: 'rgba(255, 193, 223, 0.65)',
          fontSize: '0.58rem',
        }}
      >
        for her alone
      </p>

      {/* ── Replace everything below this line with your actual private content ── */}
      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 2.6vw, 1.35rem)',
          lineHeight: 1.9,
          color: 'rgba(255, 220, 240, 0.88)',
          fontWeight: 400,
        }}
      >
        [This is the private page. Only she gets here. Write what you actually need
        to say — the thing that does not belong on the other pages. This might be the
        most honest thing on the whole site. Use that.]
      </p>
      {/* ──────────────────────────────────────────────────────────────────────── */}

      <p
        className="mt-16"
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.14em',
          color: 'rgba(247, 110, 160, 0.42)',
        }}
      >
        — Ayrin
      </p>

      <div className="mt-14">
        <Link
          href="/hub"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'rgba(255, 171, 210, 0.3)',
            textTransform: 'uppercase',
          }}
        >
          ← back
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Password gate ────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const attempt = () => {
    if (value.trim() === HER_PASSWORD) {
      setError(false);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  return (
    <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_SOFT }}
        className="w-full text-center"
        style={{ maxWidth: 360 }}
      >
        <p
          className="mb-3 uppercase tracking-[0.22em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 193, 223, 0.55)',
            fontSize: '0.58rem',
          }}
        >
          for her alone
        </p>

        <h1
          className="mb-3"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 236, 246, 0.95)',
            fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)',
            lineHeight: 1.15,
            fontWeight: 400,
          }}
        >
          This one is just for you.
        </h1>

        <p
          className="mb-10"
          style={{
            fontFamily: 'var(--font-crimson)',
            color: 'rgba(255, 200, 225, 0.5)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          You know what to enter.
        </p>

        <motion.div
          animate={shaking ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') attempt(); }}
            placeholder="···"
            autoComplete="off"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${error ? 'rgba(247,85,144,0.55)' : 'rgba(244,173,210,0.22)'}`,
              borderRadius: '0.85rem',
              padding: '0.85rem 1.2rem',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '1rem',
              letterSpacing: '0.25em',
              color: 'rgba(255, 236, 246, 0.9)',
              outline: 'none',
              textAlign: 'center',
              transition: 'border-color 0.3s ease',
            }}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(247, 85, 144, 0.7)',
                }}
              >
                That is not quite right ♡
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={attempt}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem 2rem',
              borderRadius: '2rem',
              background: 'rgba(247,85,144,0.12)',
              border: '1px solid rgba(247,130,175,0.3)',
              color: 'rgba(255, 210, 235, 0.9)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.64rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            Enter →
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{ position: 'absolute', bottom: '1.5rem' }}
      >
        <Link
          href="/hub"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'rgba(255, 171, 210, 0.28)',
            textTransform: 'uppercase',
          }}
        >
          ← back
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ForHerAlonePage() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  // Check sessionStorage on mount to persist within the session
  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem(SESSION_KEY) === '1');
    } catch {
      setUnlocked(false);
    }
  }, []);

  // Avoid flash before we've checked storage
  if (unlocked === null) return null;

  return (
    <main
      id="main-content"
      className="relative min-h-dvh w-full"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <ScrollReset />
      <AmbientSound />

      {/* Ambient orb */}
      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          top: '20%', left: '15%',
          width: 280, height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,85,144,0.18), transparent 70%)',
          filter: 'blur(55px)',
          opacity: 0.5,
        }}
      />

      <AnimatePresence mode="wait">
        {unlocked ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <PrivateContent />
          </motion.div>
        ) : (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <PasswordGate onUnlock={() => setUnlocked(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
