'use client';

import { useCallback, useState } from 'react';
import { AnimatedGradient } from '@/components/background/AnimatedGradient';
import { FloatingParticles } from '@/components/background/FloatingParticles';
import { LightGlow } from '@/components/background/LightGlow';
import { PageTransition } from '@/components/transitions/PageTransition';
import {
  useExperienceFlow,
  type Screen,
} from '@/hooks/useExperienceFlow';
import {
  emotionThemes,
  type Emotion,
} from '@/lib/emotionThemes';
import {
  useEmotionBackgroundMusic,
  type EmotionTrackMap,
} from '@/hooks/useBackgroundMusic';
import { resolveEndingFromEmotionPath } from '@/lib/experienceEndings';

interface ExperienceControllerProps {
  screens: Screen[];
  autoAdvance?: boolean;
  allowTapToContinue?: boolean;
  pauseByEmotion?: boolean;
  musicByEmotion?: EmotionTrackMap;
  persistKey?: string;
  initialIndex?: number;
  showControls?: boolean;
  shareEnabled?: boolean;
  className?: string;
}

export function ExperienceController({
  screens,
  autoAdvance = true,
  allowTapToContinue = true,
  pauseByEmotion = true,
  musicByEmotion,
  persistKey,
  initialIndex,
  showControls = true,
  shareEnabled = true,
  className,
}: ExperienceControllerProps) {
  const {
    current,
    index,
    total,
    next,
    prev,
    goTo,
    isFirst,
    isLast,
    pause,
    resume,
    isPaused,
    emotionPath,
    pushEmotionSignal,
    resetProgress,
  } = useExperienceFlow(screens, {
    autoAdvance,
    pauseByEmotion,
    persistKey,
    initialIndex,
  });

  const [shareMessage, setShareMessage] = useState('');

  const activeEmotion: Emotion = current?.emotion ?? 'silence';
  const activeTheme = emotionThemes[activeEmotion];

  useEmotionBackgroundMusic(activeEmotion, musicByEmotion ?? {}, {
    volume: 0.28,
    fadeMs: 950,
  });

  const handleReplay = useCallback(() => {
    resetProgress();
    goTo(0);
    setShareMessage('');
  }, [goTo, resetProgress]);

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    const shareUrl = new URL(window.location.href);
    const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    shareUrl.searchParams.set('start', String(index));
    shareUrl.searchParams.set('share', token);
    shareUrl.searchParams.set('ending', resolveEndingFromEmotionPath(emotionPath));

    if (emotionPath.length > 0) {
      shareUrl.searchParams.set('path', emotionPath.join(','));
    }

    const link = shareUrl.toString();

    try {
      await navigator.clipboard.writeText(link);
      setShareMessage('Share link copied.');
    } catch {
      setShareMessage(link);
    }
  }, [emotionPath, index]);

  if (!current) {
    return (
      <main
        id="main-content"
        className="flex min-h-dvh w-dvw items-center justify-center px-4"
        style={{
          background: '#06060a',
          color: 'rgba(235, 235, 245, 0.86)',
          fontFamily: 'var(--font-crimson)',
        }}
      >
        No screens configured for this experience.
      </main>
    );
  }

  const CurrentScreen = current.component;

  return (
    <main
      id="main-content"
      className={`relative min-h-dvh w-dvw overflow-hidden ${activeTheme.className} ${className ?? ''}`}
      style={{
        background: activeTheme.background,
        color: activeTheme.textColor,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.08), transparent 36%), radial-gradient(circle at 80% 82%, rgba(255, 255, 255, 0.06), transparent 35%)',
        }}
      />

      <AnimatedGradient emotion={activeEmotion} />
      <FloatingParticles emotion={activeEmotion} />
      <LightGlow emotion={activeEmotion} />

      <div
        className="pointer-events-none absolute left-1/2 top-[8%] h-48 w-48 -translate-x-1/2 rounded-full blur-3xl"
        aria-hidden="true"
        style={{
          backgroundColor: activeTheme.glowColor,
          opacity: 0.7,
          transition: 'background-color 700ms ease, opacity 700ms ease',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 py-10 md:px-8 md:py-12">
        <PageTransition transitionKey={current.id} emotion={current.emotion}>
          <CurrentScreen
            onNext={next}
            onPrev={prev}
            index={index}
            emotion={current.emotion}
            emotionPath={emotionPath}
            pushEmotionSignal={pushEmotionSignal}
          />
        </PageTransition>

        {showControls ? (
          <div className="mt-8 rounded-2xl border border-white/15 bg-black/20 p-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={prev}
                disabled={isFirst}
                className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em] disabled:cursor-not-allowed disabled:opacity-45"
                style={{
                  borderColor: 'color-mix(in oklab, white 22%, transparent)',
                  color: activeTheme.textColor,
                  fontFamily: 'var(--font-dm-mono)',
                }}
              >
                Previous
              </button>

              {allowTapToContinue && !isLast ? (
                <button
                  onClick={next}
                  className="rounded-full px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
                  style={{
                    background: `linear-gradient(90deg, ${activeTheme.accentColor}, #f75590)`,
                    color: '#fff',
                    fontFamily: 'var(--font-dm-mono)',
                    boxShadow: `0 10px 24px ${activeTheme.glowColor}`,
                  }}
                >
                  Tap to continue
                </button>
              ) : null}

              {autoAdvance ? (
                <button
                  onClick={isPaused ? resume : pause}
                  className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
                  style={{
                    borderColor: 'color-mix(in oklab, white 22%, transparent)',
                    color: activeTheme.textColor,
                    fontFamily: 'var(--font-dm-mono)',
                  }}
                >
                  {isPaused ? 'Resume Auto Pace' : 'Pause Auto Pace'}
                </button>
              ) : null}

              <button
                onClick={handleReplay}
                className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
                style={{
                  borderColor: 'color-mix(in oklab, white 22%, transparent)',
                  color: activeTheme.textColor,
                  fontFamily: 'var(--font-dm-mono)',
                }}
              >
                Replay
              </button>

              {shareEnabled ? (
                <button
                  onClick={handleShare}
                  className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
                  style={{
                    borderColor: 'color-mix(in oklab, white 22%, transparent)',
                    color: activeTheme.textColor,
                    fontFamily: 'var(--font-dm-mono)',
                  }}
                >
                  Share
                </button>
              ) : null}
            </div>

            <div className="mt-3 flex items-center justify-between text-[0.66rem] uppercase tracking-[0.11em]">
              <p style={{ fontFamily: 'var(--font-dm-mono)', opacity: 0.8 }}>
                Emotion: {current.emotion}
              </p>
              <p style={{ fontFamily: 'var(--font-dm-mono)', opacity: 0.8 }}>
                {index + 1}/{Math.max(total, 1)}
              </p>
            </div>

            {shareMessage ? (
              <p
                className="mt-2 break-all text-[0.66rem]"
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  opacity: 0.76,
                }}
              >
                {shareMessage}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
