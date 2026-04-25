/**
 * Parses Prometheus text-format metric output into a simple key→number map.
 * Repeated metric names (e.g. with different labels) are summed together.
 *
 * Used by: app/admin/page.tsx, app/api/admin/stats/route.ts, app/api/metrics/route.ts
 */
export function parseMetrics(raw: string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const line of raw.split('\n')) {
    if (line.startsWith('#') || !line.trim()) continue;
    const match = line.match(/^([a-z_]+)(?:\{[^}]*\})?\s+([\d.e+\-]+)/);
    if (match) {
      result[match[1]] = (result[match[1]] ?? 0) + parseFloat(match[2]);
    }
  }
  return result;
}
