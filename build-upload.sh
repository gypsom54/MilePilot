#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
VERSION=$(grep "const APP_VERSION" "$ROOT/frontend/index.html" | sed "s/.*'\(.*\)'.*/\1/")
cp "$ROOT/frontend/index.html" "$ROOT/frontend/version.txt" "$ROOT/frontend/service-worker.js" \
   "$ROOT/frontend/manifest.json" "$ROOT/frontend/icon.svg" "$ROOT/milepilot-upload-v2/"
mkdir -p "$ROOT/milepilot-upload-v2/js"
cp "$ROOT/frontend/js/"*.js "$ROOT/milepilot-upload-v2/js/" 2>/dev/null || true
cp "$ROOT/frontend/js/"*.js "$ROOT/milepilot-upload-v2/js/" 2>/dev/null || true
node -e "const fs=require('fs');const html=fs.readFileSync('$ROOT/frontend/index.html','utf8');const script=html.match(/<script>([\\s\\S]*)<\\/script>/)[1];try{new Function(script);console.log('Inline script syntax OK');}catch(e){console.error('INLINE SCRIPT SYNTAX ERROR:',e.message);process.exit(1);}"
node "$ROOT/scripts/verify-tracking-contract.js"
cd "$ROOT/milepilot-upload-v2"
ZIP="$ROOT/MilePilot-v${VERSION}-CLOUDFLARE-UPLOAD.zip"
zip -r "$ZIP" .
echo "Built $ZIP"
grep "APP_VERSION" index.html | head -1
grep "v8" version.txt | head -1
