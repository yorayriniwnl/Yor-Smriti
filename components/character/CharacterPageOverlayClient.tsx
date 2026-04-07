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
    // Never mount overlay on root path (home) and keep it desktop-only.
    if (pathname === '/') return;

    const mq = window.matchMedia('(min-width: 768px)');
    if (!mq.matches) return;

    let idleId: number | null = null;

    if ('requestIdleCallback' in window) {
      // @ts-ignore
      idleId = (window as any).requestIdleCallback(() => setShow(true), { timeout: 1200 });
    } else {
      idleId = (window as any).setTimeout(() => setShow(true), 900);
    }

    return () => {
      if (idleId !== null) {
        if ('cancelIdleCallback' in window) {
          // @ts-ignore
          (window as any).cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId as number);
        }
      }
    };
  }, [pathname]);

  return show ? <CharacterPageOverlay /> : null;
}
