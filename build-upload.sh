#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

# Read version from frontend/version.txt (first line: "MilePilot OS v8.14.2 — ...")
VERSION=$(grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' "$ROOT/frontend/version.txt" | head -1 | sed 's/^v//')
if [ -z "$VERSION" ]; then
  VERSION=$(grep -oE "APP_VERSION='[0-9.]+'" "$ROOT/frontend/index.html" | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
fi
if [ -z "$VERSION" ]; then
  echo "Could not detect app version" >&2
  exit 1
fi

ZIP_NAME="MilePilot-v${VERSION}-CLOUDFLARE-UPLOAD.zip"
ZIP_PATH="$ROOT/$ZIP_NAME"
LATEST_PATH="$ROOT/MilePilot-CLOUDFLARE-UPLOAD-LATEST.zip"

cp "$ROOT/frontend/index.html" "$ROOT/frontend/version.txt" "$ROOT/frontend/service-worker.js" \
   "$ROOT/frontend/manifest.json" "$ROOT/frontend/icon.svg" "$ROOT/milepilot-upload-v2/"
mkdir -p "$ROOT/milepilot-upload-v2/js"
cp "$ROOT/frontend/js/"*.js "$ROOT/milepilot-upload-v2/js/"

cat > "$ROOT/milepilot-upload-v2/UPLOAD-INSTRUCTIONS.txt" <<EOF
MilePilot — CLOUDFLARE UPLOAD v${VERSION}
==========================================

DOWNLOAD ZIP (same naming every time):
MilePilot-v${VERSION}-CLOUDFLARE-UPLOAD.zip

Or use the latest alias:
MilePilot-CLOUDFLARE-UPLOAD-LATEST.zip

UPLOAD STEPS
------------
1. Download the zip above
2. Unzip all files (do NOT upload the zip itself)
3. Cloudflare → milepilot-app → Upload assets → select ALL files and folders → Deploy
   Must include: index.html, version.txt, service-worker.js, manifest.json, icon.svg, _headers, js/

VERIFY DEPLOY
-------------
https://app.milepilot.uk/version.txt
Must show: MilePilot OS v${VERSION}

APP URL
-------
https://app.milepilot.uk
EOF

cd "$ROOT/milepilot-upload-v2"
rm -f "$ZIP_PATH" "$LATEST_PATH"
zip -rq "$ZIP_PATH" .
cp "$ZIP_PATH" "$LATEST_PATH"

echo "Built $ZIP_PATH"
echo "Built $LATEST_PATH"
echo "Version: v${VERSION}"
grep -m1 'MilePilot OS' version.txt || true
