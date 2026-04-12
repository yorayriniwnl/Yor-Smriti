'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { RainLayer } from '@/components/background/RainLayer';

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
  mainClassName?: string;
  mainStyle?: CSSProperties;
  panelStyle?: CSSProperties;
  showAtmosphereLayers?: boolean;
  showDecorativePill?: boolean;
  showRainLayer?: boolean;
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
  mainClassName,
  mainStyle,
  panelStyle,
  showAtmosphereLayers = true,
  showDecorativePill = true,
  showRainLayer = false,
}: ApologyExperienceShellProps) {
  return (
    <main
      id="main-content"
      className={
        mainClassName ??
        'relative flex min-h-dvh w-dvw items-center justify-center overflow-auto px-4 py-8'
      }
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
        ...mainStyle,
      }}
    >
      {showAtmosphereLayers ? (
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 15% 18%, rgba(255, 196, 224, 0.18), transparent 36%), radial-gradient(circle at 84% 80%, rgba(255, 230, 171, 0.1), transparent 36%)',
          }}
        />
      ) : null}

      {showRainLayer ? <RainLayer /> : null}

      {showTopControls ? (
        <div className="absolute left-4 top-4 z-20 flex items-center gap-2 sm:left-6 sm:top-6">
          <Link
            href="/"
            className="rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.13em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              color: 'rgba(255, 225, 240, 0.88)',
              borderColor: 'rgba(255, 181, 213, 0.34)',
              backgroundColor: 'rgba(255, 145, 189, 0.1)',
            }}
          >
            Home
          </Link>

          <span
            className="rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.13em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              color: 'rgba(255, 225, 240, 0.88)',
              borderColor: 'rgba(255, 181, 213, 0.28)',
              backgroundColor: 'rgba(16, 7, 14, 0.52)',
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
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow:
            '0 36px 74px rgba(0, 0, 0, 0.56), 0 16px 34px rgba(247, 85, 144, 0.22)',
          ...panelStyle,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            opacity: 0.08,
            backgroundImage:
              'repeating-linear-gradient(to right, rgba(255, 196, 224, 0.48) 0px, rgba(255, 196, 224, 0.48) 1px, transparent 1px, transparent 20px)',
          }}
        />

        {showDecorativePill ? (
          <div
            className="pointer-events-none absolute right-8 top-5 h-11 w-20 rounded-full"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(180deg, rgba(251, 160, 203, 0.9), rgba(210, 82, 143, 0.88))',
              boxShadow: 'inset 0 -8px 12px rgba(255, 206, 227, 0.35)',
            }}
          >
            <span
              className="absolute -left-2 top-4 h-5 w-5 rounded-full"
              style={{ backgroundColor: 'rgba(250, 173, 209, 0.95)' }}
            />
            <span
              className="absolute right-1 top-[-6px] h-6 w-6 rounded-full"
              style={{ backgroundColor: 'rgba(236, 128, 184, 0.95)' }}
            />
          </div>
        ) : null}

        {showHeader ? (
          <header className="relative z-10 px-8 pb-6 pt-6 text-center">
            <p
              className="mb-1 uppercase tracking-[0.12em]"
              style={{
                color: 'rgba(255, 193, 223, 0.8)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.62rem',
              }}
            >
              {eyebrow}
            </p>

            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: 'rgba(255, 236, 246, 0.98)',
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
                color: 'rgba(255, 210, 230, 0.84)',
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
              color: 'rgba(255, 195, 225, 0.74)',
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
