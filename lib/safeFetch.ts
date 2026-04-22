export interface SafeFetchResult<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export async function safeFetchJson<T = unknown>(
  input: RequestInfo,
  init: RequestInit = {},
  options?: { timeoutMs?: number }
): Promise<SafeFetchResult<T>> {
  const timeoutMs = options?.timeoutMs;
  const externalSignal = init.signal as AbortSignal | undefined;
  const combined = new AbortController();
  let cleanupExternal: (() => void) | null = null;
  let timeoutId: number | null = null;

  try {
    if (externalSignal) {
      if (externalSignal.aborted) {
        combined.abort();
      } else {
        const onAbort = () => combined.abort();
        externalSignal.addEventListener('abort', onAbort);
        cleanupExternal = () => externalSignal.removeEventListener('abort', onAbort);
      }
    }

    if (typeof timeoutMs === 'number' && timeoutMs > 0) {
      timeoutId = window.setTimeout(() => combined.abort(), timeoutMs);
    }

    const response = await fetch(input, { ...init, signal: combined.signal });
    const contentType = response.headers.get('content-type') ?? '';
    let parsed: unknown;

    if (contentType.includes('application/json')) {
      try { parsed = await response.json(); } catch { parsed = undefined; }
    } else {
      try {
        const text = await response.text();
        try { parsed = JSON.parse(text); } catch { parsed = text; }
      } catch { parsed = undefined; }
    }

    if (!response.ok) {
      const errMsg =
        parsed !== null &&
        typeof parsed === 'object' &&
        'error' in parsed &&
        typeof (parsed as Record<string, unknown>).error === 'string'
          ? (parsed as Record<string, unknown>).error as string
          : response.statusText || `HTTP ${response.status}`;
      return { ok: false, status: response.status, error: errMsg, data: parsed as T };
    }

    return { ok: true, status: response.status, data: parsed as T };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    const msg = err instanceof Error ? err.message : 'Network error';
    return { ok: false, status: 0, error: msg };
  } finally {
    if (typeof timeoutId === 'number') clearTimeout(timeoutId);
    if (cleanupExternal) cleanupExternal();
  }
}
