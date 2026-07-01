# Get latest Pro Peptides UK on Windows — run in PowerShell

**Why you see the old version:** GitHub `pulse-app-` only has Sprint 1 on `main`. Use the bundle below.

## Latest: Pro Peptides UK rebrand

```powershell
cd C:\Users\hanna\pulse-app

git checkout -- pubspec.lock

curl.exe -L -o pulse-latest.bundle "https://github.com/gypsom54/MilePilot/raw/cursor/pulse-ps007-bundle-a417/pulse-bundles/pulse-latest.bundle"

git fetch .\pulse-latest.bundle cursor/pro-peptides-rebrand-a417:cursor/pro-peptides-rebrand-a417

git checkout cursor/pro-peptides-rebrand-a417

type VERSION.md

flutter clean
flutter pub get
flutter run -d chrome
```

## You have the rebrand when VERSION.md shows:

`PULSE_BUILD=pro-peptides-rebrand`

First screen after launch: **Welcome to Pro Peptides UK Research Companion.** with the PP logo — NOT old Pulse copy.

## Push to GitHub once (optional)

```powershell
git push -u origin cursor/pro-peptides-rebrand-a417
```
