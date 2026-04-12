'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import { stageVariants, EASE_SOFT } from '@/lib/animations';
import { ENDING_CONTENT } from '@/lib/messages';

// ─── EndingStage ──────────────────────────────────────────────────────────────

export function EndingStage() {
  const goToStage = useAppStore((s) => s.goToStage);
  const [heartScale, setHeartScale] = useState(1);
  const [clickCount, setClickCount] = useState(0);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleHeartClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setHeartScale(1.26);
    setClickCount((c) => c + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSparkles((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setHeartScale(1);
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 550);
  }, []);

  const clickMessages = [
    'You are deeply loved.',
    'Thank you for staying with this.',
    'I mean every word here.',
    'Always choosing you.',
  ];

  return (
    <motion.div
      key="ending"
      variants={stageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stage-root"
    >
      <div className="flex w-full max-w-[440px] flex-col items-center gap-14 text-center">
        {/* Soft decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: 1,
            opacity: 0.3,
            transition: { duration: 1.8, delay: 0.5, ease: EASE_SOFT },
          }}
          style={{
            height: '1px',
            width: '60px',
            background: 'linear-gradient(to right, transparent, var(--accent-dim), transparent)',
          }}
        />

        {/* Main sign-off */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 2, delay: 1, ease: EASE_SOFT },
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
          >
            {ENDING_CONTENT.finalLine}
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45, transition: { duration: 1.6, delay: 2.4 } }}
            style={{
              fontFamily: 'var(--font-crimson)',
              fontWeight: 300,
              fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            — with honesty
          </motion.p>
        </motion.div>

        {/* Interactive heart */}
        <motion.div
          className="relative flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.2, delay: 2.7 } }}
        >
          <button
            onClick={handleHeartClick}
            aria-label="Send love"
            style={{
              fontSize: '4.8rem',
              lineHeight: 1,
              color: 'var(--accent-dim)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transform: `scale(${heartScale})`,
              transition: 'transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: 'drop-shadow(0 10px 24px rgba(247, 85, 144, 0.35))',
              animation: 'panda-pulse 1.7s ease-in-out infinite',
            }}
          >
            ♡
            {sparkles.map((sparkle) => (
              <span
                key={sparkle.id}
                style={{
                  position: 'absolute',
                  left: sparkle.x,
                  top: sparkle.y,
                  fontSize: '1rem',
                  transform: 'translate(-50%, -50%)',
                  animation: 'ending-sparkle-out 600ms ease-out forwards',
                  pointerEvents: 'none',
                  color: 'var(--accent)',
                }}
              >
                ✦
              </span>
            ))}
          </button>

          {clickCount > 0 && (
            <motion.p
              key={clickCount}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.75, y: 0, transition: { duration: 0.35 } }}
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
              }}
            >
              {clickMessages[Math.min(clickCount - 1, clickMessages.length - 1)]}
            </motion.p>
          )}
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.5, delay: 3.2 } }}
        >
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 1.0,
                delay: 3.2,
                ease: EASE_SOFT,
              },
            }}
            onClick={() => goToStage('opening')}
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.13em',
              color: '#fff',
              textTransform: 'uppercase',
              border: '1px solid rgba(247, 85, 144, 0.7)',
              padding: '0.65rem 1.8rem',
              borderRadius: '999px',
              cursor: 'pointer',
              background: 'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
              boxShadow: '0 8px 24px rgba(247, 85, 144, 0.28)',
            }}
          >
            read again
          </motion.button>

          {ENDING_CONTENT.buttons.map((btn, index) => (
            <motion.button
              key={btn.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1.0,
                  delay: 3.6 + index * 0.35,
                  ease: EASE_SOFT,
                },
              }}
              whileHover={{ opacity: 0.9 }}
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                background: 'none',
                border: '1px solid rgba(247, 85, 144, 0.2)',
                padding: '0.6rem 1.8rem',
                borderRadius: '2px',
                cursor: 'default',
                opacity: 0.55,
              }}
            >
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Very bottom — a small mark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18, transition: { duration: 2, delay: 5 } }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.14em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          this moment was made with care
        </motion.div>
      </div>

      <style>{`
        @keyframes ending-sparkle-out {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -200%) scale(0.35); }
        }
      `}</style>
    </motion.div>
  );
}
