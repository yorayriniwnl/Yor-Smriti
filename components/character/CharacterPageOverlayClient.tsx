"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import LoadingFallback from '@/components/ui/LoadingFallback';

const CharacterPageOverlay = dynamic(
  () => import('./CharacterPageOverlay').then((m) => m.CharacterPageOverlay),
  { ssr: false, loading: () => <LoadingFallback compact /> }
);

export default function CharacterPageOverlayClient() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    if (!mq.matches) return;

    type IdleWindow = {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    } & Window;

    const w = window as unknown as IdleWindow;
    let idleId: number | null = null;

    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(() => setShow(true), { timeout: 1200 });
    } else {
      idleId = window.setTimeout(() => setShow(true), 900);
    }

    return () => {
      if (idleId !== null) {
        if (typeof w.cancelIdleCallback === 'function') {
          w.cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId as number);
        }
      }
    };
  }, [pathname]);

  return show ? <CharacterPageOverlay /> : null;
}
