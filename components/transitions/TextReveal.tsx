'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Emotion } from '@/lib/emotionThemes';

const TEXT_REVEAL_EVENT = 'yor:text-reveal';

interface TextRevealProps {
  text: string;
  emotion?: Emotion;
  delay?: number;
  className?: string;
  mode?: 'fade' | 'typewriter';
  speedMs?: number;
  showCursor?: boolean;
  fragmentFlicker?: boolean;
  dynamicSpeed?: boolean;
}

const emotionRevealOffset: Record<Emotion, {
  y: number;
  blur: number;
}> = {
  regret: {
    y: 22,
    blur: 10,
  },
  silence: {
    y: 16,
    blur: 8,
  },
  pain: {
    y: 18,
    blur: 12,
  },
  love: {
    y: 14,
    blur: 7,
  },
  hope: {
    y: 24,
    blur: 6,
  },
  closure: {
    y: 18,
    blur: 7,
  },
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function resolveHumanTexture(text: string) {
  const normalized = text.trim().toLowerCase();
  const hash = hashText(normalized.length > 0 ? normalized : 'silence');

  const delayJitterMs = (hash % 201) - 100;
  const jitterX = ((Math.floor(hash / 11) % 7) - 3) * 0.16;
  const jitterY = ((Math.floor(hash / 79) % 5) - 2) * 0.1;
  const spacingEm = ((Math.floor(hash / 389) % 5) - 2) * 0.0018;
  const transitionDurationJitter = ((Math.floor(hash / 997) % 9) - 4) * 0.026;

  return {
    delayJitterMs,
    jitterX,
    jitterY,
    spacingEm,
    transitionDurationJitter,
  };
}

function resolveDynamicTypeSpeed(
  text: string,
  emotion: Emotion,
  baseSpeedMs: number,
): number {
  const emotionalCue =
    /sorry|hurt|lost|deserved|wrong|silence|always-|too late|for everything|take care|still/i.test(text)
    || /\.\.\.|[\u2014-]/.test(text);

  const emotionMultiplier: Record<Emotion, number> = {
    regret: 1.16,
    silence: 1.2,
    pain: 1.24,
    love: 1.06,
    hope: 0.96,
    closure: 1.08,
  };

  let multiplier = emotionMultiplier[emotion];

  if (text.length < 24) {
    multiplier -= 0.08;
  }

  if (emotionalCue) {
    multiplier += 0.26;
  }

  return clampNumber(Math.round(baseSpeedMs * multiplier), 12, 68);
}

export function TextReveal({
  text,
  emotion = 'silence',
  delay = 0.3,
  className,
  mode = 'fade',
  speedMs = 26,
  showCursor = true,
  fragmentFlicker = false,
  dynamicSpeed = true,
}: TextRevealProps) {
  const config = emotionRevealOffset[emotion];
  const humanTexture = resolveHumanTexture(text);
  const transitionDuration = clampNumber(0.9 + humanTexture.transitionDurationJitter, 0.74, 1.14);
  const effectiveSpeedMs =
    mode === 'typewriter' && dynamicSpeed
      ? resolveDynamicTypeSpeed(text, emotion, speedMs)
      : speedMs;

  const [visibleChars, setVisibleChars] = useState(
    mode === 'typewriter' ? 0 : text.length,
  );

  useEffect(() => {
    if (mode !== 'typewriter') {
      setVisibleChars(text.length);
      return;
    }

    setVisibleChars(0);
    let stepTimerId: ReturnType<typeof setTimeout> | null = null;
    const startTimer = setTimeout(() => {
      let currentIndex = 0;

      const typeNext = () => {
        currentIndex += 1;
        setVisibleChars(Math.min(currentIndex, text.length));

        if (currentIndex >= text.length) {
          stepTimerId = null;
          return;
        }

        const printedChar = text[currentIndex - 1] ?? '';
        const nextChar = text[currentIndex] ?? '';
        const punctuationPause = /[,:;!?]/.test(printedChar) ? 1.65 : 1;
        const ellipsisPause = printedChar === '.' && nextChar === '.' ? 2.1 : 1;
        const gapPause = printedChar === ' ' ? 1.16 : 1;
        const cadenceVariance = 0.93 + ((printedChar.charCodeAt(0) + currentIndex * 13) % 11) * 0.015;
        const nextDelay = Math.round(
          effectiveSpeedMs
          * punctuationPause
          * ellipsisPause
          * gapPause
          * cadenceVariance,
        );

        stepTimerId = setTimeout(typeNext, nextDelay);
      };

      stepTimerId = setTimeout(typeNext, effectiveSpeedMs);
    }, Math.max(0, delay * 1000 + humanTexture.delayJitterMs));

    return () => {
      clearTimeout(startTimer);
      if (stepTimerId) {
        clearTimeout(stepTimerId);
      }
    };
  }, [delay, effectiveSpeedMs, humanTexture.delayJitterMs, mode, text]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const triggerDelayMs = Math.max(0, delay * 1000 + humanTexture.delayJitterMs);
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(TEXT_REVEAL_EVENT));
    }, triggerDelayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delay, humanTexture.delayJitterMs, text]);

  const displayedText = mode === 'typewriter' ? text.slice(0, visibleChars) : text;
  const isTyping = mode === 'typewriter' && visibleChars < text.length;

  return (
    <motion.p
      className={className}
      initial={{
        opacity: 0,
        x: humanTexture.jitterX,
        y: config.y + humanTexture.jitterY,
        filter: `blur(${config.blur}px)`,
      }}
      animate={{
        opacity: fragmentFlicker ? [0, 0.72, 0.56, 1] : 1,
        x: [0, humanTexture.jitterX * 0.42, 0],
        y: 0,
        filter: 'blur(0px)',
      }}
      transition={{
        duration: transitionDuration,
        delay: Math.max(0, delay + humanTexture.delayJitterMs / 1000),
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ letterSpacing: `${humanTexture.spacingEm.toFixed(4)}em` }}
    >
      {displayedText}
      {showCursor && mode === 'typewriter' ? (
        <motion.span
          aria-hidden="true"
          style={{ display: 'inline-block', marginLeft: '0.1em' }}
          animate={{ opacity: isTyping ? [0, 1, 0] : 0 }}
          transition={{ duration: 0.9, repeat: isTyping ? Infinity : 0, ease: 'linear' }}
        >
          |
        </motion.span>
      ) : null}
    </motion.p>
  );
}
