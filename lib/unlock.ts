import { signScopedToken, verifyScopedToken } from './auth';

export const HER_UNLOCK_COOKIE = 'her_unlocked';
export const HER_UNLOCK_MAX_AGE_SECS = 2 * 60 * 60; // 2 hours

const HER_UNLOCK_SCOPE = 'for-her-alone/content';

export function signHerUnlockToken(): string {
  return signScopedToken(HER_UNLOCK_SCOPE, HER_UNLOCK_MAX_AGE_SECS);
}

export function verifyHerUnlockToken(token: string | null | undefined): boolean {
  return Boolean(token && verifyScopedToken(token, HER_UNLOCK_SCOPE));
}
