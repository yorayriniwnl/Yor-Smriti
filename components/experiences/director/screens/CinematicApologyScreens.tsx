'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

type WeightLine = {
  id: string;
  text: string;
  delay: number;
  emphasis?: boolean;
};

type LetterParagraph = {
  id: string;
  text: string;
  delay: number;
  style?: 'salutation' | 'signature';
};

const MISS_ITEMS = [
  {
    id: 'miss-1',
    emoji: '🌙',
    text: 'Our 10 AM to 10 PM texts.',
    sub: 'The random ones that made me smile.',
    color: 'rgba(200, 160, 220, 0.18)',
    delay: 0.1,
  },
  {
    id: 'miss-2',
    emoji: '☕',
    text: 'How you used to call me Ayrin.',
    sub: 'No one else says it like that.',
    color: 'rgba(255, 180, 140, 0.15)',
    delay: 0.7,
  },
  {
    id: 'miss-3',
    emoji: '🎵',
    text: "The videocalls, I still remember your face so clearly as if it's next to me.",
    sub: 'I still listen to it.',
    color: 'rgba(140, 200, 255, 0.14)',
    delay: 1.4,
  },
  {
    id: 'miss-4',
    emoji: '🌸',
    text: 'The way you laugh and Scream.',
    sub: 'Especially when you try not to.',
    color: 'rgba(255, 160, 190, 0.17)',
    delay: 2.1,
  },
  {
    id: 'miss-5',
    emoji: '✨',
    text: 'You, simply existing near me.',
    sub: undefined,
    color: 'rgba(255, 215, 140, 0.15)',
    delay: 2.8,
  },
] as const;

const WEIGHT_LINES: WeightLine[] = [
  { id: 'l1', text: 'I chose silence when you needed words.', delay: 0.6 },
  { id: 'l2', text: 'I made you feel small. That was never okay.', delay: 1.8 },
  { id: 'l3', text: 'I let my ego sit where my love should have been.', delay: 3.2 },
  {
    id: 'l4',
    text: 'That is the weight I carry now. Every single day.',
    delay: 4.8,
    emphasis: true,
  },
] as const;

const PROMISES = [
  { id: 'p1', text: 'I will listen. Fully. Without preparing my reply.', icon: '👂' },
  { id: 'p2', text: 'I will choose you over my pride. Every time.', icon: '🤝' },
  { id: 'p3', text: 'I will be honest even when it is uncomfortable.', icon: '💬' },
  { id: 'p4', text: 'I will show up for you the way you deserved all along.', icon: '🌹' },
] as const;

