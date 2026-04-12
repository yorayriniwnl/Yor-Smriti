#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sodium = require('libsodium-wrappers');

function usage() {
  console.log('Usage: GITHUB_TOKEN=... node scripts/set-github-secrets.js --repo owner/repo [--file scripts/secrets.json]');
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--repo') {
      out.repo = args[++i];
    } else if (a === '--file') {
      out.file = args[++i];
    } else if (a === '--token') {
      out.token = args[++i];
    } else {
      console.warn('Unknown arg', a);
    }
  }
  return out;
}

async function setSecret(owner, repo, name, value, token) {
  const publicKeyUrl = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`;
  const opts = { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } };

  const pkRes = await fetch(publicKeyUrl, opts);
  if (!pkRes.ok) throw new Error(`Failed to fetch public key: ${pkRes.status} ${await pkRes.text()}`);
  const pkJson = await pkRes.json();
  const keyId = pkJson.key_id;
  const key = pkJson.key; // base64

  await sodium.ready;
  const publicKeyBytes = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
  const messageBytes = Buffer.from(String(value));
  const sealed = sodium.crypto_box_seal(messageBytes, publicKeyBytes);
  const encrypted_value = Buffer.from(sealed).toString('base64');

  const putUrl = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${encodeURIComponent(name)}`;
  const putRes = await fetch(putUrl, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ encrypted_value, key_id: keyId }),
  });
  if (!putRes.ok) {
    throw new Error(`Failed to upsert secret ${name}: ${putRes.status} ${await putRes.text()}`);
  }
  console.log(`Synced secret ${name}`);
}

async function main() {
  const args = parseArgs();
  const token = args.token || process.env.GITHUB_TOKEN;
  const repo = args.repo;
  const file = args.file || path.join(__dirname, 'secrets.example.json');

  if (!token || !repo) usage();

  let secrets = {};
  try {
    const raw = fs.readFileSync(file, 'utf8');
    secrets = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read secrets file:', e.message);
    process.exit(1);
  }

  const [owner, repository] = repo.split('/');
  if (!owner || !repository) usage();

  for (const [name, value] of Object.entries(secrets)) {
    if (!value || String(value).startsWith('<')) {
      console.log(`Skipping ${name}: empty or placeholder`);
      continue;
    }
    await setSecret(owner, repository, name, value, token);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
