'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import { AnimatedGradient } from '@/components/background/AnimatedGradient';
import { FloatingParticles } from '@/components/background/FloatingParticles';
import { LightGlow } from '@/components/background/LightGlow';
import { RainLayer } from '@/components/background/RainLayer';
import { CharacterOverlay } from '@/components/character/CharacterOverlay';
import { PageTransition } from '@/components/transitions/PageTransition';
import { useImmersiveNavigation } from '@/components/experiences/panda/hooks/useImmersiveNavigation';
import { resolveSceneAudioProfile } from '@/components/experiences/panda/audio/sceneAudioProfile';
import {
  afterglowOverlayMotion,
  restartFadeMotion,
} from '@/components/experiences/panda/animation/cinematicMotion';
import { immersivePalette } from '@/components/experiences/panda/theme/immersivePalette';
import {
  useExperienceFlow,
  DEFAULT_PERSONALIZATION,
  type ExperienceFlowMode,
  type ExperienceMood,
  type ExperienceRestartOptions,
  type PersonalizationData,
  type Screen,
} from '@/hooks/useExperienceFlow';
import {
  emotionThemes,
  type Emotion,
} from '@/lib/emotionThemes';
import {
  useEmotionBackgroundMusic,
  type EmotionTrackMap,
} from '@/hooks/useAudioEngine';
import { useSubconsciousSoundDesign } from '@/hooks/useSubconsciousSoundDesign';
import { resolveEndingFromEmotionPath } from '@/lib/experienceEndings';
import { resolveEmotionTiming } from '@/lib/timeDistortion';
import { resolveEmotionalPhysics } from '@/lib/emotionalPhysics';

interface ExperienceControllerProps {
  screens: Screen[];
  autoAdvance?: boolean;
  allowTapToContinue?: boolean;
  pauseByEmotion?: boolean;
  musicByEmotion?: EmotionTrackMap;
  persistKey?: string;
  initialIndex?: number;
  personalization?: PersonalizationData;
  initialMood?: ExperienceMood;
  initialFlowMode?: ExperienceFlowMode;
  initialPrivateMode?: boolean;
  initialSilentMode?: boolean;
  showControls?: boolean;
  showPauseButton?: boolean;
  shareEnabled?: boolean;
  className?: string;
}

const emotionTemperatureTint: Record<Emotion, string> = {
  regret: 'rgba(126, 162, 255, 0.24)',
  silence: 'rgba(177, 186, 218, 0.16)',
  pain: 'rgba(255, 122, 122, 0.17)',
  love: 'rgba(255, 147, 202, 0.24)',
  hope: 'rgba(255, 196, 112, 0.24)',
  closure: 'rgba(220, 220, 220, 0.18)',
};

const moodOverlayTint: Record<ExperienceMood, string> = {
  default: 'rgba(255, 255, 255, 0.06)',
  dark: 'rgba(0, 0, 0, 0.28)',
  hopeful: 'rgba(255, 207, 148, 0.12)',
  minimal: 'rgba(255, 255, 255, 0.03)',
};

const moodTransitionDrag: Record<ExperienceMood, number> = {
  default: 1,
  dark: 1.08,
  hopeful: 0.94,
  minimal: 0.9,
};

type TimeContext = 'day' | 'twilight' | 'night';

const timeContextVisuals: Record<TimeContext, {
  centerLift: number;
  edgeDarkness: number;
  washTint: string;
}> = {
  day: {
    centerLift: 0.065,
    edgeDarkness: 0.42,
    washTint: 'rgba(255, 224, 186, 0.08)',
  },
  twilight: {
    centerLift: 0.056,
    edgeDarkness: 0.5,
    washTint: 'rgba(194, 183, 255, 0.06)',
  },
  night: {
    centerLift: 0.046,
    edgeDarkness: 0.6,
    washTint: 'rgba(134, 156, 228, 0.05)',
  },
};

