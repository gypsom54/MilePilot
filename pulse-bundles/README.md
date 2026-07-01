# Pulse bundle transport (one-time)

**Not part of MilePilot.** This folder exists only so Hanna can pull Pulse commits from the cloud agent into `gypsom54/pulse-app-`.

Delete this folder from MilePilot after `pulse-app-` has the branch.

## Apply on your PC

```powershell
cd C:\Users\hanna\pulse-app

# Download the bundle (or copy pulse-ps007.bundle from this folder)
curl -L -o pulse-ps007.bundle https://github.com/gypsom54/MilePilot/raw/cursor/pulse-ps007-bundle-a417/pulse-bundles/pulse-ps007.bundle

# Import branch (Milestone 2 + PS-007)
git pull pulse-ps007.bundle cursor/ps-007-emotion-ux-a417

# Push to Pulse repo
git push -u origin cursor/ps-007-emotion-ux-a417

# Clean up test branch
git push origin --delete test-write-access
del pulse-ps007.bundle

# Run
flutter pub get
flutter run -d chrome
```

Branch includes: 7-screen onboarding, glow system, PS-007 conversation rewrite.
