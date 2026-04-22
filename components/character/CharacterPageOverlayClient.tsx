"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingFallback from '@/components/ui/LoadingFallback';

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
  cancelIdleCallback?: (id: number) => void;
};

const CharacterPageOverlay = dynamic(
  () => import('./CharacterPageOverlay').then((m) => m.CharacterPageOverlay),
  { ssr: false, loading: () => <LoadingFallback compact /> }
);

export default function CharacterPageOverlayClient() {
  const pathname = usePathname();
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
  }, [pathname]);

  return show ? <CharacterPageOverlay /> : null;
}