const emotionLinkedMotion: Record<Emotion, {
  x: number[];
  y: number[];
  rotate: number[];
  duration: number;
  ease: 'easeInOut' | 'linear';
}> = {
  regret: {
    x: [-10, 10, -8],
    y: [-6, 8, -5],
    rotate: [-0.35, 0.35, -0.25],
    duration: 18,
    ease: 'easeInOut',
  },
  silence: {
    x: [-2, 2, -2],
    y: [0, 2, 0],
    rotate: [0, 0.08, 0],
    duration: 14,
    ease: 'easeInOut',
  },
  pain: {
    x: [-2, 2, -1.5, 1.5, 0],
    y: [0.8, -0.8, 0.7, -0.6, 0],
    rotate: [0, -0.18, 0.14, -0.12, 0],
    duration: 2.8,
    ease: 'linear',
  },
  love: {
    x: [-4, 4, -3],
    y: [4, -7, 4],
    rotate: [-0.2, 0.2, -0.18],
    duration: 10,
    ease: 'easeInOut',
  },
  hope: {
    x: [-5, 5, -4],
    y: [3, -5, 3],
    rotate: [-0.16, 0.16, -0.14],
    duration: 9,
    ease: 'easeInOut',
  },
  closure: {
    x: [-3, 3, -2],
    y: [2, -3, 2],
    rotate: [-0.1, 0.1, -0.08],
    duration: 11,
    ease: 'easeInOut',
  },
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveTimeContext(): TimeContext {
  const hour = new Date().getHours();

  if (hour >= 20 || hour < 5) {
    return 'night';
  }

  if ((hour >= 5 && hour < 8) || (hour >= 18 && hour < 20)) {
    return 'twilight';
  }

  return 'day';
}

function hashStringToSeed(input: string): number {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function resolveInitialNonLinearSeed(options: {
  persistKey?: string;
  initialIndex?: number;
  initialMood: ExperienceMood;
  initialFlowMode: ExperienceFlowMode;
  personalization: PersonalizationData;
}): number {
  const base = [
    options.persistKey ?? 'yor-smriti',
    options.initialIndex ?? 0,
    options.initialMood,
    options.initialFlowMode,
    options.personalization.name,
    options.personalization.memory,
    options.personalization.message,
  ].join('|');

  return hashStringToSeed(base) % 1_000_000;
}

function createSeededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function shuffleBySeed<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  const random = createSeededRandom(seed);

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function buildScreenSequence(
  screens: Screen[],
  flowMode: ExperienceFlowMode,
  seed: number,
  replayCount: number,
): Screen[] {
  const hasReplayDistortion = replayCount > 0;
  let workingScreens = screens;

  if (hasReplayDistortion) {
    const hiddenScreenIds = replayCount > 1 ? new Set([94, 103, 108]) : new Set([94, 103]);
    const durationRandom = createSeededRandom(seed + replayCount * 7919);

    workingScreens = screens
      .filter((screen) => !hiddenScreenIds.has(screen.id))
      .map((screen) => {
        if (!screen.duration || screen.duration <= 0 || screen.id < 88 || screen.id > 138) {
          return screen;
        }

        const durationDistortion = 0.9 + durationRandom() * 0.24;
        return {
          ...screen,
          duration: Math.round(screen.duration * durationDistortion),
        };
      });
  }

  if (flowMode !== 'non-linear') {
    return workingScreens;
  }

  const prefix = workingScreens.filter((screen) => screen.id <= 87);
  const memoryBand = workingScreens.filter((screen) => screen.id >= 88 && screen.id <= 105);
  const suffix = workingScreens.filter((screen) => screen.id >= 106);

  if (memoryBand.length <= 1) {
    return workingScreens;
  }

  return [...prefix, ...shuffleBySeed(memoryBand, seed), ...suffix];
}

export function ExperienceController({
  screens,
  autoAdvance = true,
  allowTapToContinue = true,
  pauseByEmotion = true,
  musicByEmotion,
  persistKey,
  initialIndex,
  personalization = DEFAULT_PERSONALIZATION,
  initialMood = 'default',
  initialFlowMode = 'linear',
  initialPrivateMode = true,
  initialSilentMode = false,
  showControls = true,
  showPauseButton = false,
  shareEnabled = true,
  className,
}: ExperienceControllerProps) {
  const [mood, setMood] = useState<ExperienceMood>(initialMood);
  const [flowMode, setFlowMode] = useState<ExperienceFlowMode>(initialFlowMode);
  const [isPrivateMode, setIsPrivateMode] = useState(initialPrivateMode);
  const [isSilentMode, setIsSilentMode] = useState(initialSilentMode);
  const [replayCount, setReplayCount] = useState(0);
  const [nonLinearSeed, setNonLinearSeed] = useState(() =>
    resolveInitialNonLinearSeed({
      persistKey,
      initialIndex,
      initialMood,
      initialFlowMode,
      personalization,
    }),
  );
  const [shareMessage, setShareMessage] = useState('');
  const [isRestarting, setIsRestarting] = useState(false);
  const [isAttentionLocked, setIsAttentionLocked] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [timeContext, setTimeContext] = useState<TimeContext>('twilight');
  const [isAudioGraceWindow, setIsAudioGraceWindow] = useState(false);
  const [lastAudibleVolume, setLastAudibleVolume] = useState(0.14);

  const restartTimerRef = useRef<number | null>(null);
  const restartFinishTimerRef = useRef<number | null>(null);
  const manualResumeTimerRef = useRef<number | null>(null);
  const attentionLockTimerRef = useRef<number | null>(null);
  const cursorInactivityTimerRef = useRef<number | null>(null);
  const audioGraceTimerRef = useRef<number | null>(null);

  const activeScreens = useMemo(
    () => buildScreenSequence(screens, flowMode, nonLinearSeed, replayCount),
    [flowMode, nonLinearSeed, replayCount, screens],
  );

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
  } = useExperienceFlow(activeScreens, {
    autoAdvance,
    pauseByEmotion,
    persistKey,
    initialIndex,
  });

  const activeEmotion: Emotion = current?.emotion ?? 'silence';
  const currentScreenId = current?.id ?? 0;
  const finalScreenId = activeScreens[activeScreens.length - 1]?.id ?? 0;
  const activeKind = current?.kind;
  const showRainLayer = currentScreenId === 84;
  const emotionalMotion = emotionLinkedMotion[activeEmotion];
  const shouldFreezeAmbientMotion = currentScreenId === 110 || currentScreenId >= 135;
  const activeTheme = emotionThemes[activeEmotion];
  const timeVisual = timeContextVisuals[timeContext];
  const isSilenceScreen = activeKind === 'silence';
  const isFreezeScreen = activeKind === 'freeze';
  const isMuteScreen = activeKind === 'mute';
  const isAfterglowScreen = activeKind === 'afterglow';
  const audioProfile = resolveSceneAudioProfile(activeKind);

  const personalizedName = personalization.name;
  const personalizedMemory = personalization.memory;
  const personalizedMessage = personalization.message;

  const journeyProgress = total <= 1 ? 0 : index / (total - 1);

  const physics = useMemo(
    () => resolveEmotionalPhysics({
      screenId: currentScreenId,
      emotion: activeEmotion,
      kind: activeKind,
      progress: journeyProgress,
      mood,
      flowMode,
      isSilentMode,
    }),
    [activeEmotion, activeKind, currentScreenId, flowMode, isSilentMode, journeyProgress, mood],
  );

  const transitionTiming = useMemo(() => {
    const base = resolveEmotionTiming(
      activeEmotion,
      current?.kind ?? 'normal',
      current?.timing,
    );

    return {
      ...base,
      duration: clampNumber(base.duration * physics.transitionDrag * moodTransitionDrag[mood], 0.45, 3),
      delay: clampNumber(base.delay + physics.silenceWeight * 0.08, 0, 1.4),
    };
  }, [activeEmotion, current?.kind, current?.timing, mood, physics.transitionDrag, physics.silenceWeight]);

  const textDriftSpacing = `${physics.textSpacingBoost.toFixed(3)}em`;
  const progressAmbientLight = clampNumber((0.03 + journeyProgress * 0.17) * physics.lightGain, 0.04, 0.34);
  const progressPulse = physics.pulseScale;
  const temperatureTint = emotionTemperatureTint[activeEmotion];
  const breathDuration = 4;

  const evolvedAudioProfile = useMemo(
    () => {
      const muteFadeTuning =
        currentScreenId === 99
          ? 0.58
          : currentScreenId === 110
            ? 1.3
            : 1;

      const shouldDelayAudioCut = currentScreenId === finalScreenId && isAudioGraceWindow && !isSilentMode;
      const baseVolume = audioProfile.enabled
        ? clampNumber(audioProfile.volume * physics.audioGain, 0, 1)
        : 0;
      const graceVolume = shouldDelayAudioCut
        ? clampNumber(lastAudibleVolume * 0.62, 0.02, 0.18)
        : 0;

      return {
        ...audioProfile,
        enabled: (!isSilentMode && audioProfile.enabled) || shouldDelayAudioCut,
        volume: shouldDelayAudioCut ? graceVolume : baseVolume,
        fadeMs: Math.round(
          audioProfile.fadeMs
          * (1 + physics.silenceWeight * 0.3)
          * (0.92 + journeyProgress * 0.18)
          * muteFadeTuning,
        ),
      };
    },
    [
      audioProfile,
      currentScreenId,
      finalScreenId,
      isAudioGraceWindow,
      isSilentMode,
      lastAudibleVolume,
      physics.audioGain,
      physics.silenceWeight,
      journeyProgress,
    ],
  );

  useEffect(() => {
    if (isAudioGraceWindow) {
      return;
    }

    if (evolvedAudioProfile.enabled && evolvedAudioProfile.volume > 0.01) {
      setLastAudibleVolume((previous) => {
        const next = evolvedAudioProfile.volume;
        return Math.abs(previous - next) < 0.001 ? previous : next;
      });
    }
  }, [evolvedAudioProfile.enabled, evolvedAudioProfile.volume, isAudioGraceWindow]);

  useEmotionBackgroundMusic(activeEmotion, musicByEmotion ?? {}, evolvedAudioProfile);

  useSubconsciousSoundDesign({
    enabled: !isSilentMode && (currentScreenId < finalScreenId || isAudioGraceWindow),
    screenId: currentScreenId,
    emotion: activeEmotion,
    kind: activeKind,
  });

  useEffect(() => {
    if (audioGraceTimerRef.current !== null) {
      window.clearTimeout(audioGraceTimerRef.current);
      audioGraceTimerRef.current = null;
    }

    if (currentScreenId !== finalScreenId || isSilentMode) {
      setIsAudioGraceWindow(false);
      return;
    }

    setIsAudioGraceWindow(true);
    audioGraceTimerRef.current = window.setTimeout(() => {
      setIsAudioGraceWindow(false);
      audioGraceTimerRef.current = null;
    }, 1000);

    return () => {
      if (audioGraceTimerRef.current !== null) {
        window.clearTimeout(audioGraceTimerRef.current);
        audioGraceTimerRef.current = null;
      }
    };
  }, [currentScreenId, finalScreenId, isSilentMode]);

  useEffect(() => {
    setTimeContext(resolveTimeContext());

    const timer = window.setInterval(() => {
      setTimeContext(resolveTimeContext());
    }, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const scheduleCursorHide = useCallback(() => {
    if (cursorInactivityTimerRef.current !== null) {
      window.clearTimeout(cursorInactivityTimerRef.current);
    }

    setCursorHidden(false);

    cursorInactivityTimerRef.current = window.setTimeout(() => {
      setCursorHidden(true);
      cursorInactivityTimerRef.current = null;
    }, 1700);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isPrivateMode) {
      setCursorHidden(false);
      return;
    }

    scheduleCursorHide();

    window.addEventListener('pointermove', scheduleCursorHide, { passive: true });
    window.addEventListener('pointerdown', scheduleCursorHide, { passive: true });
    window.addEventListener('keydown', scheduleCursorHide);
    window.addEventListener('touchstart', scheduleCursorHide, { passive: true });

    return () => {
      window.removeEventListener('pointermove', scheduleCursorHide);
      window.removeEventListener('pointerdown', scheduleCursorHide);
      window.removeEventListener('keydown', scheduleCursorHide);
      window.removeEventListener('touchstart', scheduleCursorHide);
      if (cursorInactivityTimerRef.current !== null) {
        window.clearTimeout(cursorInactivityTimerRef.current);
        cursorInactivityTimerRef.current = null;
      }
    };
  }, [isPrivateMode, scheduleCursorHide]);

  useEffect(() => {
    const lockMs = current?.attentionLockMs ?? 0;

    if (attentionLockTimerRef.current !== null) {
      window.clearTimeout(attentionLockTimerRef.current);
      attentionLockTimerRef.current = null;
    }

    if (lockMs <= 0) {
      setIsAttentionLocked(false);
      return;
    }

    setIsAttentionLocked(true);
    attentionLockTimerRef.current = window.setTimeout(() => {
      setIsAttentionLocked(false);
      attentionLockTimerRef.current = null;
    }, lockMs);

    return () => {
      if (attentionLockTimerRef.current !== null) {
        window.clearTimeout(attentionLockTimerRef.current);
        attentionLockTimerRef.current = null;
      }
    };
  }, [current?.attentionLockMs, current?.id]);

  const holdAutoForManualControl = useCallback(() => {
    if (!autoAdvance || isPaused) {
      return;
    }

    pause();

    if (manualResumeTimerRef.current !== null) {
      window.clearTimeout(manualResumeTimerRef.current);
    }

    manualResumeTimerRef.current = window.setTimeout(() => {
      resume();
      manualResumeTimerRef.current = null;
    }, 4200);
  }, [autoAdvance, isPaused, pause, resume]);

  const handleNextWithControl = useCallback(() => {
    holdAutoForManualControl();
    next();
  }, [holdAutoForManualControl, next]);

  const handlePrevWithControl = useCallback(() => {
    holdAutoForManualControl();
    prev();
  }, [holdAutoForManualControl, prev]);

  const handleSetFlowMode = useCallback((nextMode: ExperienceFlowMode) => {
    setFlowMode(nextMode);
    if (nextMode === 'non-linear') {
      setNonLinearSeed(Math.floor(Math.random() * 1_000_000));
    }
  }, []);

  const toggleSilentMode = useCallback(() => {
    setIsSilentMode((value) => !value);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'm') {
        return;
      }

      setIsSilentMode((value) => !value);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('yor-smriti-mood', mood);
    window.localStorage.setItem('yor-smriti-flow-mode', flowMode);
    window.localStorage.setItem('yor-smriti-private-mode', String(isPrivateMode));
    window.localStorage.setItem('yor-smriti-silent-mode', String(isSilentMode));
  }, [flowMode, isPrivateMode, isSilentMode, mood]);

  const handleReplay = useCallback((options?: ExperienceRestartOptions) => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextMood = options?.mood ?? mood;
    const nextFlowMode = options?.flowMode ?? flowMode;
    const nextSilentMode = options?.silentMode ?? isSilentMode;
    const nextPrivateMode = options?.privateMode ?? isPrivateMode;

    setMood(nextMood);
    setFlowMode(nextFlowMode);
    setIsSilentMode(nextSilentMode);
    setIsPrivateMode(nextPrivateMode);

    if (nextFlowMode === 'non-linear') {
      setNonLinearSeed(Math.floor(Math.random() * 1_000_000));
    }

    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current);
    }

    if (restartFinishTimerRef.current !== null) {
      window.clearTimeout(restartFinishTimerRef.current);
    }

    if (manualResumeTimerRef.current !== null) {
      window.clearTimeout(manualResumeTimerRef.current);
      manualResumeTimerRef.current = null;
    }

    setReplayCount((value) => value + 1);

    setIsRestarting(true);
    restartTimerRef.current = window.setTimeout(() => {
      resetProgress();
      goTo(0);
      setShareMessage('');

      restartFinishTimerRef.current = window.setTimeout(() => {
        setIsRestarting(false);
      }, 380);
    }, 650);
  }, [flowMode, goTo, isPrivateMode, isSilentMode, mood, resetProgress]);

  const areGesturesLocked =
    isRestarting
    || isFreezeScreen
    || isMuteScreen
    || isAfterglowScreen
    || isAttentionLocked;

  const {
    onSurfaceClick,
    onSurfaceDoubleClick,
    onSurfacePointerDown,
    onSurfacePointerUp,
  } = useImmersiveNavigation({
    onNext: handleNextWithControl,
    onPrev: handlePrevWithControl,
    disabled: !allowTapToContinue || areGesturesLocked,
  });

  const handleSurfacePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        event.pointerType !== 'mouse'
        || areGesturesLocked
        || mood === 'minimal'
        || shouldFreezeAmbientMotion
      ) {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

      setParallaxOffset({
        x: normalizedX * 14,
        y: normalizedY * 10,
      });
    },
    [areGesturesLocked, mood, shouldFreezeAmbientMotion],
  );

  const handleSurfacePointerLeave = useCallback(() => {
    setParallaxOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    return () => {
      if (restartTimerRef.current !== null) {
        window.clearTimeout(restartTimerRef.current);
      }

      if (restartFinishTimerRef.current !== null) {
        window.clearTimeout(restartFinishTimerRef.current);
      }

      if (manualResumeTimerRef.current !== null) {
        window.clearTimeout(manualResumeTimerRef.current);
      }

      if (attentionLockTimerRef.current !== null) {
        window.clearTimeout(attentionLockTimerRef.current);
      }

      if (cursorInactivityTimerRef.current !== null) {
        window.clearTimeout(cursorInactivityTimerRef.current);
      }

      if (audioGraceTimerRef.current !== null) {
        window.clearTimeout(audioGraceTimerRef.current);
      }
    };
  }, []);

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    const shareUrl = new URL(window.location.href);
    const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    shareUrl.searchParams.set('start', String(index));
    shareUrl.searchParams.set('share', token);
    shareUrl.searchParams.set('ending', resolveEndingFromEmotionPath(emotionPath));
    shareUrl.searchParams.set('name', personalizedName);
    shareUrl.searchParams.set('memory', personalizedMemory);
    shareUrl.searchParams.set('message', personalizedMessage);
    shareUrl.searchParams.set('mood', mood);
    shareUrl.searchParams.set('mode', flowMode);
    shareUrl.searchParams.set('private', String(isPrivateMode));
    shareUrl.searchParams.set('silent', String(isSilentMode));

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
  }, [
    emotionPath,
    flowMode,
    index,
    isPrivateMode,
    isSilentMode,
    mood,
    personalizedMemory,
    personalizedMessage,
    personalizedName,
  ]);

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
  const showDecorativeLayers = mood !== 'minimal' && !shouldFreezeAmbientMotion;
  const isUiVoidScreen =
    currentScreenId === 99
    || currentScreenId === 100
    || currentScreenId === 110
    || currentScreenId === 111
    || currentScreenId === 112
    || currentScreenId >= 113;
  const shouldShowControls = showControls && !isFreezeScreen && !isMuteScreen && !isUiVoidScreen;
  const soundToggleOpacity = isUiVoidScreen ? 0 : isPrivateMode && cursorHidden ? 0 : 0.62;

  return (
    <main
      id="main-content"
      className={`relative min-h-dvh w-dvw overflow-hidden ${activeTheme.className} ${isPrivateMode && cursorHidden ? 'cursor-none' : ''} ${className ?? ''}`}
      style={{
        background: activeTheme.background,
        color: activeTheme.textColor,
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={
          shouldFreezeAmbientMotion
            ? { x: 0, y: 0 }
            : { x: parallaxOffset.x * 0.45, y: parallaxOffset.y * 0.4 }
        }
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:
            'radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.08), transparent 36%), radial-gradient(circle at 80% 82%, rgba(255, 255, 255, 0.06), transparent 35%)',
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={
          shouldFreezeAmbientMotion
            ? { x: 0, y: 0, rotate: 0 }
            : { x: emotionalMotion.x, y: emotionalMotion.y, rotate: emotionalMotion.rotate }
        }
        transition={
          shouldFreezeAmbientMotion
            ? { duration: 0.3, ease: 'linear' }
            : { duration: emotionalMotion.duration, repeat: Infinity, ease: emotionalMotion.ease }
        }
        style={{
          background:
            'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.05), transparent 38%), radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.04), transparent 34%)',
          opacity: mood === 'minimal' ? 0.09 : 0.2,
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={
          shouldFreezeAmbientMotion
            ? { scale: 1, opacity: 0.08 }
            : { scale: [1, progressPulse, 1], opacity: [0.06, 0.13, 0.08] }
        }
        transition={
          shouldFreezeAmbientMotion
            ? { duration: 0.3, ease: 'linear' }
            : { duration: breathDuration, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(255,255,255,0.14), rgba(255,255,255,0) 62%)',
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={shouldFreezeAmbientMotion ? { opacity: 0.11 } : { opacity: [0.09, 0.18, 0.1] }}
        transition={
          shouldFreezeAmbientMotion
            ? { duration: 0.3, ease: 'linear' }
            : { duration: breathDuration, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          background: `radial-gradient(circle at 50% 14%, ${temperatureTint}, transparent 58%)`,
          mixBlendMode: 'screen',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,${(progressAmbientLight * 0.32).toFixed(3)}), rgba(255,255,255,${(progressAmbientLight * 0.58).toFixed(3)}))`,
          opacity: 0.38,
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={shouldFreezeAmbientMotion ? { opacity: 0.24 } : { opacity: [0.22, 0.35, 0.25] }}
        transition={
          shouldFreezeAmbientMotion
            ? { duration: 0.3, ease: 'linear' }
            : { duration: breathDuration, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          background: moodOverlayTint[mood],
          mixBlendMode: 'multiply',
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={shouldFreezeAmbientMotion ? { opacity: 0.88 } : { opacity: [0.82, 0.96, 0.84] }}
        transition={
          shouldFreezeAmbientMotion
            ? { duration: 0.3, ease: 'linear' }
            : { duration: breathDuration, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          background: `radial-gradient(circle at 50% 46%, rgba(255,255,255,${timeVisual.centerLift.toFixed(3)}), rgba(0,0,0,${timeVisual.edgeDarkness.toFixed(3)}) 76%)`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `linear-gradient(180deg, ${timeVisual.washTint}, rgba(0,0,0,0))`,
          mixBlendMode: 'screen',
          opacity: 0.42,
        }}
      />

      {!shouldFreezeAmbientMotion ? <AnimatedGradient emotion={activeEmotion} /> : null}
      {showDecorativeLayers ? <FloatingParticles emotion={activeEmotion} /> : null}
      {showDecorativeLayers ? <LightGlow emotion={activeEmotion} /> : null}
      {showRainLayer ? <RainLayer count={72} /> : null}
      <CharacterOverlay screenId={currentScreenId} />

      <div
        className="pointer-events-none absolute inset-0 blur-2xl"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.4))',
        }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-[8%] h-48 w-48 -translate-x-1/2 rounded-full blur-3xl"
        aria-hidden="true"
        style={{
          backgroundColor: activeTheme.glowColor,
          opacity: mood === 'minimal' ? 0.34 : 0.7,
          transition: 'background-color 700ms ease, opacity 700ms ease',
        }}
      />

      {isAfterglowScreen ? (
        <motion.div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ background: immersivePalette.warmAfterglow }}
          animate={afterglowOverlayMotion.animate}
          transition={afterglowOverlayMotion.transition}
        />
      ) : null}

      {!isUiVoidScreen ? (
        <motion.button
          type="button"
          data-nav-ignore="true"
          onClick={toggleSilentMode}
          className="absolute right-4 top-4 z-30 rounded-full border px-3 py-1 text-[0.58rem] uppercase tracking-[0.1em]"
          style={{
            borderColor: 'rgba(255,255,255,0.24)',
            color: activeTheme.textColor,
            fontFamily: 'var(--font-dm-mono)',
            opacity: soundToggleOpacity,
            pointerEvents: soundToggleOpacity < 0.08 ? 'none' : 'auto',
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {isSilentMode ? 'Silent' : 'Sound'}
        </motion.button>
      ) : null}

      {showPauseButton && autoAdvance && !isUiVoidScreen ? (
        <motion.button
          type="button"
          data-nav-ignore="true"
          onClick={isPaused ? resume : pause}
          className="absolute right-24 top-4 z-30 rounded-full border px-3 py-1 text-[0.58rem] uppercase tracking-[0.1em]"
          style={{
            borderColor: 'rgba(255,255,255,0.24)',
            color: activeTheme.textColor,
            fontFamily: 'var(--font-dm-mono)',
            opacity: isPrivateMode && cursorHidden ? 0 : 0.62,
            pointerEvents: isPrivateMode && cursorHidden ? 'none' : 'auto',
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </motion.button>
      ) : null}

      <div
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 py-10 md:px-8 md:py-12"
        onClick={onSurfaceClick}
        onDoubleClick={onSurfaceDoubleClick}
        onPointerDown={onSurfacePointerDown}
        onPointerUp={onSurfacePointerUp}
        onPointerMove={handleSurfacePointerMove}
        onPointerLeave={handleSurfacePointerLeave}
        style={{
          letterSpacing: textDriftSpacing,
          transition: 'letter-spacing 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <PageTransition
          transitionKey={current.id}
          emotion={current.emotion}
          timing={transitionTiming}
        >
          {isFreezeScreen ? (
            <div
              className="flex min-h-[58vh] items-center justify-center rounded-3xl border"
              style={{
                background: immersivePalette.freezeBackground,
                borderColor: 'rgba(255,255,255,0.14)',
              }}
            >
              <p
                className="mx-auto max-w-[28ch] text-center"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(1.08rem,3vw,1.45rem)',
                  lineHeight: 1.56,
                  color: immersivePalette.freezeTone,
                  opacity: 0.9,
                }}
              >
                I am not moving away from this moment.
              </p>
            </div>
          ) : isSilenceScreen ? (
            <div className="flex min-h-[58vh] items-center justify-center rounded-3xl bg-black/95">
              <motion.div
                className="h-16 w-px"
                animate={{ opacity: [0.14, 0.42, 0.14] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'rgba(255,255,255,0.28)' }}
                aria-hidden="true"
              />
            </div>
          ) : (
            <CurrentScreen
              onNext={handleNextWithControl}
              onPrev={handlePrevWithControl}
              onRestart={handleReplay}
              index={index}
              emotion={current.emotion}
              emotionPath={emotionPath}
              pushEmotionSignal={pushEmotionSignal}
              personalization={personalization}
              mood={mood}
              setMood={setMood}
              flowMode={flowMode}
              setFlowMode={handleSetFlowMode}
              isSilentMode={isSilentMode}
              toggleSilentMode={toggleSilentMode}
              isAttentionLocked={isAttentionLocked}
              replayCount={replayCount}
            />
          )}
        </PageTransition>

        {shouldShowControls ? (
          <div className="mt-8 rounded-2xl border border-white/15 bg-black/20 p-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                onClick={handlePrevWithControl}
                disabled={isFirst}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em] disabled:cursor-not-allowed disabled:opacity-45"
                style={{
                  borderColor: 'color-mix(in oklab, white 22%, transparent)',
                  color: activeTheme.textColor,
                  fontFamily: 'var(--font-dm-mono)',
                }}
              >
                Previous
              </motion.button>

              {allowTapToContinue && !isLast ? (
                <motion.button
                  onClick={handleNextWithControl}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
                  style={{
                    background: `linear-gradient(90deg, ${activeTheme.accentColor}, #f75590)`,
                    color: '#fff',
                    fontFamily: 'var(--font-dm-mono)',
                    boxShadow: `0 10px 24px ${activeTheme.glowColor}`,
                  }}
                >
                  Tap right to continue
                </motion.button>
              ) : null}

              {autoAdvance ? (
                <motion.button
                  onClick={isPaused ? resume : pause}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
                  style={{
                    borderColor: 'color-mix(in oklab, white 22%, transparent)',
                    color: activeTheme.textColor,
                    fontFamily: 'var(--font-dm-mono)',
                  }}
                >
                  {isPaused ? 'Resume Auto Pace' : 'Pause Auto Pace'}
                </motion.button>
              ) : null}

              <motion.button
                onClick={() => handleReplay()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
                style={{
                  borderColor: 'color-mix(in oklab, white 22%, transparent)',
                  color: activeTheme.textColor,
                  fontFamily: 'var(--font-dm-mono)',
                }}
              >
                Replay
              </motion.button>

              {shareEnabled ? (
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
                  style={{
                    borderColor: 'color-mix(in oklab, white 22%, transparent)',
                    color: activeTheme.textColor,
                    fontFamily: 'var(--font-dm-mono)',
                  }}
                >
                  Share
                </motion.button>
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

      {isAttentionLocked ? (
        <motion.div
          className="absolute inset-0 z-30"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            background: 'rgba(0, 0, 0, 0.08)',
            pointerEvents: 'auto',
          }}
        />
      ) : null}

      <motion.div
        className="pointer-events-none absolute inset-0 z-40 bg-black"
        variants={restartFadeMotion}
        initial="hidden"
        animate={isRestarting ? 'visible' : 'hidden'}
        transition={{ duration: isRestarting ? 0.65 : 0.72, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </main>
  );
}