const LETTER_PARAGRAPHS: LetterParagraph[] = [
  { id: 'p1', text: 'Anya,', style: 'salutation', delay: 0.3 },
  {
    id: 'p2',
    text: 'I have been carrying this for a while. And I think it is time I stopped hiding it in late-night overthinking and actually gave it to you.',
    delay: 0.9,
  },
  {
    id: 'p3',
    text: 'You are one of the most important people in my life. I ruined something that was beautiful and rare, and I know that. I am not writing this to ask for a reset - I am writing this because you deserve to know exactly where I stand.',
    delay: 2.2,
  },
  {
    id: 'p4',
    text: 'I was wrong. Not in the vague, uncertain way people use when they want credit without changing. I was wrong specifically, knowingly, and I chose myself when I should have chosen us.',
    delay: 3.8,
  },
  {
    id: 'p5',
    text: 'If you ever find it in you to let me try again - I will do it differently. Quietly, consistently, with no grand gestures. Just showing up the way I should have from the start.',
    delay: 5.2,
  },
  {
    id: 'p6',
    text: 'With all the love I have,\n- Ayrin',
    style: 'signature',
    delay: 6.4,
  },
] as const;

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function Screen83WhatIMiss({ onNext, onPrev }: ExperienceScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    MISS_ITEMS.forEach((item) => {
      const timer = setTimeout(() => {
        setVisibleCount((count) => Math.min(count + 1, MISS_ITEMS.length));
      }, item.delay * 1000 + 400);
      timers.push(timer);
    });

    const doneTimer = setTimeout(() => setShowContinue(true), 4600);
    timers.push(doneTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[26rem]" data-nav-ignore="true">
      <div
        className="relative overflow-hidden rounded-[2.2rem] border pb-6 pt-7"
        style={{
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow: '0 36px 74px rgba(0, 0, 0, 0.46), 0 16px 34px rgba(247, 85, 144, 0.16)',
        }}
      >
        <motion.div
          className="mb-4 px-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255, 180, 213, 0.7)',
            }}
          >
            things i miss · still counting
          </p>

          <h2
            className="mt-1"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              color: 'rgba(255, 237, 248, 0.96)',
            }}
          >
            What I Miss About You
          </h2>
        </motion.div>

        <div className="flex flex-col gap-2.5 px-4">
          <AnimatePresence>
            {MISS_ITEMS.slice(0, visibleCount).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -18, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.65, ease: EASE_SOFT }}
                className="flex items-start gap-3 rounded-2xl border px-4 py-3"
                style={{
                  background: item.color,
                  borderColor: 'rgba(255, 190, 224, 0.22)',
                }}
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1.05rem',
                      lineHeight: 1.35,
                      color: 'rgba(255, 242, 250, 0.95)',
                      fontStyle: 'italic',
                    }}
                  >
                    {item.text}
                  </p>

                  {item.sub ? (
                    <p
                      className="mt-0.5"
                      style={{
                        fontFamily: 'var(--font-dm-mono)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.04em',
                        color: 'rgba(255, 200, 228, 0.72)',
                      }}
                    >
                      {item.sub}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleCount < MISS_ITEMS.length ? (
            <motion.div className="flex items-center gap-1.5 px-4 py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: dot * 0.2,
                    ease: 'easeInOut',
                  }}
                  style={{
                    display: 'block',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(255, 180, 213, 0.6)',
                  }}
                />
              ))}
            </motion.div>
          ) : null}
        </div>

        <AnimatePresence>
          {showContinue ? (
            <motion.div
              className="mt-6 flex items-center justify-between gap-3 px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_SOFT }}
            >
              <motion.button
                type="button"
                onClick={onPrev}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 195, 225, 0.68)',
                }}
              >
                ← Back
              </motion.button>

              <motion.button
                type="button"
                onClick={onNext}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full px-5 py-2.5"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(232, 80, 153, 0.92), rgba(200, 60, 130, 0.92))',
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  boxShadow: '0 8px 22px rgba(232, 80, 153, 0.35)',
                }}
              >
                And there is more →
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function Screen84WeightICarry({ onNext, onPrev }: ExperienceScreenProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showContinue, setShowContinue] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;

    WEIGHT_LINES.forEach((line) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.id]);
      }, line.delay * 1000);
      timers.push(timer);
    });

    const doneTimer = setTimeout(() => setShowContinue(true), 7200);
    timers.push(doneTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[26rem]" data-nav-ignore="true">
      <div
        className="relative overflow-hidden rounded-[2.2rem] border pb-6 pt-8"
        style={{
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow: '0 36px 74px rgba(0, 0, 0, 0.46), 0 16px 34px rgba(247, 85, 144, 0.16)',
        }}
      >
        <motion.div
          className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 rounded-full"
          aria-hidden
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(247, 85, 144, 0.4), transparent 70%)',
          }}
        />

        <div className="relative z-10 px-5">
          <motion.p
            className="mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255, 160, 200, 0.7)',
            }}
          >
            what i owe you
          </motion.p>

          <div className="flex flex-col gap-5">
            <AnimatePresence>
              {WEIGHT_LINES.map((line) =>
                visibleLines.includes(line.id) ? (
                  <motion.p
                    key={line.id}
                    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.3, ease: EASE_SOFT }}
                    style={{
                      fontFamily: line.emphasis ? 'var(--font-cormorant)' : 'var(--font-crimson)',
                      fontSize: line.emphasis
                        ? 'clamp(1.3rem, 5vw, 1.7rem)'
                        : 'clamp(1rem, 3.5vw, 1.2rem)',
                      fontStyle: 'italic',
                      lineHeight: 1.45,
                      color: line.emphasis
                        ? 'rgba(255, 175, 210, 0.98)'
                        : 'rgba(255, 230, 242, 0.88)',
                      fontWeight: line.emphasis ? 600 : 400,
                      borderLeft: line.emphasis ? '2px solid rgba(247, 85, 144, 0.6)' : 'none',
                      paddingLeft: line.emphasis ? '0.75rem' : '0',
                    }}
                  >
                    {line.text}
                  </motion.p>
                ) : null,
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showContinue ? (
              <motion.div
                className="mt-8 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: EASE_SOFT }}
              >
                <motion.button
                  type="button"
                  onClick={onPrev}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 195, 225, 0.6)',
                  }}
                >
                  ← Back
                </motion.button>

                <motion.button
                  type="button"
                  onClick={onNext}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full px-5 py-2.5"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(232, 80, 153, 0.92), rgba(200, 60, 130, 0.92))',
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    boxShadow: '0 8px 22px rgba(232, 80, 153, 0.35)',
                  }}
                >
                  My promises →
                </motion.button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function Screen85MyPromises({ onNext, onPrev }: ExperienceScreenProps) {
  const [kept, setKept] = useState<Set<string>>(new Set());
  const allKept = kept.size === PROMISES.length;

  const toggle = useCallback((id: string) => {
    setKept((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <section className="mx-auto w-full max-w-[26rem]" data-nav-ignore="true">
      <div
        className="relative overflow-hidden rounded-[2.2rem] border pb-6 pt-7"
        style={{
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow: '0 36px 74px rgba(0, 0, 0, 0.46), 0 16px 34px rgba(247, 85, 144, 0.16)',
        }}
      >
        <motion.div
          className="mb-5 px-4 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255, 180, 213, 0.7)',
            }}
          >
            tap each promise · i mean every word
          </p>
          <h2
            className="mt-1"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(1.6rem, 6vw, 2.1rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              color: 'rgba(255, 237, 248, 0.96)',
            }}
          >
            What I Promise You
          </h2>
        </motion.div>

        <div className="flex flex-col gap-2.5 px-4">
          {PROMISES.map((promise, index) => {
            const isKept = kept.has(promise.id);
            return (
              <motion.button
                key={promise.id}
                onClick={() => toggle(promise.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: EASE_SOFT }}
                className="flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left"
                style={{
                  background: isKept ? 'rgba(200, 60, 130, 0.22)' : 'rgba(255, 180, 213, 0.07)',
                  borderColor: isKept ? 'rgba(247, 85, 144, 0.55)' : 'rgba(255, 190, 224, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  cursor: 'pointer',
                }}
              >
                <motion.span
                  animate={{ scale: isKept ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.35 }}
                  style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}
                >
                  {isKept ? '✓' : promise.icon}
                </motion.span>
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '1rem',
                    lineHeight: 1.4,
                    color: isKept ? 'rgba(255, 220, 240, 0.98)' : 'rgba(255, 220, 240, 0.78)',
                    fontStyle: 'italic',
                  }}
                >
                  {promise.text}
                </p>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          className="mt-4 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div
            className="relative h-1 overflow-hidden rounded-full"
            style={{ background: 'rgba(255, 190, 224, 0.15)' }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              animate={{ width: `${(kept.size / PROMISES.length) * 100}%` }}
              transition={{ duration: 0.5, ease: EASE_SOFT }}
              style={{
                background:
                  'linear-gradient(90deg, rgba(232, 80, 153, 0.8), rgba(255, 133, 179, 0.9))',
              }}
            />
          </div>

          <p
            className="mt-1.5 text-right"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.06em',
              color: 'rgba(255, 195, 225, 0.55)',
            }}
          >
            {kept.size}/{PROMISES.length} acknowledged
          </p>
        </motion.div>

        <AnimatePresence>
          {allKept ? (
            <motion.div
              className="mt-4 flex items-center justify-between gap-3 px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_SOFT }}
            >
              <motion.button
                type="button"
                onClick={onPrev}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 195, 225, 0.6)',
                }}
              >
                ← Back
              </motion.button>

              <motion.button
                type="button"
                onClick={onNext}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full px-5 py-2.5"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(232, 80, 153, 0.92), rgba(200, 60, 130, 0.92))',
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  boxShadow: '0 8px 22px rgba(232, 80, 153, 0.35)',
                }}
              >
                A letter for you →
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function Screen86ALetter({ onNext, onPrev }: ExperienceScreenProps) {
  const [allRevealed, setAllRevealed] = useState(false);

  return (
    <section className="mx-auto w-full max-w-[26rem]" data-nav-ignore="true">
      <div
        className="relative overflow-hidden rounded-[2.2rem] border pb-6 pt-7"
        style={{
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow: '0 36px 74px rgba(0, 0, 0, 0.46), 0 16px 34px rgba(247, 85, 144, 0.16)',
        }}
      >
        <motion.div
          className="relative mx-4 rounded-xl border px-5 py-5"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
          style={{
            background: 'rgba(255, 248, 252, 0.06)',
            borderColor: 'rgba(255, 190, 220, 0.18)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-5 inset-y-5" aria-hidden>
            {[...Array(8)].map((_, index) => (
              <div
                key={`line-${index}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${index * 14.28}%`,
                  height: '1px',
                  background: 'rgba(255, 180, 215, 0.07)',
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col gap-3.5">
            {LETTER_PARAGRAPHS.map((paragraph, index) => (
              <motion.p
                key={paragraph.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, delay: paragraph.delay, ease: EASE_SOFT }}
                onAnimationComplete={() => {
                  if (index === LETTER_PARAGRAPHS.length - 1) {
                    setAllRevealed(true);
                  }
                }}
                style={{
                  fontFamily:
                    paragraph.style === 'salutation' || paragraph.style === 'signature'
                      ? 'var(--font-cormorant)'
                      : 'var(--font-crimson)',
                  fontSize:
                    paragraph.style === 'salutation'
                      ? '1.4rem'
                      : paragraph.style === 'signature'
                        ? '1.1rem'
                        : '0.97rem',
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                  color: paragraph.style
                    ? 'rgba(255, 210, 236, 0.96)'
                    : 'rgba(255, 230, 244, 0.88)',
                  fontWeight: paragraph.style === 'salutation' ? 600 : 400,
                  whiteSpace: 'pre-line',
                }}
              >
                {paragraph.text}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-5 flex items-center justify-between gap-3 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: allRevealed ? 1 : 0 }}
          transition={{ duration: 1, ease: EASE_SOFT }}
        >
          <motion.button
            type="button"
            onClick={onPrev}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255, 195, 225, 0.6)',
            }}
          >
            ← Back
          </motion.button>

          <motion.button
            type="button"
            onClick={onNext}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full px-5 py-2.5"
            style={{
              background:
                'linear-gradient(90deg, rgba(232, 80, 153, 0.92), rgba(200, 60, 130, 0.92))',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#fff',
              boxShadow: '0 8px 22px rgba(232, 80, 153, 0.35)',
            }}
          >
            The final moment →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export function Screen87ComeBack() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [taps, setTaps] = useState(0);
  const nextHeartIdRef = useRef(1);
  const removalTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = removalTimersRef.current;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const spawnHearts = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    const startId = nextHeartIdRef.current;
    nextHeartIdRef.current += 6;

    const newHearts: Heart[] = Array.from({ length: 6 }, (_, index) => ({
      id: startId + index,
      x: cx + (Math.random() - 0.5) * 60,
      y: cy,
      size: 0.8 + Math.random() * 0.6,
    }));

    setHearts((prev) => [...prev, ...newHearts]);
    setTaps((count) => count + 1);

    const removeTimer = setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => !newHearts.some((item) => item.id === heart.id)));
    }, 1400);

    removalTimersRef.current.push(removeTimer);
  }, []);

  const message =
    taps === 0
      ? 'Tap to send love'
      : taps < 4
        ? 'Keep going...'
        : taps < 8
          ? 'I feel it ♡'
          : 'Thank you for everything.';

  return (
    <section className="mx-auto w-full max-w-[26rem]" data-nav-ignore="true">
      <div
        className="relative overflow-hidden rounded-[2.2rem] border pb-7 pt-8"
        style={{
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow: '0 36px 74px rgba(0, 0, 0, 0.46), 0 16px 34px rgba(247, 85, 144, 0.16)',
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          aria-hidden
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(247, 85, 144, 0.3), transparent)',
          }}
        />

        <div className="relative flex flex-col items-center gap-6 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE_SOFT }}
          >
            <p
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255, 180, 213, 0.7)',
              }}
            >
              the last thing i want to say
            </p>

            <h2
              className="mt-2"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2rem, 7vw, 2.8rem)',
                fontWeight: 700,
                lineHeight: 1.08,
                color: 'rgba(255, 237, 248, 0.97)',
              }}
            >
              Come Back To Me.
            </h2>

            <p
              className="mt-2"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: '1rem',
                fontStyle: 'italic',
                lineHeight: 1.5,
                color: 'rgba(255, 210, 234, 0.82)',
              }}
            >
              No pressure. No deadline. Just - whenever you are ready.
            </p>
          </motion.div>

          <motion.div
            className="relative flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2, ease: EASE_SOFT }}
          >
            <button
              onClick={spawnHearts}
              aria-label="Send love"
              className="relative flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background:
                  'linear-gradient(135deg, rgba(247, 85, 144, 0.25), rgba(220, 50, 120, 0.15))',
                border: '1.5px solid rgba(247, 85, 144, 0.45)',
                cursor: 'pointer',
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontSize: '2.8rem',
                  color: 'rgba(247, 85, 144, 0.92)',
                  filter: 'drop-shadow(0 6px 14px rgba(247, 85, 144, 0.4))',
                  lineHeight: 1,
                }}
              >
                ♡
              </motion.span>

              <AnimatePresence>
                {hearts.map((heart) => (
                  <motion.span
                    key={heart.id}
                    aria-hidden
                    initial={{ opacity: 1, y: 0, x: heart.x - 48, scale: heart.size }}
                    animate={{ opacity: 0, y: -70, scale: heart.size * 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.3, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      top: heart.y - 12,
                      fontSize: '1.2rem',
                      color: 'rgba(247, 85, 144, 0.85)',
                      pointerEvents: 'none',
                    }}
                  >
                    ♡
                  </motion.span>
                ))}
              </AnimatePresence>
            </button>

            <AnimatePresence mode="wait">
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 195, 225, 0.7)',
                }}
              >
                {message}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="flex w-full flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1.2 }}
          >
            <Link
              href="/"
              className="w-full rounded-full py-3 text-center"
              style={{
                background:
                  'linear-gradient(90deg, rgba(232, 80, 153, 0.92), rgba(200, 60, 130, 0.92))',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                boxShadow: '0 10px 26px rgba(232, 80, 153, 0.35)',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              Return Home
            </Link>

            <Link
              href="/apology/1"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255, 195, 225, 0.5)',
                textDecoration: 'none',
              }}
            >
              Read from the beginning
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}