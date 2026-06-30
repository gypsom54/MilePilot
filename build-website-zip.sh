#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
VER=$(grep "Website v" "$ROOT/website/VERSION.txt" | head -1 | sed 's/.*Website //' | cut -d' ' -f1)
ZIP="$ROOT/MilePilot-WEBSITE-${VER}-DOWNLOAD.zip"
STAGING="$ROOT/.website-zip-staging/MilePilot-Website"
SRC="$ROOT/website"

rm -rf "$ROOT/.website-zip-staging"
mkdir -p "$STAGING"

FILES=(
  index.html
  styles.css
  milepilot-theme.css
  map-london.svg
  main.js
  VERSION.txt
  README.md
  HOW-TO-OPEN.txt
  READ-ME-FIRST.txt
  OPEN-WEBSITE.bat
  OPEN-WEBSITE.vbs
  START-WEBSITE.bat
)

for f in "${FILES[@]}"; do
  cp "$SRC/$f" "$STAGING/$f"
done

# Obvious launcher name — copy of OPEN-WEBSITE.vbs
cp "$STAGING/OPEN-WEBSITE.vbs" "$STAGING/DOUBLE-CLICK-ME.vbs"

# Windows batch files need CRLF line endings
for bat in OPEN-WEBSITE.bat START-WEBSITE.bat; do
  sed -i 's/\r$//' "$STAGING/$bat"
  sed -i 's/$/\r/' "$STAGING/$bat"
done

cd "$ROOT/.website-zip-staging"
zip -r "$ZIP" MilePilot-Website
rm -rf "$ROOT/.website-zip-staging"

echo "Built $ZIP"
unzip -l "$ZIP"
echo "---"
cat "$SRC/VERSION.txt"
