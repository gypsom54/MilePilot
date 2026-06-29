# MilePilot Phase 2 — Native iOS TestFlight (Windows)

**Version:** 1.0.0 · **Build:** 1 · **Bundle ID:** `com.milepilot.app`  
**Branch:** `cursor/native-ios-testflight-f1c0` · **Expo SDK:** 56

Expo Go is **not** used. All device testing uses **EAS Development Builds** or **preview/production** builds via TestFlight.

---

## Project status

| Check | Result |
|-------|--------|
| `npx expo-doctor` | **21/21 passed** |
| `npx expo prebuild --platform ios` | **Success** |
| Metro bundle (`npx expo export --platform ios`) | **Success** |
| EAS config (`eas.json`) | **development / preview / production** |
| Expo Go compatibility | **Ignored (dev client only)** |

---

## App identity

| Field | Value |
|-------|-------|
| App Name | MilePilot |
| Slug | milepilot |
| Version | 1.0.0 |
| iOS Build Number | 1 |
| Bundle Identifier | com.milepilot.app |

---

## Configured permissions

### iOS

| Permission | Configured |
|------------|------------|
| Foreground location | `NSLocationWhenInUseUsageDescription` |
| Background location | `NSLocationAlways*` + `UIBackgroundModes: location` |
| Notifications | `expo-notifications` + `remote-notification` background mode |
| Motion | `NSMotionUsageDescription` |
| Maps | Live map = **Leaflet in WebView** (no camera). `react-native-maps` installed for EAS/native compatibility; Android Google Maps key via `GOOGLE_MAPS_API_KEY` env var if needed later |
| Camera | **Not required** — not configured |

### Android (included for parity)

Fine/coarse/background location, foreground service, notifications, wake lock, activity recognition.

---

## Architecture (unchanged UI)

```
frontend/ (PWA)  →  Cloudflare https://app.milepilot.uk/?runtime=expo&v=1.0.0
                         ↓
Expo WebView shell  →  react-native-webview loads remote PWA
                         ↓
expo-location + expo-task-manager  →  native GPS bridge to web tracking engine
```

No UI redesign. No new product features.

---

## Windows PowerShell — complete command sequence

### One-time setup

```powershell
cd C:\path\to\MilePilot
git checkout cursor/native-ios-testflight-f1c0
npm install
npm install -g eas-cli
eas login
eas init
```

`eas init` links your Expo account. Project ID is already in `app.config.js` (`ecc05803-756a-44d8-a12e-d99cbc9b24b6`). Run `eas init` only if you need to link a different Expo account.

### Apple Developer credentials (one-time, no Mac required)

```powershell
eas credentials
```

Select **iOS** → follow prompts for Apple Developer account → bundle ID **`com.milepilot.app`**.

Create the app in [App Store Connect](https://appstoreconnect.apple.com) with bundle ID `com.milepilot.app` if it does not exist yet.

### Health check before every build

```powershell
npm run doctor
npm run sync:expo-web
```

Expo Doctor must report **21/21 checks passed**.

### Local Metro (optional — UI only, not full native GPS)

```powershell
npm run start:dev-client
```

Background GPS requires a **development build** on device, not Metro alone.

### EAS builds

```powershell
# Development build (custom dev client + native modules)
eas build --platform ios --profile development

# TestFlight internal testing (recommended first TestFlight build)
eas build --platform ios --profile preview

# App Store / production TestFlight
eas build --platform ios --profile production
```

### Submit to TestFlight

After a successful **preview** or **production** build:

```powershell
eas submit --platform ios --latest --profile production
```

Or submit a specific build from the Expo dashboard: https://expo.dev

### Install on iPhone 14

1. Install **TestFlight** from the App Store
2. Accept the invite or open the build from Expo / App Store Connect
3. Open MilePilot → complete onboarding → **Start Shift** → grant **Always** location when prompted
4. Drive test with phone locked to confirm background GPS

### Optional: override WebView URL for testing

```powershell
$env:WEB_APP_URL="https://app.milepilot.uk/?runtime=expo&build=preview&v=1.0.0"
eas build --platform ios --profile preview
```

### Quick start script

```powershell
.\START_NATIVE_IOS.ps1
```

---

## EAS profiles (`eas.json`)

| Profile | Distribution | Use |
|---------|--------------|-----|
| `development` | Internal | Dev client with `expo-dev-client` |
| `preview` | Internal | **First TestFlight build** |
| `production` | Store | App Store / production TestFlight |

`appVersionSource` is **local** — version `1.0.0` and build `1` come from `app.config.js`. Production profile uses `autoIncrement` for subsequent store builds.

---

## Files inspected / repaired

| File | Status |
|------|--------|
| `package.json` | v1.0.0, Expo SDK 56 deps aligned |
| `package-lock.json` | Locked |
| `app.config.js` | v1.0.0, build 1, permissions, plugins |
| `eas.json` | development / preview / production |
| `babel.config.js` | `babel-preset-expo` |
| `metro.config.js` | Default + html/txt/svg assets |
| `tsconfig.json` | JS project IDE support |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Expo Doctor failures | `npm install` then `npm run doctor` |
| EAS not logged in | `eas login` |
| Missing Apple credentials | `eas credentials` |
| WebView shows old UI | Deploy latest PWA to Cloudflare; set `WEB_APP_URL` |
| Background GPS not recording | iPhone Settings → MilePilot → Location → **Always** |
| Build number conflict | Increment `ios.buildNumber` in `app.config.js` |

---

## Success milestone

**First successful TestFlight build** = `eas build --platform ios --profile preview` completes on EAS → install on iPhone 14 via TestFlight → app opens WebView → native location prompt on first shift.
