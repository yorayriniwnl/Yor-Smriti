/**
 * Returns true when a string is still an unfilled bracket placeholder
 * such as "[SHORT TITLE]" or "[Memory 1: ...]".
 */
export function isPlaceholder(s: string): boolean {
  const t = s.trim();
  return t.startsWith('[') && (t.endsWith(']') || t.endsWith('.]'));
}

/**
 * Returns true when every item in a string array is still a placeholder.
 * Used by content pages to show a graceful "coming soon" state instead of
 * raw bracket text reaching the recipient.
 */
export function allPlaceholders(items: string[]): boolean {
  return items.length === 0 || items.every(isPlaceholder);
}
