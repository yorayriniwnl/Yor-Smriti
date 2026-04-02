'use client';

import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface HeartSplashState {
  active: boolean;
  expanded: boolean;
  x: number;
  y: number;
  fitScale: number;
}

const HEART_EXPAND_MS = 2100;
const HEART_HOLD_MS = 2900;
const HEART_TOTAL_MS = HEART_EXPAND_MS + HEART_HOLD_MS;
const HEART_BASE_SIZE_FALLBACK = 64;
const HEART_BASE_SIZE_STYLE = 'var(--heart-base-size, 64px)';

function resolveHeartBaseSizePx() {
  if (typeof window === 'undefined') {
    return HEART_BASE_SIZE_FALLBACK;
  }

  const cssValue = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--heart-base-size')
    .trim();
  const parsed = Number.parseFloat(cssValue);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return HEART_BASE_SIZE_FALLBACK;
  }

  return parsed;
}

export default function HomePage() {
  const router = useRouter();
  const redirectTimerRef = useRef<number | null>(null);
  const [heartSplash, setHeartSplash] = useState<HeartSplashState>({
    active: false,
    expanded: false,
    x: 0,
    y: 0,
    fitScale: 1,
  });

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const startHeartTransition = (event: MouseEvent<HTMLButtonElement>) => {
    if (heartSplash.active) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX > 0 ? event.clientX : rect.left + rect.width / 2;
    const y = event.clientY > 0 ? event.clientY : rect.top + rect.height / 2;
    const viewportFitSize = Math.min(window.innerWidth, window.innerHeight) * 0.92;
    const fitScale = Math.max(1, viewportFitSize / resolveHeartBaseSizePx());

    setHeartSplash({
      active: true,
      expanded: false,
      x,
      y,
      fitScale,
    });

    window.requestAnimationFrame(() => {
      setHeartSplash((current) => ({ ...current, expanded: true }));
    });

    redirectTimerRef.current = window.setTimeout(() => {
      router.push('/message');
    }, HEART_TOTAL_MS);
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
      <section
        className="relative z-10 w-full max-w-2xl rounded-3xl border px-6 py-10 text-center md:px-12"
        style={{
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          borderColor: 'rgba(244, 173, 210, 0.28)',
          boxShadow:
            '0 36px 74px rgba(0, 0, 0, 0.56), 0 16px 34px rgba(247, 85, 144, 0.22)',
        }}
      >
        <p
          className="mb-3 uppercase tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 193, 223, 0.78)',
            fontSize: '0.62rem',
          }}
        >
          relationship repair note
        </p>

        <h1
          className="mb-4"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 236, 246, 0.98)',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            lineHeight: 1.12,
            fontWeight: 400,
          }}
        >
            Anya are you mad at Ayrin ?
        </h1>

        <p
          className="mx-auto mb-8 max-w-[46ch]"
          style={{
            color: 'rgba(255, 210, 230, 0.84)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            lineHeight: 1.6,
          }}
        >
          Wana see how much I love you ?
        </p>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={startHeartTransition}
            disabled={heartSplash.active}
            className="inline-flex items-center justify-center rounded-full px-9 py-3"
            style={{
              background:
                'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
              color: '#fff',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.76rem',
              letterSpacing: '0.04em',
              boxShadow: '0 10px 28px rgba(247, 85, 144, 0.28)',
              cursor: heartSplash.active ? 'wait' : 'pointer',
              opacity: heartSplash.active ? 0.84 : 1,
              transition: 'opacity 220ms ease',
            }}
          >
            Are you ready for it baby ?
          </button>
        </div>
      </section>

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
              transformOrigin: 'center',
              transition: `left ${HEART_EXPAND_MS}ms cubic-bezier(0.16, 1, 0.3, 1), top ${HEART_EXPAND_MS}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${HEART_EXPAND_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${HEART_EXPAND_MS}ms ease-out`,
              opacity: heartSplash.expanded ? 0.98 : 1,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath:
                  'polygon(50% 92%, 9% 52%, 9% 30%, 26% 13%, 50% 25%, 74% 13%, 91% 30%, 91% 52%)',
                background:
                  'linear-gradient(145deg, rgba(255, 183, 211, 0.98) 0%, rgba(247, 85, 144, 0.98) 56%, rgba(193, 28, 98, 0.98) 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                clipPath:
                  'polygon(50% 92%, 9% 52%, 9% 30%, 26% 13%, 50% 25%, 74% 13%, 91% 30%, 91% 52%)',
                background:
                  'radial-gradient(circle at 50% 22%, rgba(255, 235, 245, 0.7), rgba(255, 235, 245, 0))',
                filter: 'blur(8px)',
              }}
            />

            <div
              className="absolute inset-0 flex items-center justify-center text-center"
              style={{
                clipPath:
                  'polygon(50% 92%, 9% 52%, 9% 30%, 26% 13%, 50% 25%, 74% 13%, 91% 30%, 91% 52%)',
                padding: '0 18%',
                opacity: heartSplash.expanded ? 1 : 0.25,
                transition: `opacity ${HEART_EXPAND_MS}ms ease-out`,
              }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.78, y: 8 }}
                animate={
                  heartSplash.expanded
                    ? {
                      opacity: [0.12, 1, 1, 1],
                      scale: [0.78, 1, 1.08, 1],
                      y: [8, 0, -1, 0],
                    }
                    : { opacity: 0, scale: 0.78, y: 8 }
                }
                transition={
                  heartSplash.expanded
                    ? {
                      duration: HEART_TOTAL_MS / 1000,
                      times: [0, 0.2, 0.72, 1],
                      ease: 'easeInOut',
                    }
                    : { duration: 0.2 }
                }
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.9rem',
                  lineHeight: 1.05,
                  letterSpacing: '0.01em',
                  color: 'rgba(255, 247, 252, 0.98)',
                  textShadow: '0 0 3px rgba(140, 22, 72, 0.6), 0 0 10px rgba(255, 255, 255, 0.3)',
                }}
              >
                👸💃Anya ❤️ Ayrin 🕺🤴
              </motion.span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}