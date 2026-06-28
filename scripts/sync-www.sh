#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WWW="$ROOT/www"
mkdir -p "$WWW/js"
cp "$ROOT/frontend/index.html" \
   "$ROOT/frontend/version.txt" \
   "$ROOT/frontend/service-worker.js" \
   "$ROOT/frontend/manifest.json" \
   "$ROOT/frontend/icon.svg" \
   "$ROOT/frontend/_headers" \
   "$WWW/" 2>/dev/null || cp "$ROOT/frontend/index.html" "$ROOT/frontend/version.txt" \
   "$ROOT/frontend/service-worker.js" "$ROOT/frontend/manifest.json" "$ROOT/frontend/icon.svg" "$WWW/"
cp "$ROOT/frontend/js/"*.js "$WWW/js/"
echo "Synced frontend → www/ ($(date -u +%Y-%m-%dT%H:%M:%SZ))"
