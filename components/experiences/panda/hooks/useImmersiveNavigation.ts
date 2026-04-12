'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { MouseEventHandler, PointerEventHandler } from 'react';
import {
  DOUBLE_TAP_WINDOW_MS,
  INTERACTIVE_NAV_SELECTOR,
  SWIPE_MAX_DURATION_MS,
  SWIPE_MIN_DISTANCE_PX,
} from '@/components/experiences/panda/engine/navigation';

type Direction = 'next' | 'prev';

interface PointerSnapshot {
  x: number;
  y: number;
  timestamp: number;
}

interface UseImmersiveNavigationOptions {
  onNext: () => void;
  onPrev: () => void;
  disabled?: boolean;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest(INTERACTIVE_NAV_SELECTOR));
}

function resolveTapDirection(target: HTMLDivElement, clientX: number): Direction {
  const bounds = target.getBoundingClientRect();
  return clientX < bounds.left + bounds.width / 2 ? 'prev' : 'next';
}

export function useImmersiveNavigation({
  onNext,
  onPrev,
  disabled = false,
}: UseImmersiveNavigationOptions) {
  const pointerStartRef = useRef<PointerSnapshot | null>(null);
  const clickTimerRef = useRef<number | null>(null);

  const clearClickTimer = useCallback(() => {
    if (clickTimerRef.current === null) {
      return;
    }

    window.clearTimeout(clickTimerRef.current);
    clickTimerRef.current = null;
  }, []);

  const runDirection = useCallback(
    (direction: Direction) => {
      if (disabled) {
        return;
      }

      if (direction === 'next') {
        onNext();
        return;
      }

      onPrev();
    },
    [disabled, onNext, onPrev],
  );

  const onSurfacePointerDown: PointerEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (disabled || isInteractiveTarget(event.target)) {
        pointerStartRef.current = null;
        return;
      }

      pointerStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
      };
    },
    [disabled],
  );

  const onSurfacePointerUp: PointerEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (disabled || isInteractiveTarget(event.target)) {
        pointerStartRef.current = null;
        return;
      }

      const start = pointerStartRef.current;
      pointerStartRef.current = null;

      if (!start) {
        return;
      }

      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      const elapsed = Date.now() - start.timestamp;

      const isHorizontalSwipe =
        elapsed <= SWIPE_MAX_DURATION_MS
        && Math.abs(deltaX) >= SWIPE_MIN_DISTANCE_PX
        && Math.abs(deltaX) > Math.abs(deltaY);

      if (!isHorizontalSwipe) {
        return;
      }

      clearClickTimer();
      if (deltaX < 0) {
        runDirection('next');
        return;
      }

      runDirection('prev');
    },
    [clearClickTimer, disabled, runDirection],
  );

  const onSurfaceClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (disabled || isInteractiveTarget(event.target)) {
        return;
      }

      clearClickTimer();
      const direction = resolveTapDirection(event.currentTarget, event.clientX);

      clickTimerRef.current = window.setTimeout(() => {
        runDirection(direction);
        clickTimerRef.current = null;
      }, DOUBLE_TAP_WINDOW_MS);
    },
    [clearClickTimer, disabled, runDirection],
  );

  const onSurfaceDoubleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (disabled || isInteractiveTarget(event.target)) {
        return;
      }

      clearClickTimer();
      onPrev();
    },
    [clearClickTimer, disabled, onPrev],
  );

  useEffect(() => {
    return () => {
      clearClickTimer();
    };
  }, [clearClickTimer]);

  return {
    onSurfaceClick,
    onSurfaceDoubleClick,
    onSurfacePointerDown,
    onSurfacePointerUp,
  };
}
