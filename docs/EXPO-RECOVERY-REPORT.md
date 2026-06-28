# MilePilot Expo Recovery Report

**Date:** 2026-06-28 · **Branch:** `cursor/expo-eas-native-ae00`

---

## Summary

The project was **not compatible with Expo Go** and had configuration conflicts between **Capacitor** and **Expo Prebuild**. It is now a **clean Expo SDK 56 app** ready for **EAS Build → TestFlight**.

---

## ✓ Expo SDK version

| Package | Version |
|---------|---------|
| **Expo SDK** | **56.0.12** |
| **React Native** | **0.85.3** |
| **React** | **19.2.3** |

---

## ✓ Package compatibility

All Expo packages aligned via `npx expo install --fix`:

| Package | Version |
|---------|---------|
| expo-dev-client | ~56.0.20 |
| expo-location | ~56.0.18 |
| expo-task-manager | ~56.0.19 |
| expo-notifications | ~56.0.18 |
| react-native-webview | 13.16.1 |
| react-native-maps | 1.27.2 |
| babel-preset-expo | ~56.0.0 (devDependency) |

**Expo Doctor:** `21/21 checks passed`

---

## ✓ What was fixed

1. **Removed Capacitor packages** from `package.json` (956 → 483 npm packages) — they conflicted with Expo Prebuild on EAS.
2. **Removed `android/` and `ios/`** Capacitor folders — EAS now generates native projects from `app.config.js`.
3. **Added `.easignore`** — excludes legacy folders from cloud uploads.
4. **Removed `eas-cli`** from project deps — use global install or `npx eas`.
5. **Fixed `metro.config.js`** — removed `json` from assetExts (was breaking Metro).
6. **Cross-platform sync** — `scripts/sync-expo-web.js` works on Windows (no bash required).
7. **Removed duplicate `expo-asset` plugin** from app.config (included in SDK).
8. **Configured `index.js`** with `expo-dev-client` import for EAS Development Builds.

---

## ✗ Expo Go — intentionally NOT supported

**Expo Go cannot run MilePilot** because the app uses native modules that are not in Expo Go:

| Module | Why |
|--------|-----|
| `expo-dev-client` | Custom native shell |
| `expo-task-manager` | Background GPS task |
| `expo-location` (background) | Always-on location |
| `react-native-webview` | Full app shell |

### What to use instead

| Goal | Command |
|------|---------|
| Dev server (Metro + QR) | `npx expo start --dev-client` |
| iPhone TestFlight build | `eas build --platform ios --profile preview` |
| Dev client on device | `eas build --platform ios --profile development` |

The QR code from `expo start` works with a **custom dev client** built via EAS — **not** the App Store “Expo Go” app.

---

## ✓ Remaining issues (none blocking)

| Item | Notes |
|------|-------|
| `REPLACE_WITH_EAS_PROJECT_ID` | Run `eas init` once on your PC |
| Apple credentials | Run `eas credentials` before first iOS build |
| Capacitor workflow | Available on branch `cursor/mp-039-native-app-testing-ae00` if needed later |

---

## ✓ Exact PowerShell commands (Windows 11)

```powershell
cd C:\Users\hanna\MilePilot
git pull origin cursor/expo-eas-native-ae00
npm install
npm run doctor
```

Expected: **21/21 checks passed**

### Link Expo project (once)

```powershell
npm install -g eas-cli
eas login
eas init
```

### Start Metro (dev server)

```powershell
npx expo start --dev-client
```

> Scan QR with **MilePilot dev build** on iPhone — not Expo Go.

### Build for TestFlight (main milestone)

```powershell
eas credentials
eas build --platform ios --profile preview
eas submit --platform ios --latest
```

Install via **TestFlight** on iPhone 14.

---

## MilePilot features preserved

- Web UI unchanged (loads from Cloudflare in WebView)
- Onboarding, dashboard, AutoPilot, reports, history, live map
- Native GPS bridge (`expo-location` + `expo-task-manager`)
- PWA / Cloudflare deploy unchanged (`frontend/` + upload zip)

---

## File checklist

| File | Status |
|------|--------|
| `package.json` | ✓ Repaired |
| `app.config.js` | ✓ Repaired |
| `eas.json` | ✓ Repaired |
| `babel.config.js` | ✓ OK |
| `metro.config.js` | ✓ Repaired |
| `.easignore` | ✓ Added |
| `scripts/sync-expo-web.js` | ✓ Added (Windows-safe) |
