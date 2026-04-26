'use client';

import { useCallback, useRef } from 'react';

type EventName =
  | 'experience_opened'
  | 'screen_viewed'
  | 'screen_completed'
  | 'letter_read'
  | 'promise_accepted'
  | 'all_promises_accepted'
  | 'experience_completed'
  | 'chat_sent'
  | 'song_played'
  | 'apology_opened'
  | 'timeline_viewed'
  | 'stars_viewed'
  | 'promise_viewed'
  | 'reasons_viewed';

interface TrackOptions {
  screen?: string | number;
  meta?: Record<string, string | number | boolean>;
}

// Fire-and-forget — we never block the UI for analytics
async function sendEvent(event: EventName, options?: TrackOptions): Promise<void> {
  try {
    await fetch('/api/events', {
      method: 'POST',
      // Bug 48 fix: credentials was missing here, so the session cookie was
      // never sent. /api/events requires a valid session, so every event
      // returned 401 silently — the entire analytics system tracked nothing.
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'x-yor-csrf': '1' },
      body: JSON.stringify({ event, ...options }),
    });
  } catch {
    // Silently swallow — tracking should never break the experience
  }
}

/**
 * Returns a stable `track` function. Safe to call in event handlers.
 * Deduplicates repeated calls for the same event+screen within 500ms.
 */
export function useEventTracking() {
  const lastCallRef = useRef<Map<string, number>>(new Map());

  const track = useCallback((event: EventName, options?: TrackOptions) => {
    const key = `${event}:${options?.screen ?? ''}`;
    const now = Date.now();
    const last = lastCallRef.current.get(key) ?? 0;

    // Debounce: skip if same event fired < 500ms ago
    if (now - last < 500) return;
    lastCallRef.current.set(key, now);

    // Fire async, don't await
    void sendEvent(event, options);
  }, []);

  return { track };
}
