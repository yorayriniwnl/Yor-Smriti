'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ApologyExperienceShellProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  footer?: string;
  screenNumber: number;
  totalScreens: number;
  showHeader?: boolean;
  showTopControls?: boolean;
  panelClassName?: string;
  contentClassName?: string;
}

export function ApologyExperienceShell({
  children,
  eyebrow,
  title,
  subtitle,
  footer,
  screenNumber,
  totalScreens,
  showHeader = true,
  showTopControls = true,
  panelClassName,
  contentClassName,
}: ApologyExperienceShellProps) {
  return (
    <main
      id="main-content"
      className="relative flex min-h-dvh w-dvw items-center justify-center overflow-auto px-4 py-8"
      style={{
        background:
          'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(250, 95, 161, 0.17) 0%, rgba(8, 4, 8, 0.94) 62%, #020103 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 12% 18%, rgba(255, 170, 201, 0.2), transparent 34%), radial-gradient(circle at 84% 80%, rgba(255, 235, 185, 0.14), transparent 34%)',
        }}
      />

      {showTopControls ? (
        <div className="absolute left-4 top-4 z-20 flex items-center gap-2 sm:left-6 sm:top-6">
          <Link
            href="/"
            className="rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.13em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              color: 'rgba(255, 239, 247, 0.86)',
              borderColor: 'rgba(255, 210, 228, 0.4)',
              backgroundColor: 'rgba(255, 145, 189, 0.14)',
            }}
          >
            Home
          </Link>

          <span
            className="rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.13em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              color: 'rgba(255, 239, 247, 0.86)',
              borderColor: 'rgba(255, 210, 228, 0.35)',
              backgroundColor: 'rgba(26, 10, 18, 0.55)',
            }}
          >
            Screen {screenNumber}/{totalScreens}
          </span>
        </div>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={
          panelClassName ??
          'relative w-full max-w-[29.5rem] overflow-hidden rounded-[2rem] border pb-5 pt-6'
        }
        style={{
          borderColor: 'rgba(245, 198, 222, 0.72)',
          background:
            'linear-gradient(180deg, rgba(255, 244, 250, 0.98) 0%, rgba(255, 238, 246, 0.97) 50%, rgba(255, 246, 231, 0.97) 100%)',
          boxShadow:
            '0 46px 80px rgba(0, 0, 0, 0.58), 0 12px 30px rgba(247, 85, 144, 0.2)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            opacity: 0.22,
            backgroundImage:
              'repeating-linear-gradient(to right, rgba(217, 166, 193, 0.5) 0px, rgba(217, 166, 193, 0.5) 1px, transparent 1px, transparent 18px)',
          }}
        />

        <div
          className="pointer-events-none absolute right-8 top-5 h-11 w-20 rounded-full"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(180deg, rgba(190, 240, 244, 0.95), rgba(162, 219, 227, 0.95))',
            boxShadow: 'inset 0 -8px 12px rgba(255, 255, 255, 0.35)',
          }}
        >
          <span
            className="absolute -left-2 top-4 h-5 w-5 rounded-full"
            style={{ backgroundColor: 'rgba(182, 236, 242, 0.95)' }}
          />
          <span
            className="absolute right-1 top-[-6px] h-6 w-6 rounded-full"
            style={{ backgroundColor: 'rgba(173, 228, 235, 0.95)' }}
          />
        </div>

        {showHeader ? (
          <header className="relative z-10 px-8 pb-6 pt-6 text-center">
            <p
              className="mb-1 uppercase tracking-[0.12em]"
              style={{
                color: 'rgba(189, 112, 144, 0.86)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.62rem',
              }}
            >
              {eyebrow}
            </p>

            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: '#c93a7c',
                fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h1>

            <p
              className="mx-auto mt-2 max-w-[32ch]"
              style={{
                color: 'rgba(140, 78, 105, 0.9)',
                fontFamily: 'var(--font-crimson)',
                fontSize: '1rem',
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </p>
          </header>
        ) : null}

        <div className={contentClassName ?? 'relative z-10 px-4 sm:px-5'}>{children}</div>

        {footer ? (
          <p
            className="relative z-10 mt-6 px-8 text-center"
            style={{
              color: 'rgba(174, 95, 127, 0.82)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.02em',
            }}
          >
            {footer}
          </p>
        ) : null}
      </motion.section>
    </main>
  );
}
