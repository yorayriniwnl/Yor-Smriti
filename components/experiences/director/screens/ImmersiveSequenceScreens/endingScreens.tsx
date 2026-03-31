'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/transitions/TextReveal';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';

import { SymbolMotif, YorSignatureMotif } from './shared';

export function NoExpectations106Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="mx-auto flex min-h-[58vh] w-full max-w-2xl flex-col items-start justify-center gap-4 text-left">
      <TextReveal
        text="I don't expect anything."
        emotion={emotion}
        className="text-[clamp(1.38rem,3.8vw,2.15rem)]"
      />
      <TextReveal
        text="Not even forgiveness."
        emotion={emotion}
        delay={0.22}
        className="text-[clamp(1.08rem,2.9vw,1.45rem)] opacity-90"
      />
    </section>
  );
}

export function ButIf107Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="mx-auto flex min-h-[58vh] w-full max-w-2xl flex-col items-end justify-center gap-4 text-right">
      <TextReveal
        text="But if someday..."
        emotion={emotion}
        className="text-[clamp(1.38rem,3.8vw,2.2rem)]"
      />
      <TextReveal
        text="You feel the same..."
        emotion={emotion}
        delay={0.22}
        className="text-[clamp(1.08rem,2.9vw,1.45rem)] opacity-92"
      />

      <TextReveal
        text="You read this, didn't you?"
        emotion={emotion}
        delay={0.85}
        className="text-[clamp(0.98rem,2.5vw,1.14rem)] opacity-74"
      />
    </section>
  );
}

export function IllBeHere108Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-4 overflow-hidden text-center">
      <SymbolMotif kind="light" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ opacity: [0.08, 0.2, 0.1], scale: [0.82, 1.1, 0.9] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 226, 186, 0.36), rgba(255, 226, 186, 0))',
        }}
      />

      <TextReveal
        text="I'll be here."
        emotion={emotion}
        className="text-[clamp(1.5rem,4.4vw,2.6rem)]"
      />
      <TextReveal
        text="Still."
        emotion={emotion}
        delay={0.24}
        className="text-[clamp(1.2rem,3.2vw,1.72rem)]"
      />

      <TextReveal
        text="I still do."
        emotion={emotion}
        delay={0.72}
        className="memory-depth-past text-[clamp(0.96rem,2.5vw,1.12rem)]"
      />

      <TextReveal
        text="I remember everything."
        emotion={emotion}
        delay={1.02}
        className="memory-depth-past text-[clamp(0.92rem,2.3vw,1.06rem)] opacity-64"
      />
    </section>
  );
}

export function OrMaybe109Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="mx-auto flex min-h-[58vh] w-full max-w-2xl flex-col items-end justify-center gap-4 text-right">
      <TextReveal
        text="Or maybe..."
        emotion={emotion}
        className="text-[clamp(1.4rem,4vw,2.2rem)]"
      />
      <TextReveal
        text="No reply."
        emotion={emotion}
        delay={0.24}
        className="text-[clamp(1.1rem,3vw,1.5rem)] opacity-92"
      />

      <TextReveal
        text="Read it once more."
        emotion={emotion}
        delay={0.84}
        className="text-[clamp(0.95rem,2.4vw,1.1rem)] opacity-66"
      />
    </section>
  );
}

export function GoodbyeFade110Screen({
  emotion,
}: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-6 overflow-hidden text-center">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
        initial={{ opacity: 0.78 }}
        animate={{ opacity: 0.995 }}
        transition={{ duration: 1.7, ease: 'easeOut' }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        initial={{ opacity: 0.34, scale: 0.88 }}
        animate={{ opacity: 0.08, scale: 1.04 }}
        transition={{ duration: 2.6, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 225, 188, 0.26), rgba(255, 225, 188, 0))',
          filter: 'blur(4px)',
        }}
      />

      <motion.div
        className="relative px-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.78, delay: 0.6, ease: 'easeOut' }}
      >
        <TextReveal
          text="Take care."
          emotion={emotion}
          delay={0.7}
          className="text-[clamp(1.9rem,5.5vw,3.5rem)]"
        />
      </motion.div>
    </section>
  );
}

