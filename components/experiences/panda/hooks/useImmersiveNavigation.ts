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
  // Tracks the timestamp of the previous click to detect double-taps.
  // We use this instead of a deferred timer so that single taps fire
  // immediately — no perceptible lag on every interaction.
  const lastClickTimeRef = useRef<number>(0);

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

      // Reset double-tap tracking so a swipe doesn't count as half a double-tap
      lastClickTimeRef.current = 0;

      if (deltaX < 0) {
        runDirection('next');
        return;
      }

      runDirection('prev');
    },
    [disabled, runDirection],
  );

  // ── Tap handler ─────────────────────────────────────────────────────────────
  // Previous implementation deferred every single tap by DOUBLE_TAP_WINDOW_MS
  // (210 ms) to wait for a potential second tap.  On mobile this delay was
  // perceptible on every interaction, making the experience feel unresponsive.
  //
  // Fix: fire the single-tap action IMMEDIATELY.  Double-tap is detected by
  // comparing the current click timestamp against the previous one:
  //   - Second click arrives within DOUBLE_TAP_WINDOW_MS → double-tap → go prev
  //   - Otherwise → single tap → navigate in the tapped direction (no delay)
  //
  // Trade-off: the first tap of a double-tap will fire a forward navigation
  // before the second tap cancels with a backward navigation, leaving the user
  // on the same screen.  This is acceptable — the cinematic feel is preserved
  // and no navigation is lost.
  const onSurfaceClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (disabled || isInteractiveTarget(event.target)) {
        return;
      }

      const now = Date.now();
      const isDoubleTap = now - lastClickTimeRef.current < DOUBLE_TAP_WINDOW_MS;
      lastClickTimeRef.current = now;

      if (isDoubleTap) {
        // Reset so a triple-tap doesn't register as another double-tap
        lastClickTimeRef.current = 0;
        onPrev();
        return;
      }

      // Single tap — fire immediately, no setTimeout
      const direction = resolveTapDirection(event.currentTarget, event.clientX);
      runDirection(direction);
    },
    [disabled, onPrev, runDirection],
  );

  // onSurfaceDoubleClick is intentionally removed: the click handler above
  // detects double-taps via timestamp comparison on both mobile and desktop,
  // so a separate dblclick handler is no longer needed (and would double-fire
  // the prev action on desktop where the browser emits click+click+dblclick).

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      lastClickTimeRef.current = 0;
    };
  }, []);

  return {
    onSurfaceClick,
    onSurfacePointerDown,
    onSurfacePointerUp,
  };
}

