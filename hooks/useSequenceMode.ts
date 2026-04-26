'use client';

import { useMemo } from 'react';

/**
 * Returns true when this page is embedded by the root sequence runner
 * (i.e. the URL contains ?sequence=1).  The value is stable for the
 * lifetime of the page — the param never changes while the page is live.
 */
export function useSequenceMode(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('sequence') === '1';
  }, []);
}
