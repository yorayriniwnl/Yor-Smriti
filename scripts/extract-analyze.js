const fs = require('fs');
const path = require('path');

const analyzeDir = path.join(process.cwd(), '.next', 'analyze');
const candidates = [
  path.join(analyzeDir, 'client-stats.json'),
  path.join(analyzeDir, 'nodejs-stats.json'),
  path.join(analyzeDir, 'stats.json'),
  path.join(analyzeDir, 'client.json'),
];

let statsPath = null;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    statsPath = p;
    break;
  }
}

if (!statsPath) {
  console.error('No stats JSON found in .next/analyze. Run build with generateStatsFile option.');
  process.exit(1);
}

const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

const modulesMap = new Map();

function addModule(name, size) {
  if (!name) return;
  const prev = modulesMap.get(name) || 0;
  modulesMap.set(name, prev + (size || 0));
}

function collectModules(obj) {
  if (!obj) return;
  if (Array.isArray(obj.modules)) {
    for (const m of obj.modules) {
      const name = m.name || m.identifier || m.id || m.identifierName || m.moduleName || m.names || m.identifier;
      const size = m.size || m.statSize || 0;
      addModule(name, size);
      if (m.modules) collectModules(m);
    }
  }
  if (Array.isArray(obj.children)) {
    for (const c of obj.children) collectModules(c);
  }
}

collectModules(stats);

const sorted = Array.from(modulesMap.entries()).sort((a, b) => b[1] - a[1]);

console.log('Using stats file:', statsPath);
console.log('Top 50 modules by size (bytes):');
for (let k = 0; k < Math.min(50, sorted.length); k++) {
  const [name, size] = sorted[k];
  console.log(`${k + 1}. ${size.toLocaleString()}  ${name}`);
}

console.log('\nTotal unique modules discovered:', modulesMap.size);
