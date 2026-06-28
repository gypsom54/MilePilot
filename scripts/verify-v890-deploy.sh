#!/usr/bin/env bash
# MP-037 — Verify MilePilot v8.9.0 production deploy
set -euo pipefail

BASE="${1:-https://app.milepilot.uk}"
UA="Mozilla/5.0 (compatible; MilePilotDeployCheck/1.0)"
PASS=0
FAIL=0

fetch() {
  curl -fsSL -A "$UA" "$@"
}

pass() { echo "✓ $1"; PASS=$((PASS + 1)); }
fail() { echo "✗ $1"; FAIL=$((FAIL + 1)); }

echo "MilePilot deploy verification — $BASE"
echo "========================================"

VERSION="$(fetch "$BASE/version.txt" 2>/dev/null || echo MISSING)"
echo "version.txt: $VERSION"
if echo "$VERSION" | grep -q "v8.9.0"; then pass "version.txt shows v8.9.0"; else fail "version.txt does not show v8.9.0"; fi

for path in manifest.json service-worker.js icon.svg _headers \
  js/pwa-device.js js/tracking-engine.js js/plan-ux.js js/pioneer.js js/driver-intelligence.js index.html; do
  code="$(curl -sSL -A "$UA" -o /dev/null -w '%{http_code}' "$BASE/$path" || echo 000)"
  if [ "$code" = "200" ]; then pass "$path returns 200"; else fail "$path returns $code"; fi
done

MANIFEST="$(fetch "$BASE/manifest.json")"
if echo "$MANIFEST" | grep -q '"name": "MilePilot"'; then pass "manifest name MilePilot"; else fail "manifest name"; fi
if echo "$MANIFEST" | grep -q '"display": "standalone"'; then pass "manifest standalone"; else fail "manifest display"; fi
if echo "$MANIFEST" | grep -q '#031126'; then pass "manifest navy theme"; else fail "manifest theme"; fi

SW="$(fetch "$BASE/service-worker.js")"
if echo "$SW" | grep -q "milepilot-v8-9-0"; then pass "service worker cache v8-9-0"; else fail "service worker cache"; fi

INDEX="$(fetch "$BASE/index.html")"
if grep -qF "APP_VERSION='8.9.0'" <<< "$INDEX"; then pass "index APP_VERSION 8.9.0"; else fail "index APP_VERSION"; fi
if grep -qF "pwa-device.js" <<< "$INDEX"; then pass "index loads pwa-device.js"; else fail "pwa-device.js missing from index"; fi
if grep -qF "pwaInstallOverlay" <<< "$INDEX"; then pass "install prompt overlay present"; else fail "install overlay missing"; fi
if grep -qF "testModeCard" <<< "$INDEX"; then pass "test mode panel present"; else fail "test mode panel missing"; fi

PWA="$(fetch "$BASE/js/pwa-device.js")"
if echo "$PWA" | grep -q "MP-036"; then pass "pwa-device.js deployed"; else fail "pwa-device.js content"; fi

echo "========================================"
echo "Passed: $PASS  Failed: $FAIL"
if [ "$FAIL" -gt 0 ]; then exit 1; fi
echo "Deploy verification OK — ready for installed PWA phone test."
