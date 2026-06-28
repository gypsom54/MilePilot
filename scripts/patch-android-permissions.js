#!/usr/bin/env node
/**
 * Ensures AndroidManifest has location + foreground service entries after cap sync.
 * Safe to re-run — idempotent string checks.
 */
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (!fs.existsSync(manifestPath)) process.exit(0);

let xml = fs.readFileSync(manifestPath, 'utf8');

// Remove permissions accidentally placed before <manifest> (legacy patch bug)
xml = xml.replace(/^<\?xml[^?]*\?>\s*(?:<uses-permission[^>]+\/>\s*)+/m, (m) =>
  m.replace(/<uses-permission[^>]+\/>\s*/g, '')
);

const perms = [
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_BACKGROUND_LOCATION',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_LOCATION',
  'android.permission.WAKE_LOCK',
  'android.permission.POST_NOTIFICATIONS',
];

let changed = false;
for (const p of perms) {
  if (!xml.includes(p)) {
    xml = xml.replace(
      /(<manifest[^>]*>)/,
      `$1\n    <uses-permission android:name="${p}" />`
    );
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync(manifestPath, xml);
  console.log('patch-android-permissions: added location permissions');
}
