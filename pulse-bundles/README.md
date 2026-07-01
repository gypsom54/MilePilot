# Pulse bundle transport (one-time)

**Not part of MilePilot.** Delete after `pulse-app-` has the branch.

## Windows PowerShell — PS-009 (latest)

```powershell
cd C:\Users\hanna\pulse-app

curl.exe -L -o pulse-ps009.bundle "https://github.com/gypsom54/MilePilot/raw/cursor/pulse-ps007-bundle-a417/pulse-bundles/pulse-ps009.bundle"

git fetch .\pulse-ps009.bundle cursor/ps-009-emotional-polish-a417:cursor/ps-009-emotional-polish-a417

git checkout cursor/ps-009-emotional-polish-a417

git push -u origin cursor/ps-009-emotional-polish-a417

Remove-Item pulse-ps009.bundle

flutter pub get
flutter run -d chrome
```

## Alternative download

```powershell
Invoke-WebRequest -Uri "https://github.com/gypsom54/MilePilot/raw/cursor/pulse-ps007-bundle-a417/pulse-bundles/pulse-ps009.bundle" -OutFile "pulse-ps009.bundle"
```

## Older bundle

`pulse-ps007.bundle` — PS-007 only (superseded by PS-009).
