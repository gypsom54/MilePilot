#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cp "$ROOT/frontend/index.html" "$ROOT/frontend/version.txt" "$ROOT/frontend/service-worker.js" \
   "$ROOT/frontend/manifest.json" "$ROOT/frontend/icon.svg" "$ROOT/milepilot-upload-v2/"
mkdir -p "$ROOT/milepilot-upload-v2/js"
cp "$ROOT/frontend/js/"*.js "$ROOT/milepilot-upload-v2/js/"
cd "$ROOT/milepilot-upload-v2"
zip -r "$ROOT/MilePilot-WELCOME-LATEST.zip" .
echo "Built $ROOT/MilePilot-WELCOME-LATEST.zip"
grep "Welcome v" index.html
grep "Welcome Screen v" version.txt
