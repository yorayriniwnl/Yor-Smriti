import crypto from 'crypto';

export function secureCompare(a: string, b: string): boolean {
  const ah = crypto.createHash('sha256').update(String(a), 'utf8').digest();
  const bh = crypto.createHash('sha256').update(String(b), 'utf8').digest();
  if (ah.length !== bh.length) return false;
  try {
    return crypto.timingSafeEqual(ah, bh);
  } catch {
    return false;
  }
}
