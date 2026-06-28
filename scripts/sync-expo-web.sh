#!/bin/bash
# Copy MilePilot web frontend into Expo assets for bundling / offline use.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/assets/web"
mkdir -p "$DEST/js"
cp "$ROOT/frontend/index.html" \
   "$ROOT/frontend/version.txt" \
   "$ROOT/frontend/service-worker.js" \
   "$ROOT/frontend/manifest.json" \
   "$ROOT/frontend/icon.svg" \
   "$DEST/" 2>/dev/null || return 0
cp "$ROOT/frontend/js/"*.js "$DEST/js/"
echo "Synced frontend → assets/web/ ($(date -u +%Y-%m-%dT%H:%M:%SZ))"
