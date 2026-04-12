'use client';

import { useSearchParams } from 'next/navigation';

export function useSequenceMode(param: string = 'sequence') {
  const searchParams = useSearchParams();
  return searchParams.get(param) === '1';
}
