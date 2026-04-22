/**
 * Wrapper around fetch() for all client → API calls.
 * 
 * Automatically adds:
 * - Content-Type: application/json
 * - x-yor-csrf: 1  (CSRF token — cross-origin requests can't set custom headers)
 * - credentials: same-origin  (sends session cookie)
 */
export async function fetchApi<T = unknown>(
  path: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    signal?: AbortSignal;
  }
): Promise<{ ok: boolean; data?: T; error?: string; status: number }> {
  const method = options?.method ?? (options?.body ? 'POST' : 'GET');

  const headers: Record<string, string> = {
    'x-yor-csrf': '1',
    'credentials': 'same-origin',
  };
  if (options?.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(path, {
      method,
      headers,
      credentials: 'same-origin',
      signal: options?.signal,
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const contentType = res.headers.get('content-type') ?? '';
    let data: T | undefined;
    let error: string | undefined;

    if (contentType.includes('application/json')) {
      const json = await res.json() as Record<string, unknown>;
      if (res.ok) {
        data = json as T;
      } else {
        error = typeof json['error'] === 'string' ? json['error'] : `HTTP ${res.status}`;
      }
    } else if (!res.ok) {
      error = `HTTP ${res.status}`;
    }

    return { ok: res.ok, data, error, status: res.status };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';
    // Rethrow AbortError so callers can detect cancellation
    if (err instanceof Error && err.name === 'AbortError') throw err;
    return { ok: false, error: msg, status: 0 };
  }
}
