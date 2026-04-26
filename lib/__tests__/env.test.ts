import { afterEach, describe, expect, it, vi } from 'vitest';
import { validateEnv } from '../env';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('validateEnv', () => {
  it('warns instead of failing when AUTH_SECRET is missing outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('AUTH_SECRET', '');

    const result = validateEnv();

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toContainEqual(expect.stringContaining('AUTH_SECRET is required'));
  });

  it('fails when AUTH_SECRET is missing in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('AUTH_SECRET', '');

    const result = validateEnv();

    expect(result.ok).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining('AUTH_SECRET is required'));
  });

  it('warns on short AUTH_SECRET outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('AUTH_SECRET', 'too-short');

    const result = validateEnv();

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toContain('AUTH_SECRET must be at least 32 characters');
  });

  it('fails on short AUTH_SECRET in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('AUTH_SECRET', 'too-short');

    const result = validateEnv();

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('AUTH_SECRET must be at least 32 characters');
  });
});
