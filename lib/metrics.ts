type Labels = Record<string, string>;

const registry = new Map<string, Map<string, number>>();

function labelsKey(labels?: Labels) {
  if (!labels || Object.keys(labels).length === 0) return '';
  return Object.entries(labels)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '\\"')}"`)
    .join(',');
}

export function incMetric(name: string, labels?: Labels, amount = 1) {
  let family = registry.get(name);
  if (!family) {
    family = new Map();
    registry.set(name, family);
  }
  const key = labelsKey(labels);
  family.set(key, (family.get(key) ?? 0) + amount);
}

export function setGauge(name: string, labels: Labels | undefined, value: number) {
  let family = registry.get(name);
  if (!family) {
    family = new Map();
    registry.set(name, family);
  }
  const key = labelsKey(labels);
  family.set(key, value);
}

export function getPrometheusMetrics(): string {
  let out = '';
  for (const [name, family] of registry) {
    out += `# TYPE ${name} counter\n`;
    for (const [labelKey, val] of family) {
      const labels = labelKey ? `{${labelKey}}` : '';
      out += `${name}${labels} ${val}\n`;
    }
  }
  return out;
}
