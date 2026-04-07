const fs = require('fs');
const path = require('path');

const root = process.argv[2] || process.cwd();
const needle = process.argv[3] || '@react-three/drei';

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
      walk(full, cb);
    } else if (e.isFile()) {
      if (!/\.(ts|tsx|js|jsx|mjs|cjs|html)$/.test(e.name)) continue;
      cb(full);
    }
  }
}

const results = [];
walk(root, (file) => {
  try {
    const s = fs.readFileSync(file, 'utf8');
    const lines = s.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(needle)) {
        results.push({ file, line: i + 1, text: lines[i].trim() });
      }
    }
  } catch (e) {
    // ignore
  }
});

if (!results.length) {
  console.log('No occurrences of', needle, 'found under', root);
  process.exit(0);
}

for (const r of results) {
  console.log(`${r.file}:${r.line}: ${r.text}`);
}
