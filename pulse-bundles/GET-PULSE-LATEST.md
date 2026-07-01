# Get latest Pulse on Windows — run in PowerShell

**Why you see the old version:** GitHub `pulse-app-` only has Sprint 1 on `main`. All new work is in the bundle below.

## Step-by-step (copy all)

```powershell
cd C:\Users\hanna\pulse-app

# 1. See what you have NOW (probably wrong)
git branch
type VERSION.md 2>$null; if (-not $?) { Write-Host "NO VERSION.md = OLD BUILD" -ForegroundColor Red }
type assets\conversations\onboarding_positioning.json | Select-String "personal companion"

# 2. Download latest bundle
curl.exe -L -o pulse-latest.bundle "https://github.com/gypsom54/MilePilot/raw/cursor/pulse-ps007-bundle-a417/pulse-bundles/pulse-latest.bundle"

# 3. Import branch (this is the step that usually fails if bundle missing)
git fetch .\pulse-latest.bundle cursor/ps-009-emotional-polish-a417:cursor/ps-009-emotional-polish-a417

# 4. Switch to new branch
git checkout cursor/ps-009-emotional-polish-a417

# 5. VERIFY before running Flutter
type VERSION.md
type assets\conversations\onboarding_positioning.json

# 6. Clean run (required — Flutter caches old JSON)
flutter clean
flutter pub get
flutter run -d chrome
```

## You have the RIGHT version when:

`VERSION.md` shows: `PULSE_BUILD=founder-sequence-6c509f9`

`onboarding_positioning.json` contains: `Your personal companion for organised peptide research`

## You have the WRONG version when:

- `git branch` shows `* main`
- No `VERSION.md` file
- Only one line in positioning JSON
- Launch shows old Sprint 1 flow only

## Optional: push to your GitHub so you don't need bundles again

```powershell
git push -u origin cursor/ps-009-emotional-polish-a417
```
