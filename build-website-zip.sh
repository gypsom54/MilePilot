#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
VER=$(grep "Website v" "$ROOT/website/VERSION.txt" | head -1 | sed 's/.*Website //' | cut -d' ' -f1)
ZIP="$ROOT/MilePilot-WEBSITE-${VER}-DOWNLOAD.zip"
cd "$ROOT/website"
# Windows batch files need CRLF line endings
for bat in OPEN-WEBSITE.bat START-WEBSITE.bat; do
  sed -i 's/\r$//' "$bat"
  printf '\n' | sed -i -e '$a\' "$bat" 2>/dev/null || true
  sed -i 's/$/\r/' "$bat"
done
zip -r "$ZIP" index.html styles.css milepilot-theme.css map-london.svg main.js VERSION.txt README.md HOW-TO-OPEN.txt START-WEBSITE.bat OPEN-WEBSITE.bat
echo "Built $ZIP"
cat VERSION.txt
