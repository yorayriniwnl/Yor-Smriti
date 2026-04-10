export interface SafeFetchResult<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export async function safeFetchJson<T = any>(
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
    let parsed: any = undefined;

    if (contentType.includes('application/json')) {
      try {
        parsed = await response.json();
      } catch {
        parsed = undefined;
      }
    } else {
      // best-effort: try to parse text as JSON, otherwise return text
      try {
        const text = await response.text();
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = text;
        }
      } catch {
        parsed = undefined;
      }
    }

    if (!response.ok) {
      const errMsg = parsed && typeof parsed === 'object' && 'error' in parsed
        ? String((parsed as any).error)
        : response.statusText || `HTTP ${response.status}`;

      return { ok: false, status: response.status, error: errMsg, data: parsed };
    }

    return { ok: true, status: response.status, data: parsed };
  } catch (err: any) {
    // Preserve AbortError so callers that rely on it can detect it
    if (err && err.name === 'AbortError') {
      throw err;
    }

    return { ok: false, status: 0, error: err?.message ?? 'Network error' };
  } finally {
    if (typeof timeoutId === 'number') {
      clearTimeout(timeoutId);
    }
    if (cleanupExternal) cleanupExternal();
  }
}
