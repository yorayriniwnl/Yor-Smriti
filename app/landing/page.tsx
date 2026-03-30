"use client";

import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const AUTH_STORAGE_KEY = 'yor-smriti-auth';
const HARDCODED_USERNAME = 'Anyayrin';
const HARDCODED_PASSWORD = 'Anyayrin';

function sanitizeNextPath(nextValue: string | null): string | null {
  if (!nextValue) return null;
  if (!nextValue.startsWith('/')) return null;
  if (nextValue.startsWith('//')) return null;
  return nextValue;
}

function buildWelcomePath(nextPath: string): string {
  const encoded = encodeURIComponent(nextPath);
  return `/landing/welcome?next=${encoded}`;
}

// ─── Landing Page ────────────────────────────────────────────────────────────

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const nextPath = sanitizeNextPath(searchParams.get('next')) ?? '/message';
  const postLoginPath = buildWelcomePath(nextPath);
  const forceLogin = searchParams.get('forceLogin') === '1';

  useEffect(() => {
    if (forceLogin) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    setIsHydrated(true);
  }, [forceLogin]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const valid =
      username.trim() === HARDCODED_USERNAME &&
      password === HARDCODED_PASSWORD;

    if (!valid) {
      setErrorMessage('Invalid username or password.');
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, 'ok');
    setErrorMessage('');
    setIsRedirecting(true);
    router.replace(postLoginPath);
  };

  if (!isHydrated || isRedirecting) {
    return null;
  }

  return (
    <main
      id="main-content"
      className="flex h-dvh w-dvw items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 20% 10%, #ffd6e760 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 80%, #ffb3cf40 0%, transparent 60%), var(--bg)',
      }}
    >
      <section
        className="w-full max-w-md rounded-2xl border p-8 shadow-lg"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'rgba(247, 85, 144, 0.25)',
          boxShadow: '0 22px 48px rgba(247, 85, 144, 0.15)',
        }}
      >
        <p
          className="mb-2 text-center uppercase tracking-[0.18em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.62rem',
          }}
        >
          private space
        </p>

        <h1
          className="mb-2 text-center"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'var(--text-primary)',
            fontSize: 'clamp(1.8rem, 4.2vw, 2.5rem)',
            lineHeight: 1.15,
          }}
        >
          Login
        </h1>

        <p
          className="mb-6 text-center"
          style={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-crimson)',
            fontSize: '0.95rem',
          }}
        >
          Enter username and password.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="mb-1 block"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
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
              className="w-full rounded-md border px-3 py-2 outline-none"
              style={{
                borderColor: 'rgba(247, 85, 144, 0.25)',
                color: 'var(--text-primary)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
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
              className="w-full rounded-md border px-3 py-2 outline-none"
              style={{
                borderColor: 'rgba(247, 85, 144, 0.25)',
                color: 'var(--text-primary)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            />
          </div>

          {errorMessage ? (
            <p
              role="alert"
              style={{
                color: 'var(--accent-dim)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.04em',
              }}
            >
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-full px-4 py-2"
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
          className="mt-4 text-center"
          style={{
            color: 'var(--text-muted)',
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

export default function LandingPage() {
  return (
    <Suspense fallback={null}>
      <LandingPageContent />
    </Suspense>
  );
}
