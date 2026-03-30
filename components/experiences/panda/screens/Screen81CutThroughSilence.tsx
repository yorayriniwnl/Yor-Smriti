'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ApologyExperienceShell } from '@/components/experiences/panda/ApologyExperienceShell';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function Screen81CutThroughSilence() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0.08);
  const [isDragging, setIsDragging] = useState(false);
  const [isCutComplete, setIsCutComplete] = useState(false);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current || isCutComplete) return;

      const rect = trackRef.current.getBoundingClientRect();
      const rawProgress = (clientX - rect.left) / rect.width;
      const nextProgress = clamp(rawProgress, 0.08, 1);
      setProgress(nextProgress);

      if (nextProgress >= 0.98) {
        setIsCutComplete(true);
        setIsDragging(false);
        setProgress(1);
      }
    },
    [isCutComplete]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      updateFromClientX(event.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      if (!isCutComplete) {
        setProgress(0.08);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, isCutComplete, updateFromClientX]);

  const startDragging = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (isCutComplete) return;
    event.preventDefault();
    setIsDragging(true);
    updateFromClientX(event.clientX);
  };

  const handleHandleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isCutComplete) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setProgress(1);
      setIsCutComplete(true);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setProgress((prev) => {
        const next = clamp(prev + 0.08, 0.08, 1);
        if (next >= 0.98) {
          setIsCutComplete(true);
          return 1;
        }
        return next;
      });
    }
  };

  return (
    <ApologyExperienceShell
      screenNumber={81}
      totalScreens={94}
      eyebrow="Interactive Note"
      title="Cut Through The Silence"
      subtitle="One honest action before words."
      footer="I choose honesty over ego."
      showHeader={false}
      showTopControls={false}
      panelClassName="relative w-full max-w-[24rem] overflow-hidden rounded-[2.2rem] border pb-5 pt-8"
      contentClassName="relative z-10 px-3"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE_SOFT }}
        className="text-center"
      >
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: '#d6367d',
            fontSize: 'clamp(2rem, 8vw, 2.7rem)',
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          It&apos;s Time To Heal.
        </h2>

        <p
          className="mt-1"
          style={{
            color: 'rgba(125, 82, 105, 0.92)',
            fontFamily: 'var(--font-crimson)',
            fontSize: '1.03rem',
          }}
        >
          Let me cut through the silence I created.
        </p>
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
              fontSize: 'clamp(1.45rem, 5.2vw, 1.85rem)',
              lineHeight: 1.18,
            }}
          >
            Cut through the silence between us.
          </h3>

          <p
            className="mx-auto mt-2 max-w-[28ch]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.69rem',
              letterSpacing: '0.03em',
              color: 'rgba(133, 95, 114, 0.9)',
            }}
          >
            Drag across the center to show I am done running away.
          </p>
        </div>

        <div className="relative mx-auto mt-4 h-[15rem] w-full max-w-[19rem] select-none">
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

            <motion.div
              className="absolute left-0 top-[35%] h-[2px] rounded-full bg-[#f087b8]"
              style={{ width: `${progress * 100}%` }}
              animate={{ opacity: isDragging || isCutComplete ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
            />

            <motion.div
              className="absolute left-0 top-[24%] h-[16%] w-[52%] rounded-r-full"
              animate={{ x: isCutComplete ? -6 : 0 }}
              transition={{ duration: 0.35, ease: EASE_SOFT }}
              style={{ background: 'rgba(255, 247, 230, 0.62)' }}
            />

            <motion.div
              className="absolute right-0 top-[24%] h-[16%] w-[52%] rounded-l-full"
              animate={{ x: isCutComplete ? 6 : 0 }}
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

          <div
            ref={trackRef}
            className="absolute left-[8%] right-[8%] top-[34%] h-12"
            aria-hidden="true"
          >
            <motion.button
              type="button"
              onPointerDown={startDragging}
              onKeyDown={handleHandleKeyDown}
              aria-label="Drag to cut through silence"
              className="absolute top-1/2 z-20 -translate-y-1/2 rounded-md border px-3 py-1"
              style={{
                left: `calc(${progress * 100}% - 2.5rem)`,
                borderColor: 'rgba(225, 179, 205, 0.85)',
                background: 'rgba(255, 249, 253, 0.94)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.03em',
                color: 'rgba(161, 93, 126, 0.95)',
                cursor: isCutComplete ? 'default' : 'grab',
                boxShadow: '0 4px 10px rgba(210, 140, 175, 0.2)',
              }}
              whileHover={isCutComplete ? undefined : { y: -1 }}
              animate={
                isCutComplete
                  ? { scale: 0.96, opacity: 0.65 }
                  : { y: [0, -1.5, 0], transition: { duration: 1.4, repeat: Infinity } }
              }
            >
              Drag to cut
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isCutComplete ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_SOFT }}
              className="mt-2 text-center"
            >
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.04rem',
                  color: 'rgba(122, 64, 92, 0.95)',
                }}
              >
                I will cut through my ego, not us.
              </p>

              <Link
                href="/apology/82"
                className="mt-3 inline-flex items-center justify-center rounded-full px-8 py-3"
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </ApologyExperienceShell>
  );
}
