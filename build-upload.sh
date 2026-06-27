#!/bin/bash
# Keeps upload folder in sync with frontend source
cp frontend/index.html frontend/version.txt frontend/service-worker.js \
   frontend/manifest.json frontend/icon.svg milepilot-upload-v2/
cd milepilot-upload-v2 && zip -r ../MilePilot-WELCOME-LATEST.zip .
echo "Built MilePilot-WELCOME-LATEST.zip"
grep "Welcome v" index.html
grep "Welcome Screen v" version.txt
