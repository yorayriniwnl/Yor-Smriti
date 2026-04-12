'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ApologyExperienceShell } from '@/components/experiences/panda/ApologyExperienceShell';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const CONFETTI = [
  { left: '10%', color: '#f26da9', delay: 0.1, duration: 2.1, rotate: 12 },
  { left: '22%', color: '#f0c252', delay: 0.3, duration: 2.3, rotate: -24 },
  { left: '35%', color: '#8ec8ff', delay: 0.5, duration: 2.0, rotate: 38 },
  { left: '48%', color: '#f26da9', delay: 0.2, duration: 2.4, rotate: -12 },
  { left: '62%', color: '#86d8a4', delay: 0.6, duration: 2.2, rotate: 30 },
  { left: '76%', color: '#f0c252', delay: 0.4, duration: 2.5, rotate: -28 },
  { left: '89%', color: '#f26da9', delay: 0.15, duration: 2.15, rotate: 20 },
];

export function Screen03ClearCut() {
  return (
    <ApologyExperienceShell
      screenNumber={3}
      totalScreens={8}
      eyebrow="Confirmation"
      title="Clear Cut"
      subtitle="A better choice, this time."
      footer="No more silence."
      showHeader={false}
      showTopControls={false}
      panelClassName="relative w-full max-w-[24rem] overflow-hidden rounded-[2.2rem] border pb-5 pt-8"
      contentClassName="relative z-10 px-3"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.82, ease: EASE_SOFT }}
        className="relative text-center"
      >
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: '#d6367d',
            fontSize: 'clamp(2rem, 8vw, 2.65rem)',
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          We Cut Through It.
        </h2>

        <p
          className="mt-1"
          style={{
            color: 'rgba(125, 82, 105, 0.92)',
            fontFamily: 'var(--font-crimson)',
            fontSize: '1.02rem',
          }}
        >
          Let this be the first honest step back to us.
        </p>

        <div className="pointer-events-none absolute inset-x-0 -top-2 h-12" aria-hidden="true">
          {CONFETTI.map((piece, index) => (
            <motion.span
              key={index}
              className="absolute top-0 block rounded-sm"
              style={{
                left: piece.left,
                width: '7px',
                height: '7px',
                backgroundColor: piece.color,
              }}
              animate={{ y: [0, 22, 42], opacity: [0, 1, 0], rotate: [piece.rotate, piece.rotate + 120] }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                repeat: Infinity,
                repeatDelay: 1.6,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      <section
        className="relative mt-5 overflow-hidden rounded-[1.55rem] border px-4 pb-6 pt-5"
        style={{
          borderColor: 'rgba(236, 195, 213, 0.85)',
          background:
            'linear-gradient(180deg, rgba(255, 252, 244, 0.95) 0%, rgba(255, 246, 232, 0.96) 100%)',
          boxShadow: '0 14px 34px rgba(212, 92, 143, 0.16)',
        }}
      >
        <div className="text-center">
          <h3
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 600,
              color: 'rgba(55, 36, 43, 0.95)',
              fontSize: 'clamp(1.4rem, 5.1vw, 1.8rem)',
              lineHeight: 1.16,
            }}
          >
            Perfectly clear.
          </h3>

          <p
            className="mx-auto mt-2 max-w-[29ch]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.03em',
              color: 'rgba(133, 95, 114, 0.9)',
            }}
          >
            I choose truth, repair, and patience.
          </p>
        </div>

        <div className="relative mx-auto mt-4 h-[15rem] w-full max-w-[19rem]">
          <div
            className="pointer-events-none absolute bottom-2 left-1/2 h-5 w-[95%] -translate-x-1/2 rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(220, 223, 229, 0.98), rgba(201, 204, 212, 0.98))',
              boxShadow: '0 8px 22px rgba(0, 0, 0, 0.2)',
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute bottom-5 left-1/2 h-[9.9rem] w-[91%] -translate-x-1/2 overflow-hidden rounded-[46%] border"
            style={{
              borderColor: 'rgba(146, 80, 50, 0.55)',
              background:
                'linear-gradient(180deg, rgba(173, 92, 46, 0.96) 0%, rgba(140, 67, 35, 0.98) 56%, rgba(111, 50, 24, 0.98) 100%)',
            }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-x-0 top-0 h-[42%] rounded-b-[45%]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255, 241, 244, 0.97) 0%, rgba(248, 223, 203, 0.95) 68%, rgba(239, 198, 161, 0.92) 100%)',
              }}
            />

            <div
              className="absolute left-0 top-[35%] h-[2px] w-full rounded-full bg-[#f087b8]"
              style={{ opacity: 0.95 }}
            />

            <motion.div
              className="absolute left-0 top-[24%] h-[16%] w-[52%] rounded-r-full"
              initial={{ x: 0 }}
              animate={{ x: -6 }}
              transition={{ duration: 0.35, ease: EASE_SOFT }}
              style={{ background: 'rgba(255, 247, 230, 0.62)' }}
            />

            <motion.div
              className="absolute right-0 top-[24%] h-[16%] w-[52%] rounded-l-full"
              initial={{ x: 0 }}
              animate={{ x: 6 }}
              transition={{ duration: 0.35, ease: EASE_SOFT }}
              style={{ background: 'rgba(255, 247, 230, 0.52)' }}
            />
          </div>

          <div
            className="pointer-events-none absolute bottom-[11.9rem] left-1/2 h-11 w-5 -translate-x-1/2 rounded-md"
            style={{
              background: 'linear-gradient(180deg, #ff5fab 0%, #eb2f86 100%)',
              boxShadow: '0 4px 10px rgba(235, 47, 134, 0.28)',
            }}
            aria-hidden="true"
          >
            <div
              className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(255, 208, 109, 0.95) 0%, rgba(255, 117, 62, 0.95) 70%)',
                filter: 'drop-shadow(0 0 7px rgba(255, 145, 82, 0.5))',
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_SOFT }}
            className="absolute inset-x-6 top-[34%] rounded-2xl border px-4 py-3 text-center"
            style={{
              borderColor: 'rgba(245, 190, 216, 0.8)',
              background: 'rgba(255, 243, 249, 0.9)',
              boxShadow: '0 10px 18px rgba(211, 126, 171, 0.22)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.8rem',
                lineHeight: 1,
                color: '#d23f86',
              }}
            >
              Clear Cut.
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: '1rem',
                lineHeight: 1.3,
                color: 'rgba(122, 64, 92, 0.95)',
              }}
            >
              I choose us over ego, every single time.
            </p>
          </motion.div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-3">
          <Link
            href="/apology/2"
            className="inline-flex items-center justify-center rounded-full border px-5 py-3"
            style={{
              borderColor: 'rgba(245, 190, 216, 0.66)',
              color: 'rgba(129, 74, 100, 0.94)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.66rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Back
          </Link>

          <Link
            href="/apology/4"
            className="inline-flex items-center justify-center rounded-full px-8 py-3"
            style={{
              background:
                'linear-gradient(90deg, rgba(255, 93, 166, 0.98), rgba(244, 53, 139, 0.98))',
              color: '#fff',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.74rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 12px 24px rgba(245, 63, 149, 0.26)',
            }}
          >
            Continue
          </Link>
        </div>
      </section>
    </ApologyExperienceShell>
  );
}
