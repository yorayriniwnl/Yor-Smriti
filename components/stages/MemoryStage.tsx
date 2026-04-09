'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import { stageVariants } from '@/lib/animations';
import { MEMORIES } from '@/lib/messages';

// ─── MemoryStage ──────────────────────────────────────────────────────────────

export function MemoryStage() {
  const advanceStage = useAppStore((s) => s.advanceStage);

  const [currentMemoryIndex, setCurrentMemoryIndex] = useState<number>(-1);
  const [isDone, setIsDone] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    // Sequence memories with pauses between them
    let cumulativeDelay = 400;

    MEMORIES.forEach((memory, index) => {
      // Pause before showing
      cumulativeDelay += memory.pauseBefore;

      const showTimer = setTimeout(() => {
        setCurrentMemoryIndex(index);
      }, cumulativeDelay);
      timersRef.current.push(showTimer);

      // Pause while showing, then hide before next
      cumulativeDelay += 3200 + memory.pauseAfter;

      // Hide (except last)
      if (index < MEMORIES.length - 1) {
        const hideTimer = setTimeout(() => {
          setCurrentMemoryIndex(-1);
        }, cumulativeDelay - 1200);
        timersRef.current.push(hideTimer);
      }
    });

    // All done
    const doneTimer = setTimeout(() => {
      setIsDone(true);
      setShowContinue(true);
    }, cumulativeDelay + 1000);
    timersRef.current.push(doneTimer);
  }, []);

  return (
    <motion.div
      key="memory"
      variants={stageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stage-root"
    >
      <div className="flex w-full flex-col items-center gap-8">
        {/* Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35, transition: { duration: 1.5, delay: 0.5 } }}
          className="flex items-center gap-2"
        >
          {MEMORIES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-700"
              style={{
                width: currentMemoryIndex === i ? '16px' : '4px',
                height: '4px',
                backgroundColor:
                  currentMemoryIndex === i
                    ? 'var(--accent-dim)'
                    : 'var(--text-muted)',
                opacity: currentMemoryIndex >= i ? 1 : 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* Memory text area (card visuals removed) */}
        <div className="relative flex h-[320px] w-full max-w-[420px] items-center justify-center">
          <AnimatePresence mode="wait">
            {currentMemoryIndex >= 0 && (
              <motion.div
                key={MEMORIES[currentMemoryIndex].id}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.4 } }}
                exit={{ opacity: 0, transition: { duration: 0.8 } }}
              >
                <div className="px-3 text-center">
                  <p className="text-4xl italic text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {MEMORIES[currentMemoryIndex].caption}
                  </p>
                  <p className="mt-3 text-xl text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-crimson)' }}>
                    {MEMORIES[currentMemoryIndex].subCaption}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state placeholder while between lines */}
          {currentMemoryIndex < 0 && !isDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              className="flex items-center justify-center"
            >
              <div
                style={{
                  width: '1px',
                  height: '32px',
                  background: 'linear-gradient(to bottom, transparent, var(--accent-dim), transparent)',
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Continue button */}
        <AnimatePresence>
          {showContinue && (
            <motion.div
              key="continue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 1.2, delay: 0.4 } }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={advanceStage}
                className="group flex items-center gap-3 outline-none"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    transition: 'color 0.4s ease',
                  }}
                  className="group-hover:text-[var(--text-secondary)]"
                >
                  I want to say something
                </span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: 'var(--accent-dim)', fontSize: '0.7rem', opacity: 0.7 }}
                >
                  →
                </motion.span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
