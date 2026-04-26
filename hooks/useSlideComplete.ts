/**
 * useSlideComplete — Bug 51 fix.
 *
 * 17 out of 20 experience pages never sent `yor:slide-complete` to the parent
 * sequence runner. Every one of those pages hit the 45-second
 * EXPERIENCE_PAGE_DURATION_MS timeout before advancing. This hook provides a
 * single consistent implementation that all reading-style pages can use.
 *
 * Completion strategies:
 *  1. Scroll-primary (default): fires when user scrolls within 80px of the
 *     page bottom — the natural signal that they have finished reading.
 *  2. Timer fallback: fires after `maxWaitMs` regardless, so no page can hold
 *     the sequence hostage when the user never reaches the bottom.
 *  3. Manual: call the returned `signal()` function directly. Pass
 *     { triggerOnScrollBottom: false } to disable scroll watching (for nav
 *     or interactive pages such as /hub and /love-sorry).
 *  4. Fires only once per mount — a `firedRef` prevents duplicate postMessages
 *     if both the scroll and the timer fire in the same tick.
 *  5. No-ops completely when the page is opened directly (no ?sequence=1).
 */
'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSequenceMode } from './useSequenceMode';

interface UseSlideCompleteOptions {
  /** Fire when the user scrolls within 80 px of the page bottom. Default: true */
  triggerOnScrollBottom?: boolean;
  /**
   * Maximum ms to wait before auto-advancing even if the user has not scrolled
   * to the bottom. Default: 30 000 ms.
   */
  maxWaitMs?: number;
}

export function useSlideComplete(options: UseSlideCompleteOptions = {}) {
  const isSequenceMode = useSequenceMode();
  const firedRef = useRef(false);
  const {
    triggerOnScrollBottom = true,
    maxWaitMs = 30_000,
  } = options;

  const signal = useCallback(() => {
    if (!isSequenceMode || firedRef.current) return;
    firedRef.current = true;
    try {
      window.parent.postMessage({ type: 'yor:slide-complete' }, window.location.origin);
    } catch {
      // Cross-origin guard — same-origin embeds should never throw, but
      // belt-and-suspenders for sandboxed iframes.
    }
  }, [isSequenceMode]);

  useEffect(() => {
    if (!isSequenceMode) return;

    firedRef.current = false;

    const timer = window.setTimeout(signal, maxWaitMs);

    if (!triggerOnScrollBottom) {
      return () => window.clearTimeout(timer);
    }

    const checkScroll = () => {
      const scrolledTo = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrolledTo >= docHeight - 80) signal();
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    // Check immediately — short/viewport-fitting pages are already "at bottom".
    checkScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', checkScroll);
    };
  }, [isSequenceMode, signal, maxWaitMs, triggerOnScrollBottom]);

  return { signal };
}
