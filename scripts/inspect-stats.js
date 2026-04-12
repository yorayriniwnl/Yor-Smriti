const fs = require('fs');
const path = require('path');

const statsPath = process.argv[2] || path.join(process.cwd(), '.next', 'analyze', 'client-stats.json');
if (!fs.existsSync(statsPath)) {
  console.error('stats file not found:', statsPath);
  process.exit(1);
}

const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

let found = [];

function checkModuleEntry(m, path) {
  if (!m || typeof m !== 'object') return;
  const candidates = [m.name, m.identifier, m.moduleName, m.identifierName, m.names, m.request];
  for (const c of candidates) {
    if (typeof c === 'string' && c.toLowerCase().includes('hls')) {
      found.push({ name: c, size: m.size || m.statSize || 0, module: m, path });
      return;
    }
  }
}

function searchModulesRoot(obj, basePath = 'root') {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj.modules)) {
    for (let i = 0; i < obj.modules.length; i++) {
      checkModuleEntry(obj.modules[i], `${basePath}.modules[${i}]`);
    }
  }
  if (Array.isArray(obj.children)) {
    for (let i = 0; i < obj.children.length; i++) {
      searchModulesRoot(obj.children[i], `${basePath}.children[${i}]`);
    }
  }
}

// Check top-level modules and recursively through children
searchModulesRoot(stats, 'stats');

if (!found.length) {
  console.log('No hls-related module entries found in stats.modules/children structure.');
  process.exit(0);
}

console.log('Found', found.length, 'matching module entries (showing up to 50):\n');
for (let i = 0; i < Math.min(50, found.length); i++) {
  const f = found[i];
  console.log(`- ${i + 1}. ${f.size.toLocaleString()} bytes  ${f.name}`);
  const keys = ['id','identifier','moduleName','names','size','reasons','chunks','issuer','issuerName','request'];
  for (const k of keys) {
    if (f.module && f.module[k] !== undefined) {
      console.log(`    ${k}: ${JSON.stringify(f.module[k])}`);
    }
  }
  console.log('    path:', f.path);
  console.log('');
}

console.log('Done.');
