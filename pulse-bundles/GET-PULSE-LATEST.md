# Get latest Pulse on Windows — run in PowerShell

**Why you see the old version:** GitHub `pulse-app-` only has Sprint 1 on `main`. Use the bundle below.

## Latest: PS-010 conversational onboarding

```powershell
cd C:\Users\hanna\pulse-app

git checkout -- pubspec.lock

curl.exe -L -o pulse-latest.bundle "https://github.com/gypsom54/MilePilot/raw/cursor/pulse-ps007-bundle-a417/pulse-bundles/pulse-latest.bundle"

git fetch .\pulse-latest.bundle cursor/ps-010-conversation-onboarding-a417:cursor/ps-010-conversation-onboarding-a417

git checkout cursor/ps-010-conversation-onboarding-a417

type VERSION.md

flutter clean
flutter pub get
flutter run -d chrome
```

## You have PS-010 when VERSION.md shows:

`PULSE_BUILD=ps-010-conversation-onboarding`

First screen after launch: **Hello 👋 Welcome to Pulse** (not old positioning text).

## Push to GitHub once (optional)

```powershell
git push -u origin cursor/ps-010-conversation-onboarding-a417
```
