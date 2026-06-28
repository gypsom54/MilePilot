#!/usr/bin/env node
/** Cross-platform: copy frontend/ → assets/web/ for Expo asset bundling */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DEST = path.join(ROOT, 'assets', 'web');
const FRONTEND = path.join(ROOT, 'frontend');

function cp(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

const rootFiles = ['index.html', 'version.txt', 'service-worker.js', 'manifest.json', 'icon.svg'];
fs.mkdirSync(path.join(DEST, 'js'), { recursive: true });

for (const f of rootFiles) {
  const src = path.join(FRONTEND, f);
  if (fs.existsSync(src)) cp(src, path.join(DEST, f));
}

const jsDir = path.join(FRONTEND, 'js');
if (fs.existsSync(jsDir)) {
  for (const f of fs.readdirSync(jsDir).filter((n) => n.endsWith('.js'))) {
    cp(path.join(jsDir, f), path.join(DEST, 'js', f));
  }
}

console.log('Synced frontend → assets/web/ (' + new Date().toISOString() + ')');
