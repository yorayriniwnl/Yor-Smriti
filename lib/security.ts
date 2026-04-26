import crypto from 'crypto';

/**
 * Timing-safe string comparison for secrets (e.g. APP_PASSWORD).
 *
 * Both inputs are SHA-256 hashed before comparison for two reasons:
 *   1. Length normalisation — `timingSafeEqual` requires equal-length Buffers.
 *      Hashing always produces a fixed 32-byte digest, so we never have to pad
 *      or truncate the inputs.
 *   2. Timing safety — the comparison time is now constant with respect to the
 *      *hash* length (always 32 bytes), not the raw input length.  This prevents
 *      an attacker from inferring password length via timing side-channels.
 *
 * Note: hashing here is NOT for secrecy — the inputs are compared in-process
 * and are not stored.  It is purely a length-normalisation technique so that
 * `timingSafeEqual` can do its job.  Future maintainers: do not replace this
 * with a direct `timingSafeEqual(Buffer.from(a), Buffer.from(b))` call — that
 * leaks length information when the two strings differ in byte length.
 */
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
