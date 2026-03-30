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
      panelClassName="relative w-full max-w-[24rem] overflow-hidden rounded-[2.2rem] border pb-5 pt-8"
      contentClassName="relative z-10 px-0"
    >
      <article
        className="relative overflow-hidden px-3 pb-2"
      >
        <div
          className="pointer-events-none absolute inset-x-3 top-4 h-[8.5rem] rounded-[1.55rem]"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 247, 252, 0.95) 0%, rgba(248, 226, 239, 0.7) 100%)',
          }}
        />

        <motion.section
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
          className="relative mx-auto mt-5 w-full max-w-[20.6rem] overflow-hidden rounded-[1.7rem] border pb-7"
          style={{
            borderColor: 'rgba(236, 195, 213, 0.88)',
            background:
              'linear-gradient(180deg, rgba(255, 252, 253, 0.96) 0%, rgba(255, 246, 251, 0.97) 100%)',
            boxShadow: '0 14px 34px rgba(212, 92, 143, 0.2)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(circle at 10% 12%, rgba(255, 255, 255, 0.95), transparent 48%), radial-gradient(circle at 88% 76%, rgba(255, 220, 239, 0.45), transparent 40%)',
            }}
          />

          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: 'rgba(234, 203, 221, 0.76)' }}
          >
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#ff7da9]" />
              <span className="h-3 w-3 rounded-full bg-[#ffd573]" />
              <span className="h-3 w-3 rounded-full bg-[#9be8a7]" />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.62rem',
                color: 'rgba(168, 95, 127, 0.95)',
                letterSpacing: '0.08em',
              }}
            >
              A Quiet Confession
            </p>

            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border"
              style={{
                borderColor: 'rgba(237, 194, 214, 0.72)',
                background:
                  'radial-gradient(circle at 30% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 220, 235, 0.95) 45%, rgba(252, 170, 205, 0.95) 100%)',
              }}
              aria-hidden="true"
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>o</span>
            </div>
          </div>

          <div className="relative px-6 pt-8 text-center sm:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.06, ease: EASE_SOFT }}
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: '#d6367d',
                fontSize: 'clamp(2.1rem, 8vw, 2.8rem)',
                lineHeight: 1.04,
                fontWeight: 700,
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
              className="mx-auto mt-5 max-w-[26ch]"
              style={{
                color: 'rgba(115, 74, 96, 0.95)',
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
                lineHeight: 1.52,
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
                color: 'rgba(196, 92, 133, 0.9)',
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
                  href="/apology/81"
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

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_SOFT }}
            className="pointer-events-none absolute -bottom-4 left-2 flex h-16 w-16 items-center justify-center rounded-full border"
            style={{
              borderColor: 'rgba(238, 187, 211, 0.7)',
              background:
                'radial-gradient(circle at 35% 20%, rgba(255, 255, 255, 0.94) 0%, rgba(242, 220, 227, 0.96) 56%, rgba(225, 182, 194, 0.96) 100%)',
            }}
            aria-hidden="true"
          >
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>x</span>
          </motion.div>

          <div
            className="pointer-events-none absolute right-2 top-28 flex h-8 w-8 items-center justify-center rounded-full border"
            aria-hidden="true"
            style={{
              borderColor: 'rgba(233, 178, 206, 0.7)',
              backgroundColor: 'rgba(255, 241, 248, 0.92)',
              color: 'rgba(199, 108, 148, 0.9)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
            }}
          >
            01
          </div>
        </motion.section>

        <div
          className="pointer-events-none absolute right-8 top-2 h-10 w-16 rounded-full"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(180deg, rgba(190, 240, 244, 0.95), rgba(162, 219, 227, 0.95))',
            boxShadow: 'inset 0 -8px 12px rgba(255, 255, 255, 0.35)',
          }}
        >
          <span
            className="absolute -left-2 top-3 h-4 w-4 rounded-full"
            style={{ backgroundColor: 'rgba(182, 236, 242, 0.95)' }}
          />
          <span
            className="absolute right-0 top-[-5px] h-5 w-5 rounded-full"
            style={{ backgroundColor: 'rgba(173, 228, 235, 0.95)' }}
          />
        </div>
      </article>
    </ApologyExperienceShell>
  );
}
