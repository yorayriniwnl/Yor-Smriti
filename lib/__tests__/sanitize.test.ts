/**
 * Unit tests for lib/sanitize.ts
 *
 * sanitizeString is applied to every user-submitted field (chat messages,
 * reply text, mood values) before it is stored or sent in email. A regression
 * here allows control characters, oversized payloads, or malformed strings
 * through to the database and email body.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeString } from '../sanitize';

// ─── Basic output contract ────────────────────────────────────────────────────

describe('sanitizeString — basic', () => {
  it('returns an empty string for null', () => {
    expect(sanitizeString(null)).toBe('');
  });

  it('returns an empty string for undefined', () => {
    expect(sanitizeString(undefined)).toBe('');
  });

  it('coerces a number to string', () => {
    expect(sanitizeString(42)).toBe('42');
  });

  it('coerces a boolean to string', () => {
    expect(sanitizeString(true)).toBe('true');
  });

  it('passes a clean string through unchanged (modulo trim)', () => {
    expect(sanitizeString('hello world')).toBe('hello world');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });
});

// ─── Control character removal ────────────────────────────────────────────────

describe('sanitizeString — control characters', () => {
  it('removes null bytes', () => {
    expect(sanitizeString('hel\x00lo')).toBe('hello');
  });

  it('removes ASCII control characters (0x01–0x1F)', () => {
    // Build a string with every control char except newline
    const controls = Array.from({ length: 31 }, (_, i) => String.fromCharCode(i + 1))
      .filter((c) => c !== '\n')
      .join('');
    expect(sanitizeString(`a${controls}b`)).toBe('ab');
  });

  it('removes DEL (0x7F)', () => {
    expect(sanitizeString('hel\x7Flo')).toBe('hello');
  });

  it('removes carriage returns and newlines when allowNewlines is false (default)', () => {
    // CRLF is normalised to LF first, then LF is stripped as a control character.
    // No space is inserted in their place — the lines are joined directly.
    expect(sanitizeString('line1\r\nline2')).toBe('line1line2');
  });
});

// ─── Newline handling ─────────────────────────────────────────────────────────

describe('sanitizeString — newline handling', () => {
  it('strips newlines by default (allowNewlines: false)', () => {
    const result = sanitizeString('line1\nline2');
    expect(result).not.toContain('\n');
  });

  it('preserves newlines when allowNewlines: true', () => {
    const result = sanitizeString('line1\nline2', { allowNewlines: true });
    expect(result).toContain('\n');
  });

  it('normalises CRLF to LF when allowNewlines: true', () => {
    const result = sanitizeString('line1\r\nline2', { allowNewlines: true });
    expect(result).toBe('line1\nline2');
  });

  it('collapses multiple blank lines to one when allowNewlines: true', () => {
    const result = sanitizeString('a\n\n\nb', { allowNewlines: true });
    expect(result).toBe('a\nb');
  });

  it('trims whitespace from each line when allowNewlines: true', () => {
    const result = sanitizeString('  a  \n  b  ', { allowNewlines: true });
    expect(result).toBe('a\nb');
  });
});

// ─── Whitespace collapsing ────────────────────────────────────────────────────

describe('sanitizeString — whitespace collapsing', () => {
  it('collapses multiple spaces to one by default', () => {
    expect(sanitizeString('too   many   spaces')).toBe('too many spaces');
  });

  it('strips tabs entirely (tab is a control character, 0x09)', () => {
    // Tabs fall within the control-char strip range (0x00–0x1F) and are
    // removed before whitespace collapsing runs. They are not converted to spaces.
    expect(sanitizeString('a\t\tb')).toBe('ab');
  });

  it('preserves internal spaces when collapseWhitespace: false', () => {
    const result = sanitizeString('a   b', { collapseWhitespace: false });
    expect(result).toBe('a   b');
  });

  it('collapses spaces/tabs but not newlines when allowNewlines: true', () => {
    const result = sanitizeString('a   b\n  c  d', { allowNewlines: true });
    expect(result).toBe('a b\nc d');
  });
});

// ─── maxLength ────────────────────────────────────────────────────────────────

describe('sanitizeString — maxLength', () => {
  it('defaults to 1000 characters', () => {
    const long = 'a'.repeat(2000);
    expect(sanitizeString(long)).toHaveLength(1000);
  });

  it('respects a custom maxLength', () => {
    expect(sanitizeString('hello world', { maxLength: 5 })).toBe('hello');
  });

  it('does not truncate strings within the limit', () => {
    expect(sanitizeString('short', { maxLength: 100 })).toBe('short');
  });

  it('truncates after control char removal (not before)', () => {
    // The null bytes will be removed first, leaving 5 real chars
    const input = '\x00\x00\x00hello';
    expect(sanitizeString(input, { maxLength: 3 })).toBe('hel');
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('sanitizeString — edge cases', () => {
  it('returns empty string for a string of only whitespace', () => {
    expect(sanitizeString('   ')).toBe('');
  });

  it('returns empty string for a string of only control characters', () => {
    expect(sanitizeString('\x01\x02\x03')).toBe('');
  });

  it('handles unicode content without stripping it', () => {
    expect(sanitizeString('こんにちは')).toBe('こんにちは');
  });

  it('handles emoji without stripping them', () => {
    expect(sanitizeString('hello 🌸')).toBe('hello 🌸');
  });

  it('handles an empty string input', () => {
    expect(sanitizeString('')).toBe('');
  });
});
