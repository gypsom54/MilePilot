# Pulse bundle transport (one-time)

**Not part of MilePilot.** Delete after `pulse-app-` has the branch.

## Windows PowerShell

```powershell
cd C:\Users\hanna\pulse-app

# Download (use curl.exe — PowerShell's curl alias breaks -L)
curl.exe -L -o pulse-ps007.bundle "https://github.com/gypsom54/MilePilot/raw/cursor/pulse-ps007-bundle-a417/pulse-bundles/pulse-ps007.bundle"

# Import branch
git fetch .\pulse-ps007.bundle cursor/ps-007-emotion-ux-a417:cursor/ps-007-emotion-ux-a417
git checkout cursor/ps-007-emotion-ux-a417

# Push to Pulse repo
git push -u origin cursor/ps-007-emotion-ux-a417

# Clean up
git push origin --delete test-write-access
Remove-Item pulse-ps007.bundle

flutter pub get
flutter run -d chrome
```

## Alternative download (if curl.exe fails)

```powershell
Invoke-WebRequest -Uri "https://github.com/gypsom54/MilePilot/raw/cursor/pulse-ps007-bundle-a417/pulse-bundles/pulse-ps007.bundle" -OutFile "pulse-ps007.bundle"
```
