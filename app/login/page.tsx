'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const HARDCODED_USERNAME = 'Anyayrin';
const HARDCODED_PASSWORD = 'Anyayrin';

const LIP_PRINTS = [
  { left: '14%', top: '18%', delay: 0.02, rotate: -18, scale: 0.62 },
  { left: '84%', top: '22%', delay: 0.16, rotate: 16, scale: 0.56 },
  { left: '20%', top: '78%', delay: 0.3, rotate: -24, scale: 0.72 },
  { left: '78%', top: '82%', delay: 0.44, rotate: 19, scale: 0.68 },
  { left: '50%', top: '14%', delay: 0.58, rotate: -6, scale: 0.52 },
] as const;

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
  const successTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current !== null) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (showKissNote) {
      return;
    }

    const valid =
      username.trim() === HARDCODED_USERNAME &&
      password === HARDCODED_PASSWORD;

    if (!valid) {
      setErrorMessage('Invalid username or password.');
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
          boxShadow:
            '0 36px 74px rgba(0, 0, 0, 0.56), 0 16px 34px rgba(247, 85, 144, 0.22)',
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
          private space
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
          Login
        </h1>

        <p
          className="mx-auto mb-6 max-w-[34ch]"
          style={{
            color: 'rgba(255, 210, 230, 0.84)',
            fontFamily: 'var(--font-crimson)',
            fontSize: '0.95rem',
          }}
        >
          Enter username and password.
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
              disabled={showKissNote}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-11 w-full rounded-xl border px-4 outline-none transition"
              style={{
                borderColor: 'rgba(247, 85, 144, 0.35)',
                color: 'rgba(255, 238, 247, 0.95)',
                backgroundColor: 'rgba(255, 209, 233, 0.09)',
                opacity: showKissNote ? 0.58 : 1,
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
              autoComplete="current-password"
              disabled={showKissNote}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-xl border px-4 outline-none transition"
              style={{
                borderColor: 'rgba(247, 85, 144, 0.35)',
                color: 'rgba(255, 238, 247, 0.95)',
                backgroundColor: 'rgba(255, 209, 233, 0.09)',
                opacity: showKissNote ? 0.58 : 1,
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
            disabled={showKissNote}
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
              opacity: showKissNote ? 0.8 : 1,
              cursor: showKissNote ? 'wait' : 'pointer',
            }}
          >
            {showKissNote ? 'Sending love...' : 'Login'}
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

            {LIP_PRINTS.map((mark, index) => (
              <motion.div
                key={`lip-print-${index}`}
                className="absolute"
                initial={{ opacity: 0, scale: 0.24, y: 8, rotate: mark.rotate - 6 }}
                animate={{ opacity: [0.12, 0.58, 0.2], scale: [mark.scale, mark.scale * 1.16, mark.scale], y: [8, -4, 2], rotate: [mark.rotate - 2, mark.rotate + 4, mark.rotate] }}
                transition={{ duration: 1.6, delay: mark.delay, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  left: mark.left,
                  top: mark.top,
                  width: '7.1rem',
                  height: '3.9rem',
                  marginLeft: '-3.55rem',
                  marginTop: '-1.95rem',
                  filter: 'drop-shadow(0 0 14px rgba(247, 85, 144, 0.3))',
                }}
              >
                <LipPrint tint="rgba(255, 132, 182, 0.9)" />
              </motion.div>
            ))}

            <div className="relative h-[16rem] w-[16rem]">
              <motion.div
                className="absolute left-1/2 h-[5.2rem] w-[10.8rem] -translate-x-1/2 -translate-y-1/2"
                style={{ top: '38%' }}
                initial={{ opacity: 0.55, y: -34, scale: 0.5 }}
                animate={{ opacity: [0.55, 0.94, 0.72], y: [-34, -6, -16], scale: [0.5, 1.56, 1.18] }}
                transition={{ duration: 1.25, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
              >
                <LipPrint tint="rgba(255, 120, 176, 0.96)" />
              </motion.div>

              <motion.div
                className="absolute left-1/2 h-[5.2rem] w-[10.8rem] -translate-x-1/2 -translate-y-1/2"
                style={{ top: '62%' }}
                initial={{ opacity: 0.55, y: 34, scale: 0.5 }}
                animate={{ opacity: [0.55, 0.94, 0.72], y: [34, 6, 16], scale: [0.5, 1.56, 1.18] }}
                transition={{ duration: 1.25, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
              >
                <LipPrint tint="rgba(255, 142, 190, 0.94)" />
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
            </div>
          </div>
        ) : null}

        <p
          className="mt-5"
          style={{
            color: 'rgba(255, 196, 223, 0.72)',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.06em',
          }}
        >
          Hardcoded credentials: Anyayrin / Anyayrin
        </p>
      </section>
    </main>
  );
}