#!/usr/bin/env node
/**
 * Home dashboard UI contract — protects AutoPilot/Manual home screen + debug entry.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contract = JSON.parse(fs.readFileSync(path.join(__dirname, 'home-ui-contract.json'), 'utf8'));

console.log('\n⚠️  HOME UI LOCK — ' + contract.description + '\n');

let failed = false;

function fail(msg) {
  console.error('✗ ' + msg);
  failed = true;
}

function pass(msg) {
  console.log('✓ ' + msg);
}

for (const rel of contract.files) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${rel}`);
    continue;
  }
  const src = fs.readFileSync(filePath, 'utf8');
  console.log(`\nVerifying ${rel}…`);

  for (const pattern of contract.requiredPatterns) {
    if (!src.includes(pattern)) fail(`${rel}: missing pattern "${pattern}"`);
    else pass(`${rel}: ${pattern}`);
  }

  for (const name of contract.requiredFunctions) {
    const fnPattern = new RegExp(`function\\s+${name}\\s*\\(`);
    if (!fnPattern.test(src)) fail(`${rel}: missing function ${name}()`);
    else pass(`${rel}: ${name}()`);
  }
}

if (failed) {
  console.error('\nHome UI contract FAILED (' + contract.id + ')\n');
  process.exit(1);
}

console.log('\nHome UI contract OK (' + contract.id + ' v' + contract.version + ')\n');
