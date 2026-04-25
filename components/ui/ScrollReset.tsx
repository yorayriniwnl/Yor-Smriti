'use client';

import { useEffect } from 'react';

/**
 * Forces window.scrollTo(0, 0) on mount.
 * Drop this into any page that should always open at the top.
 *
 * Usage:
 *   <ScrollReset />
 */
export function ScrollReset() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return null;
}
