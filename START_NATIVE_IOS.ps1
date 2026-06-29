# MilePilot — Native iOS TestFlight (Expo EAS)
# Windows 11 · Cursor · Apple Developer · iPhone 14
# Expo Go is NOT used — builds use expo-dev-client + EAS cloud.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "MilePilot Native iOS — EAS TestFlight prep" -ForegroundColor Cyan
Write-Host "Version 1.0.0 · Build 1 · com.milepilot.app`n"

# ── 1. Dependencies ──────────────────────────────────────────────
Write-Host "[1/6] Installing dependencies..." -ForegroundColor Yellow
npm install
if (-not (Get-Command eas -ErrorAction SilentlyContinue)) {
  npm install -g eas-cli
}

# ── 2. Health check ──────────────────────────────────────────────
Write-Host "[2/6] Running Expo Doctor..." -ForegroundColor Yellow
npm run doctor
if ($LASTEXITCODE -ne 0) { throw "Expo Doctor reported issues — fix before building." }

# ── 3. Sync web assets ───────────────────────────────────────────
Write-Host "[3/6] Syncing frontend to assets/web..." -ForegroundColor Yellow
npm run sync:expo-web

# ── 4. EAS login (one-time) ────────────────────────────────────────
Write-Host "[4/6] EAS login (skip if already logged in)..." -ForegroundColor Yellow
eas whoami 2>$null
if ($LASTEXITCODE -ne 0) {
  eas login
}

# ── 5. Apple credentials (one-time) ───────────────────────────────
Write-Host "[5/6] Configure Apple credentials (one-time)..." -ForegroundColor Yellow
Write-Host "  Run manually if not done: eas credentials" -ForegroundColor DarkGray

# ── 6. Build for TestFlight ───────────────────────────────────────
Write-Host "[6/6] Ready to build. Choose a profile:" -ForegroundColor Green
Write-Host "  Development: eas build --platform ios --profile development"
Write-Host "  TestFlight (preview): eas build --platform ios --profile preview"
Write-Host "  Production: eas build --platform ios --profile production"
Write-Host ""
Write-Host "After build completes, submit to TestFlight:" -ForegroundColor Green
Write-Host "  eas submit --platform ios --latest --profile production"
