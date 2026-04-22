'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/fetchApi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const EASE = [0.16, 1, 0.3, 1] as const;

type Mood = 'yes' | 'maybe' | 'needTime' | 'no';

const MOOD_OPTIONS: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: 'yes',      label: 'Yes, I forgive you',      emoji: '💗', color: 'rgba(247,85,144,0.9)' },
  { value: 'maybe',   label: 'I need to think',          emoji: '🌙', color: 'rgba(140,100,200,0.9)' },
  { value: 'needTime', label: 'Give me some time',       emoji: '🕯️', color: 'rgba(200,160,80,0.9)' },
  { value: 'no',       label: 'Not right now',           emoji: '🌧️', color: 'rgba(80,120,160,0.9)' },
];

type Step = 'mood' | 'message' | 'sent';

export default function ReplyPage() {
  const [step, setStep]       = useState<Step>('mood');
  const [mood, setMood]       = useState<Mood | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleMoodSelect = (m: Mood) => {
    setMood(m);
    setStep('message');
  };

  const handleSend = async () => {
    if (!mood) return;
    setSending(true);
    setError(null);
    try {
      const result = await fetchApi<{ ok: boolean; error?: string }>('/api/reply', {
        body: { message: message.trim() || '(no message)', mood },
      });
      if (result.ok && result.data?.ok) {
        setStep('sent');
      } else {
        setError(result.error ?? result.data?.error ?? 'Something went wrong.');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main
      id="main-content"
      className="flex min-h-dvh w-dvw items-center justify-center overflow-auto px-4 py-10"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255,213,233,0.55) 0%, rgba(95,45,82,0.5) 32%, rgba(22,8,20,0.96) 64%, #05030a 100%)',
      }}
    >
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* ── Step 1: Choose mood ── */}
          {step === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', color: 'rgba(255,180,210,0.55)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Your reply
              </p>
              <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem,6vw,3rem)', color: 'rgba(255,236,246,0.97)', fontWeight: 400, lineHeight: 1.1, marginBottom: '0.6rem' }}>
                How do you feel right now?
              </h1>
              <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '1.05rem', color: 'rgba(255,200,225,0.7)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                There is no wrong answer. Just what is true for you.
              </p>

              <div className="flex flex-col gap-3">
                {MOOD_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMoodSelect(opt.value)}
                    className="flex items-center gap-4 rounded-2xl border px-5 py-4 text-left"
                    style={{
                      borderColor: 'rgba(244,173,210,0.22)',
                      background: 'linear-gradient(135deg,rgba(35,11,28,0.85),rgba(20,8,19,0.9))',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{opt.emoji}</span>
                    <span style={{ fontFamily: 'var(--font-crimson)', fontSize: '1.05rem', color: 'rgba(255,220,240,0.9)' }}>
                      {opt.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Optional message ── */}
          {step === 'message' && mood && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => setStep('mood')}
                style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,160,200,0.45)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', marginBottom: '1rem' }}
              >
                ← Change
              </button>

              <div className="mb-5 flex items-center gap-3">
                <span style={{ fontSize: '1.6rem' }}>{MOOD_OPTIONS.find(m => m.value === mood)?.emoji}</span>
                <span style={{ fontFamily: 'var(--font-crimson)', fontSize: '1.1rem', color: 'rgba(255,220,240,0.85)' }}>
                  {MOOD_OPTIONS.find(m => m.value === mood)?.label}
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.6rem,5vw,2.4rem)', color: 'rgba(255,236,246,0.97)', fontWeight: 400, lineHeight: 1.12, marginBottom: '0.6rem' }}>
                Anything you want to add?
              </h2>
              <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.95rem', color: 'rgba(255,190,220,0.6)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Optional. You can send without writing anything.
              </p>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write anything here…"
                rows={5}
                maxLength={2000}
                className="w-full resize-none rounded-2xl border bg-transparent px-5 py-4 outline-none"
                style={{
                  borderColor: 'rgba(244,173,210,0.25)',
                  color: 'rgba(255,220,240,0.9)',
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  marginBottom: '1.5rem',
                }}
              />

              {error && (
                <p style={{ color: 'rgba(255,110,150,0.85)', fontFamily: 'var(--font-crimson)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  {error}
                </p>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSend}
                disabled={sending}
                className="w-full rounded-full py-3"
                style={{
                  background: 'linear-gradient(90deg,rgba(255,133,179,0.95),rgba(247,85,144,0.95))',
                  color: '#fff',
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.76rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: sending ? 'wait' : 'pointer',
                  opacity: sending ? 0.75 : 1,
                  boxShadow: '0 12px 28px rgba(247,85,144,0.28)',
                  transition: 'opacity 180ms ease',
                }}
              >
                {sending ? 'Sending…' : 'Send my reply'}
              </motion.button>
            </motion.div>
          )}

          {/* ── Step 3: Sent ── */}
          {step === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
              >
                💌
              </motion.div>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem,5vw,2.8rem)', color: 'rgba(255,236,246,0.97)', fontWeight: 400, lineHeight: 1.1, marginBottom: '0.75rem' }}>
                He will know.
              </h2>
              <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '1.05rem', color: 'rgba(255,200,225,0.7)', lineHeight: 1.65, marginBottom: '2.5rem', maxWidth: '36ch', margin: '0 auto 2.5rem' }}>
                Your reply has been received. Whatever you chose, it took courage to say it.
              </p>
              <Link
                href="/message"
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,171,210,0.6)',
                  textDecoration: 'none',
                }}
              >
                Back to the experience
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
