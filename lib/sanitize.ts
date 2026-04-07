export function sanitizeString(
  input: unknown,
  options?: { maxLength?: number; allowNewlines?: boolean; collapseWhitespace?: boolean }
): string {
  if (input === null || input === undefined) return '';

  let s = typeof input === 'string' ? input : String(input);

  // normalize line endings
  s = s.replace(/\r\n?/g, '\n');

  const allowNewlines = Boolean(options?.allowNewlines);

  // remove control characters (preserve newline when allowed)
  const ctrlRegex = allowNewlines ? /[\x00-\x09\x0B-\x1F\x7F]/g : /[\x00-\x1F\x7F]/g;
  s = s.replace(ctrlRegex, '');

  const collapse = options?.collapseWhitespace ?? true;
  if (collapse) {
    if (allowNewlines) {
      // collapse spaces/tabs but preserve newlines; trim each line
      s = s.replace(/[ \t\f\v]+/g, ' ');
      s = s.replace(/\n{2,}/g, '\n');
      s = s.split('\n').map((l) => l.trim()).join('\n');
    } else {
      s = s.replace(/\s+/g, ' ');
    }
  }

  s = s.trim();

  const max = typeof options?.maxLength === 'number' ? options.maxLength : 1000;
  if (s.length > max) s = s.slice(0, max);

  return s;
}
