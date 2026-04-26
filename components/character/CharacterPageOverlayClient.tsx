"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import LoadingFallback from '@/components/ui/LoadingFallback';

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
  cancelIdleCallback?: (id: number) => void;
};

const CharacterPageOverlay = dynamic(
  () => import('./CharacterPageOverlay').then((m) => m.CharacterPageOverlay),
  { ssr: false, loading: () => <LoadingFallback compact /> }
);

// Fix #21: `pathname` was previously in the useEffect deps array, which caused the
// character to fully unmount + remount (destroying animation state and triggering
// the 900–1200 ms LoadingFallback flash) on every route change.
//
// The character is mounted once for the lifetime of the layout that renders this
// component. `pathname` is not needed for the show-once-on-idle logic — removing
// it from deps means the effect runs only on initial mount, which is correct.
export default function CharacterPageOverlayClient() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Desktop-only for performance — the SVG character is large and animated.
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    const idleWindow = window as IdleWindow;
    let idleId: number | null = null;
    const requestIdle = idleWindow.requestIdleCallback;

    if (typeof requestIdle === 'function') {
      idleId = requestIdle(() => setShow(true), { timeout: 1200 });
    } else {
      idleId = window.setTimeout(() => setShow(true), 900);
    }

    return () => {
      if (idleId === null) return;
      if (typeof idleWindow.cancelIdleCallback === 'function') {
        idleWindow.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, []);

  return show ? <CharacterPageOverlay /> : null;
}
