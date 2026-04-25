'use client';

import { useEffect, useState } from 'react';

/**
 * A 2px pink progress line fixed to the very top of the viewport.
 * Fills left-to-right as the user scrolls the page.
 * No percentage label — just the line.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(scrolled / total, 1) : 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9999,
        background: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background:
            'linear-gradient(to right, rgba(247, 85, 144, 0.7), rgba(255, 150, 200, 0.9))',
          transition: 'width 80ms linear',
        }}
      />
    </div>
  );
}
