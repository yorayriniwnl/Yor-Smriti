'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const HARDCODED_USERNAME = 'Anyayrin';
const HARDCODED_PASSWORD = 'Anyayrin';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const valid =
      username.trim() === HARDCODED_USERNAME &&
      password === HARDCODED_PASSWORD;

    if (!valid) {
      setErrorMessage('Invalid username or password.');
      return;
    }

    setErrorMessage('');
    router.push('/message');
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
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-11 w-full rounded-xl border px-4 outline-none transition"
              style={{
                borderColor: 'rgba(247, 85, 144, 0.35)',
                color: 'rgba(255, 238, 247, 0.95)',
                backgroundColor: 'rgba(255, 209, 233, 0.09)',
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-xl border px-4 outline-none transition"
              style={{
                borderColor: 'rgba(247, 85, 144, 0.35)',
                color: 'rgba(255, 238, 247, 0.95)',
                backgroundColor: 'rgba(255, 209, 233, 0.09)',
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
            }}
          >
            Login
          </button>
        </form>

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