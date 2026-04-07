'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { safeFetchJson } from '@/lib/safeFetch';

function LipPrint({ tint }: { tint: string }) {
  return (
    <svg viewBox="0 0 220 120" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 66 C26 28 70 20 109 49 C148 20 194 28 212 66 C180 78 145 90 109 88 C73 90 38 78 8 66Z"
        fill={tint}
      />
      <path
        d="M18 66 C54 76 77 80 109 79 C141 80 166 76 202 66 C171 96 140 108 109 107 C78 108 47 96 18 66Z"
        fill="rgba(255, 231, 240, 0.36)"
      />
      <path
        d="M12 66 C42 43 74 38 109 52 C144 38 178 43 208 66"
        fill="none"
        stroke="rgba(255, 237, 244, 0.45)"
        strokeWidth="3"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showKissNote, setShowKissNote] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const successTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current !== null) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (showKissNote || isAuthenticating) {
      return;
    }

    setErrorMessage('');
    setIsAuthenticating(true);

    try {
      const res = await safeFetchJson('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      }, { timeoutMs: 12000 });

      if (!res.ok) {
        setErrorMessage(res.error ?? 'Invalid username or password.');
        return;
      }

      setErrorMessage('');
      setShowKissNote(true);

      if (successTimerRef.current !== null) {
        window.clearTimeout(successTimerRef.current);
      }

      successTimerRef.current = window.setTimeout(() => {
        router.push('/message');
      }, 2200);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setErrorMessage('Login aborted.');
      } else {
        setErrorMessage('Unable to login right now. Please try again.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <main
      id="main-content"
      className="relative flex h-dvh w-dvw items-center justify-center overflow-hidden px-4"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 18% 22%, rgba(255, 196, 224, 0.16), transparent 35%), radial-gradient(circle at 82% 82%, rgba(255, 229, 166, 0.1), transparent 35%)',
        }}
      />

      <section
        className="relative w-full max-w-lg rounded-[2rem] border px-6 py-10 text-center md:px-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          borderColor: 'rgba(244, 173, 210, 0.28)',
          boxShadow: '0 36px 74px rgba(0, 0, 0, 0.56), 0 16px 34px rgba(247, 85, 144, 0.22)',
        }}
      >
        <p
          className="mb-2 uppercase tracking-[0.18em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 193, 223, 0.78)',
            fontSize: '0.62rem',
          }}
        >
          Private
        </p>

        <h1
          className="mb-2"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 236, 246, 0.98)',
            fontSize: 'clamp(1.8rem, 4.2vw, 2.5rem)',
            lineHeight: 1.15,
          }}
        >
          Private cinematic apology experiences
        </h1>

        <p
          className="mx-auto mb-6 max-w-[34ch]"
          style={{
            color: 'rgba(255, 210, 230, 0.84)',
            fontFamily: 'var(--font-crimson)',
            fontSize: '0.95rem',
          }}
        >
          Interactive, guided experiences for relationship repair.
        </p>

        <form className="mx-auto w-full max-w-sm space-y-5 text-left" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="mb-2 block"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
                color: 'rgba(255, 193, 223, 0.78)',
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              disabled={showKissNote || isAuthenticating}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-11 w-full rounded-xl border px-4 outline-none transition"
              style={{
                borderColor: 'rgba(247, 85, 144, 0.35)',
                color: 'rgba(255, 238, 247, 0.95)',
                backgroundColor: 'rgba(255, 209, 233, 0.09)',
                opacity: showKissNote || isAuthenticating ? 0.58 : 1,
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
                color: 'rgba(255, 193, 223, 0.78)',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="off"
              disabled={showKissNote || isAuthenticating}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-xl border px-4 outline-none transition"
              style={{
                borderColor: 'rgba(247, 85, 144, 0.35)',
                color: 'rgba(255, 238, 247, 0.95)',
                backgroundColor: 'rgba(255, 209, 233, 0.09)',
                opacity: showKissNote || isAuthenticating ? 0.58 : 1,
              }}
            />
          </div>

          {errorMessage ? (
            <p
              role="alert"
              className="rounded-lg border px-3 py-2"
              style={{
                color: 'var(--accent-dim)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.04em',
                borderColor: 'rgba(247, 85, 144, 0.3)',
                backgroundColor: 'rgba(247, 85, 144, 0.09)',
              }}
            >
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={showKissNote || isAuthenticating}
            className="mt-1 h-11 w-full rounded-full px-4"
            style={{
              background:
                'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
              color: '#fff',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              boxShadow: '0 8px 24px rgba(247, 85, 144, 0.28)',
              opacity: showKissNote || isAuthenticating ? 0.8 : 1,
              cursor: showKissNote || isAuthenticating ? 'wait' : 'pointer',
            }}
          >
            {showKissNote ? 'Sending...' : isAuthenticating ? 'Checking...' : 'Start experience'}
          </button>
        </form>

        {showKissNote ? (
          <div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-[2rem]"
            aria-hidden="true"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                background:
                  'radial-gradient(circle at 50% 38%, rgba(255, 204, 227, 0.26), rgba(11, 3, 11, 0.82) 68%)',
              }}
            />

            <div className="relative h-[16rem] w-[16rem]">
              <motion.div
                className="absolute left-1/2 top-1/2 h-[6rem] w-[12rem] -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0.45, scale: 0.46, y: 18 }}
                animate={{
                  opacity: [0.45, 0.96, 0.68],
                  scale: [0.46, 1.65, 1.1],
                  y: [18, 0, 4],
                  rotate: [-2, 1, -1],
                }}
                transition={{ duration: 1.28, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
              >
                <LipPrint tint="rgba(255, 126, 182, 0.98)" />
              </motion.div>

              <motion.div
                className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                animate={{ opacity: [0.66, 0], scale: [0.22, 2.45] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
                style={{
                  borderColor: 'rgba(255, 168, 206, 0.64)',
                  boxShadow: '0 0 18px rgba(247, 85, 144, 0.28)',
                }}
              />

              <motion.span
                className="absolute left-1/2 top-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0], y: [18, 38, 56], scale: [0.7, 1, 0.82] }}
                transition={{ duration: 1.22, repeat: Infinity, ease: 'easeOut', delay: 0.18 }}
                style={{
                  fontSize: '2rem',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 0 10px rgba(255, 150, 195, 0.35))',
                }}
              >
                💋
              </motion.span>
            </div>
          </div>
        ) : null}
      </section>

      <div className="fixed bottom-4 left-4 z-50 pointer-events-none" aria-hidden="true">
        <div
          className="rounded-md px-2 py-1 text-xs"
          style={{
            background: 'rgba(0,0,0,0.38)',
            color: 'rgba(255,255,255,0.92)',
            fontFamily: 'var(--font-dm-mono)',
          }}
        >
          Total lines: 39,921
        </div>
      </div>
    </main>
  );
}
