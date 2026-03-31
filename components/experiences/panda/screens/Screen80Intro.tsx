'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ApologyExperienceShell } from '@/components/experiences/panda/ApologyExperienceShell';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

export function Screen80Intro() {
  return (
    <ApologyExperienceShell
      screenNumber={80}
      totalScreens={87}
      eyebrow="Private Note"
      title="I Love You. I Am Sorry."
      subtitle="No excuses, only my heart and the truth."
      footer="Made with love, regret, and hope."
      showHeader={false}
      showTopControls={false}
      panelClassName="relative w-full max-w-[24.5rem] overflow-hidden rounded-[2.2rem] border pb-6 pt-8"
      contentClassName="relative z-10 px-2"
    >
      <article className="relative overflow-hidden px-2 pb-2">
        <motion.section
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
          className="relative mx-auto mt-3 w-full max-w-[21.5rem] overflow-hidden rounded-[1.8rem] border"
          style={{
            borderColor: 'rgba(244, 173, 210, 0.35)',
            background:
              'linear-gradient(180deg, rgba(43, 16, 34, 0.95) 0%, rgba(25, 9, 21, 0.98) 100%)',
            boxShadow: '0 18px 36px rgba(0, 0, 0, 0.46), 0 10px 24px rgba(247, 85, 144, 0.2)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(circle at 8% 10%, rgba(255, 203, 229, 0.24), transparent 42%), radial-gradient(circle at 92% 86%, rgba(255, 236, 176, 0.12), transparent 44%)',
            }}
          />

          <div
            className="relative flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: 'rgba(244, 173, 210, 0.24)' }}
          >
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff7da9]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffd573]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#9be8a7]" />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.62rem',
                color: 'rgba(255, 202, 227, 0.84)',
                letterSpacing: '0.08em',
              }}
            >
              First Note
            </p>

            <span
              className="rounded-full border px-2 py-1"
              style={{
                borderColor: 'rgba(244, 173, 210, 0.38)',
                color: 'rgba(255, 226, 241, 0.88)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.58rem',
                letterSpacing: '0.08em',
              }}
            >
              01
            </span>
          </div>

          <div className="relative px-6 pb-8 pt-9 text-center sm:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.06, ease: EASE_SOFT }}
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: 'rgba(255, 232, 244, 0.98)',
                fontSize: 'clamp(2.1rem, 8vw, 2.8rem)',
                lineHeight: 1.05,
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              I love you,
              <br />
              I am sorry.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: EASE_SOFT }}
              className="mx-auto mt-5 max-w-[27ch]"
              style={{
                color: 'rgba(255, 206, 228, 0.9)',
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
                lineHeight: 1.54,
              }}
            >
              I know I hurt you, and I carry that every day. If you let me, I want to make
              things right with actions, patience, and honesty.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.35 }}
              className="mt-7"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.67rem',
                letterSpacing: '0.08em',
                color: 'rgba(255, 171, 210, 0.86)',
              }}
            >
              Will you read this fully?
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.48, ease: EASE_SOFT }}
              className="mt-4 flex items-center justify-center"
            >
              <motion.div whileHover={{ y: -1, scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/apology/2"
                  className="inline-flex items-center justify-center rounded-full px-10 py-3"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(255, 93, 166, 0.98), rgba(244, 53, 139, 0.98))',
                    color: '#fff',
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    boxShadow: '0 12px 24px rgba(245, 63, 149, 0.34)',
                  }}
                >
                  Continue
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </article>
    </ApologyExperienceShell>
  );
}
