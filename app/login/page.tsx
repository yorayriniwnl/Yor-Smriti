'use client';

import type { MouseEvent } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { fetchApi } from '@/lib/fetchApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const HEART_EXPAND_MS = 2100;
const HEART_HOLD_MS   = 2900;
const HEART_TOTAL_MS  = HEART_EXPAND_MS + HEART_HOLD_MS;
const HEART_BASE_SIZE_FALLBACK = 64;
const HEART_BASE_SIZE_STYLE    = 'var(--heart-base-size, 64px)';

interface HeartSplashState {
  active: boolean;
  expanded: boolean;
  x: number;
  y: number;
  fitScale: number;
}

function resolveHeartBaseSizePx() {
  if (typeof window === 'undefined') return HEART_BASE_SIZE_FALLBACK;
  const cssValue = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--heart-base-size')
    .trim();
  const parsed = Number.parseFloat(cssValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : HEART_BASE_SIZE_FALLBACK;
}

// ─── Inner component (uses useSearchParams — must be inside Suspense) ─────────

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [heartSplash, setHeartSplash] = useState<HeartSplashState>({
    active: false, expanded: false, x: 0, y: 0, fitScale: 1,
  });
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // The experience is password-first. We try an empty-password login first;
  // if the server returns 401, we reveal the password input.
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword]           = useState('');
  const [showPassInput, setShowPassInput] = useState(false);

  const doRedirect = () => {
    const next = searchParams.get('next');
    const safe = next && next.startsWith('/') && !next.startsWith('//') ? next : '/message';
    router.replace(safe);
  };

  const callLoginAPI = async (pw?: string) => {
    try {
      setLoading(true);
      const result = await fetchApi<{ ok: boolean; error?: string; user?: string }>('/api/login', {
        body: { password: pw ?? '' },
      });
      const data = result.data ?? { ok: false, error: result.error };
      const res = { ok: result.ok, status: result.status };
      if (res.ok && data.ok) {
        setError(null);
        doRedirect();
      } else if (res.status === 401) {
        // Server requires real password
        setNeedsPassword(true);
        setShowPassInput(true);
        setLoading(false);
        if (pw) setError('That is not quite right ♡ Try again.');
      } else {
        setError(data.error ?? 'Something went wrong.');
        setLoading(false);
      }
    } catch {
      setError('Could not connect. Please try again.');
      setLoading(false);
    }
  };

  const startHeartTransition = (event: MouseEvent<HTMLButtonElement>) => {
    if (heartSplash.active || loading) return;

    if (needsPassword && !password) {
      setShowPassInput(true);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX > 0 ? event.clientX : rect.left + rect.width / 2;
    const y = event.clientY > 0 ? event.clientY : rect.top + rect.height / 2;
    const viewportFitSize = Math.min(window.innerWidth, window.innerHeight) * 0.92;
    const fitScale = Math.max(1, viewportFitSize / resolveHeartBaseSizePx());

    setHeartSplash({ active: true, expanded: false, x, y, fitScale });

    window.requestAnimationFrame(() => {
      setHeartSplash((c) => ({ ...c, expanded: true }));
    });

    // Call the login API during the animation
    callLoginAPI(needsPassword ? password : undefined);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    callLoginAPI(password);
  };

  return (
    <main
      id="main-content"
      className="login-shell relative flex h-dvh w-dvw items-center justify-center overflow-hidden px-4"
    >
      <section
        className="login-card relative z-10 w-full max-w-2xl rounded-3xl border px-6 py-10 text-center md:px-12"
      >
        <p className="login-kicker mb-3 uppercase tracking-[0.2em]">
          relationship repair note
        </p>

        <h1 className="login-title mb-4">
          Meri Anya &lt;3 are you mad at Ayrin?
        </h1>

        <p className="login-copy mx-auto mb-8 max-w-[46ch]">
          Wana see how much I love you?
        </p>

        {/* Password field — only shown when server requires it */}
        <AnimatePresence>
          {showPassInput && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handlePasswordSubmit}
              className="mb-6"
            >
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter our secret…"
                className="login-password-input w-full max-w-xs rounded-full border bg-transparent px-5 py-2.5 text-center outline-none"
              />
            </motion.form>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="login-error mb-4 text-sm"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={startHeartTransition}
            disabled={heartSplash.active || loading}
            className="login-cta inline-flex items-center justify-center rounded-full px-9 py-3"
          >
            {loading ? 'One moment…' : 'Are you ready for it baby?'}
          </button>
        </div>
      </section>

      {/* Heart splash overlay */}
      {heartSplash.active ? (
        <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(8, 3, 9, 0.3)',
              opacity: heartSplash.expanded ? 1 : 0.45,
              transition: `opacity ${HEART_EXPAND_MS}ms ease-out`,
            }}
          />
          <div
            className="absolute"
            style={{
              width: HEART_BASE_SIZE_STYLE,
              height: HEART_BASE_SIZE_STYLE,
              left: heartSplash.expanded ? '50vw' : heartSplash.x,
              top: heartSplash.expanded ? '50vh' : heartSplash.y,
              transform: `translate(-50%, -50%) scale(${heartSplash.expanded ? heartSplash.fitScale : 1})`,
              transition: `left ${HEART_EXPAND_MS}ms cubic-bezier(0.16,1,0.3,1), top ${HEART_EXPAND_MS}ms cubic-bezier(0.16,1,0.3,1), transform ${HEART_EXPAND_MS}ms cubic-bezier(0.16,1,0.3,1)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(50% 92%, 9% 52%, 9% 30%, 26% 13%, 50% 25%, 74% 13%, 91% 30%, 91% 52%)',
                background: 'linear-gradient(145deg, rgba(255,183,211,0.98) 0%, rgba(247,85,144,0.98) 56%, rgba(193,28,98,0.98) 100%)',
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center text-center"
              style={{
                clipPath: 'polygon(50% 92%, 9% 52%, 9% 30%, 26% 13%, 50% 25%, 74% 13%, 91% 30%, 91% 52%)',
                padding: '0 18%',
                opacity: heartSplash.expanded ? 1 : 0,
                transition: `opacity ${HEART_EXPAND_MS}ms ease-out`,
              }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.78, y: 8 }}
                animate={heartSplash.expanded
                  ? { opacity: [0.12, 1, 1, 1], scale: [0.78, 1, 1.08, 1], y: [8, 0, -1, 0] }
                  : { opacity: 0, scale: 0.78, y: 8 }}
                transition={heartSplash.expanded
                  ? { duration: HEART_TOTAL_MS / 1000, times: [0, 0.2, 0.72, 1], ease: 'easeInOut' }
                  : { duration: 0.2 }}
                className="login-heart-copy"
              >
                👸💃Meri Anya &lt;3 ❤️ Ayrin 🕺🤴
              </motion.span>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .login-shell {
          background:
            radial-gradient(
              ellipse 86% 56% at 50% 4%,
              rgba(255, 213, 233, 0.66) 0%,
              rgba(95, 45, 82, 0.54) 32%,
              rgba(22, 8, 20, 0.96) 64%,
              #05030a 100%
            );
        }

        .login-card {
          background: linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%);
          border-color: rgba(244, 173, 210, 0.28);
          box-shadow: 0 36px 74px rgba(0, 0, 0, 0.56), 0 16px 34px rgba(247, 85, 144, 0.22);
        }

        .login-kicker {
          font-family: var(--font-dm-mono);
          color: rgba(255, 193, 223, 0.78);
          font-size: 0.62rem;
        }

        .login-title {
          font-family: var(--font-cormorant);
          color: rgba(255, 236, 246, 0.98);
          font-size: clamp(2rem, 5vw, 3.4rem);
          line-height: 1.12;
          font-weight: 400;
        }

        .login-copy {
          color: rgba(255, 210, 230, 0.84);
          font-family: var(--font-crimson);
          font-size: clamp(1rem, 2.2vw, 1.2rem);
          line-height: 1.6;
        }

        .login-password-input {
          border-color: rgba(244, 173, 210, 0.4);
          color: rgba(255, 220, 240, 0.95);
          font-family: var(--font-dm-mono);
          font-size: 0.8rem;
          letter-spacing: 0.1em;
        }

        .login-password-input::placeholder {
          color: rgba(255, 188, 216, 0.6);
        }

        .login-error {
          color: rgba(255, 130, 160, 0.9);
          font-family: var(--font-crimson);
        }

        .login-cta {
          background: linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95));
          color: #fff;
          font-family: var(--font-dm-mono);
          font-size: 0.76rem;
          letter-spacing: 0.04em;
          box-shadow: 0 10px 28px rgba(247, 85, 144, 0.28);
          cursor: pointer;
          transition: opacity 220ms ease;
        }

        .login-cta:disabled {
          cursor: wait;
          opacity: 0.84;
        }

        .login-heart-copy {
          font-family: var(--font-cormorant);
          font-size: 1.9rem;
          line-height: 1.05;
          color: rgba(255, 247, 252, 0.98);
          text-shadow: 0 0 3px rgba(140, 22, 72, 0.6), 0 0 10px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </main>
  );
}

// ─── Page export — wraps inner in Suspense for useSearchParams ───────────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
