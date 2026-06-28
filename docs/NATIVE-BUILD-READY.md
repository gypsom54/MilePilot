# MilePilot Native Build — Production Readiness Report

**Date:** 2026-06-28 · **Branch:** `cursor/native-build-prep-19bd` · **Version:** v8.11.0

---

## Summary

MilePilot is a **clean Expo SDK 56 native shell** wrapping the existing web UI in a WebView. **Expo Go is not supported** — use **EAS Development Builds** or **preview/production builds** for TestFlight.

All configuration audited and repaired. **Expo Doctor: 21/21 checks passed.** iOS and Android prebuild succeed without manual native edits.

---

## ✓ Expo SDK version

| Package | Version |
|---------|---------|
| **Expo SDK** | **56.0.12** |
| **React Native** | **0.85.3** |
| **React** | **19.2.3** |

---

## ✓ Key dependencies (SDK-aligned)

| Package | Version | Purpose |
|---------|---------|---------|
| expo-dev-client | ~56.0.20 | Custom dev client (not Expo Go) |
| expo-location | ~56.0.18 | Foreground + background GPS |
| expo-task-manager | ~56.0.19 | Background location task |
| expo-notifications | ~56.0.18 | Push notification permission |
| expo-system-ui | ~56.0.5 | Dark UI style (prebuild) |
| react-native-webview | 13.16.1 | WebView shell |
| react-native-maps | 1.27.2 | EAS compatibility (map UI stays Leaflet in WebView) |
| babel-preset-expo | ~56.0.0 | Babel |

**Not used:** expo-router (app uses WebView + vanilla JS, not file-based routing).

---

## ✓ Native configuration

| Setting | Value |
|---------|-------|
| App name | MilePilot |
| Slug | milepilot |
| Bundle ID (iOS) | com.milepilot.app |
| Package (Android) | com.milepilot.app |
| Scheme | milepilot |

### iOS permissions

- Foreground location — configured
- Background location (`UIBackgroundModes: location`) — configured
- Push notifications (`remote-notification`) — configured
- Location permission strings — configured in `app.config.js` + `expo-location` plugin

### Android permissions

- `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`
- `ACCESS_BACKGROUND_LOCATION`
- `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_LOCATION`
- `POST_NOTIFICATIONS`, `WAKE_LOCK`

---

## ✓ EAS profiles (`eas.json`)

| Profile | iOS | Android | Use |
|---------|-----|---------|-----|
| `development` | Dev client, internal | APK | Device dev with native modules |
| `preview` | Internal | APK | TestFlight beta |
| `production` | App Store | AAB | Production release |

---

## ✓ Project health

| Check | Result |
|-------|--------|
| `npx expo-doctor` | **21/21 passed** |
| `npx expo prebuild --platform all` | **Success** |
| JS syntax check | **Pass** |
| Capacitor conflicts | **Removed** |
| Obsolete deploy zips | **Removed** (68 archives) |
| Duplicate native folders | **Excluded** via `.gitignore` / `.easignore` |

---

## Remaining warnings (non-blocking)

| Item | Action required |
|------|-----------------|
| EAS project ID | Run `eas init` once on your PC (writes UUID to `app.config.js` or sets `EAS_PROJECT_ID`) |
| Apple credentials | Run `eas credentials` before first iOS build |
| npm audit (10 moderate) | Transitive dev dependencies; no runtime impact on EAS cloud builds |
| Background GPS on device | Requires real iPhone drive test with Location → Always |
| TypeScript | Project is JavaScript; `tsconfig.json` added for IDE support only |

---

## ✓ Exact PowerShell commands (Windows 11)

### One-time setup

```powershell
cd C:\Users\hanna\MilePilot
git pull origin cursor/native-build-prep-19bd
npm install
npm install -g eas-cli
eas login
eas init
```

### Verify project health

```powershell
npm run doctor
```

Expected: **21/21 checks passed**

### Configure Apple credentials (once)

```powershell
eas credentials
```

Select **iOS** → bundle ID `com.milepilot.app`

### Build iOS for TestFlight

```powershell
eas build --platform ios --profile preview
```

For production:

```powershell
eas build --platform ios --profile production
```

### Upload to TestFlight

After build completes:

```powershell
eas submit --platform ios --latest
```

Or submit a specific build:

```powershell
eas submit --platform ios --profile production
```

Then on iPhone: install **TestFlight** → open MilePilot build → enable Location → **Always** for background drive tests.

### Dev server (requires dev client build, NOT Expo Go)

```powershell
npx expo start --dev-client
```

---

## ✓ Production-ready confirmation

The project is **ready for its first native iOS beta build** via EAS Cloud. No Mac required. UI, branding, and features are unchanged — the Expo shell only provides native GPS, background location, and notification permissions.

**Next step on your machine:** `eas init` → `eas credentials` → `eas build --platform ios --profile preview` → `eas submit --platform ios --latest`
