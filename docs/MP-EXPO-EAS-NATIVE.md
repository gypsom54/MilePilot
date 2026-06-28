# MP-EXPO-EAS — Native iOS Testing via Expo (No Mac Required)

**Version:** v8.11.0 · `MP-EXPO-EAS`

---

## What this is

MilePilot is a **vanilla HTML/JS web app** (`frontend/`). Expo wraps it in a **WebView native shell** so you can:

- Build iOS on **EAS cloud** (no Mac on your desk)
- Install on **iPhone 14 via TestFlight**
- Test **real native GPS** via `expo-location` + `expo-task-manager`

**Nothing was redesigned.** Onboarding, dashboard, AutoPilot, reports, history, live map (Leaflet) — all unchanged inside the WebView.

---

## Architecture

```
frontend/          ← UI source of truth (also Cloudflare PWA deploy)
    ↓
Expo WebView       ← loads https://app.milepilot.uk/?runtime=expo
    ↓
expo-location      ← native GPS bridge → MPTrackingProvider → MPTracking engine
expo-task-manager  ← background GPS (test on device)
```

---

## Prerequisites

| Item | Required |
|------|----------|
| Windows PC | ✅ |
| iPhone 14 | ✅ |
| Apple Developer account | ✅ ($99/year) — for TestFlight |
| Mac | ❌ Not needed (EAS builds in cloud) |
| Node.js 18+ | ✅ |

---

## Windows PowerShell — exact commands

### 1. One-time setup

```powershell
cd C:\path\to\MilePilot
npm install
npm install -g eas-cli
eas login
eas init
```

`eas init` links the project and writes your **EAS project ID** into `app.config.js`.

### 2. Configure Apple credentials (store on Expo's servers — no Mac):

```powershell
eas credentials
```

Select **iOS** → follow prompts for your Apple Developer account, bundle ID `com.milepilot.app`.

### 3. Deploy web UI (if not already live)

Upload `MilePilot-WELCOME-LATEST.zip` to Cloudflare Pages so the WebView loads v8.11.0 with Expo bridge support.

Or override URL for testing:

```powershell
$env:WEB_APP_URL="https://app.milepilot.uk/?runtime=expo&v=8.11.0"
```

### 4. Local dev (optional — UI in browser or Expo Go limited)

```powershell
npm run sync:expo-web
npx expo start
```

**Note:** Background GPS requires a **development build**, not Expo Go. Use EAS for real device testing.

### 5. Build iOS for TestFlight (preview profile)

```powershell
eas build --platform ios --profile preview
```

When complete, download the build or submit:

```powershell
eas submit --platform ios --profile production
```

Or upload to TestFlight from the Expo dashboard: https://expo.dev

### 6. Install on iPhone 14

1. Install **TestFlight** from App Store
2. Accept invite / open build from Expo dashboard
3. Open MilePilot → enable location → start AutoPilot → real drive test

---

## EAS build profiles (`eas.json`)

| Profile | Use |
|---------|-----|
| `development` | Dev client with native modules |
| `preview` | Internal TestFlight-style testing |
| `production` | App Store / production TestFlight |

Build commands:

```powershell
eas build --platform ios --profile development
eas build --platform ios --profile preview
eas build --platform ios --profile production
```

---

## Permissions (configured in `app.config.js`)

- **When in use:** MilePilot uses location to record your business journeys while you are working.
- **Background:** MilePilot uses background location so your mileage can continue recording when your phone is locked.
- **Notifications:** Prepared via `expo-notifications` (future report alerts)

On iPhone: Settings → MilePilot → Location → **Always** (for background drive tests).

---

## Background GPS test points

Code marked `BACKGROUND GPS TEST POINT` in:

- `src/locationTask.js` — expo-task-manager background task
- `src/expoLocationBridge.js` — starts foreground + background updates
- `frontend/js/tracking-provider.js` — WebView bridge to tracking engine

**Do not claim background tracking works until a locked-phone drive confirms mileage.**

Check logs during test:

```javascript
// Safari Web Inspector (device) or Metro console
MPTrackingProvider.getLogs()
```

Metro / EAS build logs show: `[MilePilot BG GPS] location ...`

---

## react-native-maps

Installed for EAS compatibility and future native map use. **Live map remains Leaflet inside the WebView** — no UI change this sprint.

---

## Capacitor vs Expo

Both can coexist in the repo. **For iPhone + no Mac, use Expo/EAS.** Capacitor remains for optional Android local builds.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| WebView shows old UI | Deploy v8.11.0 to Cloudflare; hard-refresh or clear app |
| Location denied | iPhone Settings → MilePilot → Location → Always |
| `eas build` fails credentials | Run `eas credentials` again |
| Background miles not recording | Confirm Always permission; check `[MilePilot BG GPS]` logs |
| `REPLACE_WITH_EAS_PROJECT_ID` | Run `eas init` |

---

## Success milestone

✅ `npx expo start` runs  
✅ `eas build --platform ios` produces installable build  
✅ TestFlight on iPhone 14  
⏳ Locked-phone drive confirms background mileage (device test)