export function PostEndGhost111Screen({
  emotion,
}: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.88, 0.95, 0.88] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06), rgba(0,0,0,0.92) 68%)',
        }}
      />

      <TextReveal
        text="Still here?"
        emotion={emotion}
        delay={0.7}
        className="relative text-[clamp(1.3rem,3.7vw,2.1rem)]"
      />

      <TextReveal
        text="I didn't think you'd make it this far."
        emotion={emotion}
        delay={1.05}
        className="relative text-[clamp(0.98rem,2.5vw,1.18rem)] opacity-82"
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.26] }}
        transition={{ duration: 3.8, delay: 1.5, ease: 'easeInOut' }}
      >
        <TextReveal
          text="You're still scrolling..."
          emotion={emotion}
          delay={1.55}
          className="text-[clamp(0.96rem,2.5vw,1.14rem)] opacity-82"
        />
      </motion.div>

      <TextReveal
        text="I still do."
        emotion={emotion}
        delay={2.2}
        className="memory-depth-past text-[clamp(1.05rem,2.9vw,1.38rem)]"
      />

      <YorSignatureMotif className="relative" opacity={0.44} />
    </section>
  );
}

export function NoTextVoid112Screen({
}: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(255, 224, 176, 0.08), rgba(0,0,0,0.96) 72%)',
        }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ opacity: [0.06, 0.2, 0.06], scale: [0.86, 1.14, 0.88] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 238, 202, 0.3), rgba(255, 238, 202, 0))',
          filter: 'blur(2px)',
        }}
      />

      <p className="sr-only">Silence</p>
    </section>
  );
}

export function ReversedExpectation113Screen({
  emotion,
}: ExperienceScreenProps) {
  const [showLateLine, setShowLateLine] = useState(false);

  useEffect(() => {
    const lateLineTimer = window.setTimeout(() => {
      setShowLateLine(true);
    }, 3600);

    return () => {
      window.clearTimeout(lateLineTimer);
    };
  }, []);

  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
        style={{ opacity: 0.995 }}
      />

      <motion.p
        className="pointer-events-none absolute top-[34%] px-4"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.8, delay: 0.28, ease: 'easeInOut' }}
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(0.88rem,2.2vw,1.02rem)',
          lineHeight: 1.4,
          color: 'rgba(248, 238, 225, 0.5)',
          filter: 'blur(0.2px)',
        }}
      >
        I almost didn&apos;t say this...
      </motion.p>

      {showLateLine ? (
        <motion.div
          className="relative px-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.88, ease: 'easeOut' }}
        >
          <TextReveal
            text="I didn't know what to say either."
            emotion={emotion}
            mode="typewriter"
            speedMs={30}
            className="text-[clamp(1.15rem,3.2vw,1.7rem)]"
          />
        </motion.div>
      ) : null}

      <p className="sr-only">Silence before the final line</p>
    </section>
  );
}

export function FakeEnd114Screen({
  emotion,
}: ExperienceScreenProps) {
  const [showOneLastThing, setShowOneLastThing] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowOneLastThing(true);
    }, 2400);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: [0.98, 1, 0.98] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {showOneLastThing ? (
        <motion.div
          className="relative px-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <TextReveal
            text="One last thing..."
            emotion={emotion}
            mode="typewriter"
            speedMs={31}
            className="text-[clamp(1.15rem,3.2vw,1.76rem)]"
          />
        </motion.div>
      ) : null}

      <p className="sr-only">A false ending before one last line</p>
    </section>
  );
}

export function MemoryDistortion115Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.07), rgba(0,0,0,0.9) 72%)',
        }}
      />

      <TextReveal
        text="I remember... most things."
        emotion={emotion}
        className="relative text-[clamp(1.24rem,3.5vw,1.95rem)]"
      />

      <TextReveal
        text="You've probably felt this too... haven't you?"
        emotion={emotion}
        delay={0.3}
        className="relative text-[clamp(0.96rem,2.5vw,1.18rem)] opacity-84"
      />

      <motion.article
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/16 bg-black/30 p-5 text-left"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.78))',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.1), transparent 52%)',
          }}
        />

        <p
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.98rem,2.6vw,1.14rem)',
            lineHeight: 1.52,
            color: 'rgba(242, 244, 252, 0.74)',
            filter: 'blur(1.7px)',
            userSelect: 'none',
          }}
        >
          I kept writing drafts here. I erased names, dates, reasons. A few lines still stayed, half-visible, like they wanted to be read but not forgiven.
        </p>
      </motion.article>
    </section>
  );
}

export function StillThere116Screen({ emotion }: ExperienceScreenProps) {
  const [showStillThere, setShowStillThere] = useState(false);
  const [showHiddenLine, setShowHiddenLine] = useState(false);
  const longPressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const silenceTimer = window.setTimeout(() => {
      setShowStillThere(true);
    }, 3200);

    const idleRevealTimer = window.setTimeout(() => {
      setShowHiddenLine(true);
    }, 5200);

    return () => {
      window.clearTimeout(silenceTimer);
      window.clearTimeout(idleRevealTimer);
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };
  }, []);

  const handlePointerDown = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
    }

    longPressTimerRef.current = window.setTimeout(() => {
      setShowHiddenLine(true);
      longPressTimerRef.current = null;
    }, 1300);
  };

  const clearLongPress = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <section
      className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center"
      onPointerDown={handlePointerDown}
      onPointerUp={clearLongPress}
      onPointerLeave={clearLongPress}
      data-nav-ignore="true"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.92, 1, 0.92] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(0,0,0,0.98)' }}
      />

      {showStillThere ? (
        <TextReveal
          text="Still here?"
          emotion={emotion}
          className="relative text-[clamp(1.2rem,3.4vw,1.88rem)]"
        />
      ) : null}

      {showHiddenLine ? (
        <motion.p
          className="absolute bottom-[22%] px-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.78, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.9rem,2.3vw,1.06rem)',
            lineHeight: 1.4,
          }}
        >
          I didn&apos;t think you&apos;d look this closely.
        </motion.p>
      ) : null}
    </section>
  );
}

export function UserBecomesStory117Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.86, 0.96, 0.86] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255, 224, 176, 0.08), rgba(0,0,0,0.94) 70%)',
        }}
      />

      <TextReveal
        text="Maybe this wasn't about me..."
        emotion={emotion}
        className="relative text-[clamp(1.12rem,3.1vw,1.72rem)]"
      />

      <TextReveal
        text="Maybe it was about you."
        emotion={emotion}
        delay={0.34}
        className="relative text-[clamp(1.15rem,3.2vw,1.82rem)]"
      />

      <motion.p
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 2.6, delay: 1.45, ease: 'easeInOut' }}
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(1.2rem,3.4vw,1.9rem)',
          lineHeight: 1.2,
        }}
      >
        Maybe in another...
      </motion.p>
    </section>
  );
}

export function FinalMicroInteraction118Screen({ onNext }: ExperienceScreenProps) {
  const [hasTriedToClick, setHasTriedToClick] = useState(false);
  const [showItsOkay, setShowItsOkay] = useState(false);

  const handleFinalTap = () => {
    if (hasTriedToClick) {
      return;
    }

    setHasTriedToClick(true);
    window.setTimeout(() => {
      setShowItsOkay(true);
    }, 820);

    window.setTimeout(() => {
      onNext();
    }, 2200);
  };

  return (
    <section
      className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center"
      onClick={handleFinalTap}
      role="button"
      tabIndex={0}
      aria-label="Continue through silence"
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleFinalTap();
        }
      }}
      data-nav-ignore="true"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
        animate={{ opacity: [0.96, 1, 0.96] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        initial={{ opacity: 0.2, scale: 1 }}
        animate={{ opacity: [0.2, 0], scale: [1, 2.3] }}
        transition={{ duration: 4, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 231, 198, 0.34), rgba(255, 231, 198, 0))',
          filter: 'blur(3px)',
        }}
      />

      {showItsOkay ? (
        <motion.p
          className="relative px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1.08rem,3vw,1.6rem)',
            lineHeight: 1.3,
          }}
        >
          It&apos;s okay.
        </motion.p>
      ) : null}

      <p className="sr-only">Tap to continue through silence</p>
    </section>
  );
}

export function TrueFinalState119Screen() {
  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.97, 1, 0.97] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(0,0,0,1)' }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ opacity: [0.04, 0.01, 0.04], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1), rgba(255,255,255,0))',
          filter: 'blur(10px)',
        }}
      />

      <p className="sr-only">Silence. Darkness. Memory.</p>
    </section>
  );
}
