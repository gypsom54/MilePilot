# MP-039 — Native App Testing Build (Capacitor)

**Sprint goal:** Package MilePilot as a native mobile shell so we can test **real GPS and background location** on device — without redesigning the product or removing PWA support.

**Version:** v8.10.0 · `MP-039-NATIVE`

---

## Why we are moving beyond PWA testing

The PWA remains valuable for **UI, onboarding, and flow testing**. It is not a reliable environment to prove MilePilot’s core promise:

| Environment | Foreground GPS | Background GPS (locked phone) |
|-------------|----------------|-------------------------------|
| Browser tab | Partial / throttled | **Not available** |
| Installed PWA (iOS) | Partial | **Severely restricted** |
| Installed PWA (Android) | Often OK | **Unreliable** — OS may suspend the WebView |
| **Native app (Capacitor)** | **Full OS APIs** | **Testable** with background location plugin |

**Decision:** Stop treating browser/PWA background tracking gaps as product bugs. Amber “Background Tracking” warnings in browser/PWA now explain that native testing is required — they are not failures.

See also: [TRACKING_BACKGROUND.md](./TRACKING_BACKGROUND.md)

---

## Architecture

```
frontend/          ← source of truth (Cloudflare Pages deploy)
    ↓ sync-www.sh
www/               ← Capacitor webDir (gitignored, built locally)
    ↓ cap sync
android/ ios/      ← native projects (committed)
```

### Tracking provider abstraction

| Module | Role |
|--------|------|
| `frontend/js/native-platform.js` | Detects runtime: `browser` \| `pwa` \| `native` |
| `frontend/js/tracking-provider.js` | `trackingProvider = web \| native` — routes GPS to browser or Capacitor |

**Web / PWA:** Existing `navigator.geolocation` logic in `index.html` (unchanged philosophy).

**Native:** `@capacitor/geolocation` for foreground watch; background foundation stub ready for a dedicated plugin.

### Recommended background plugin (next step on device)

For true locked-screen mileage recording, add on a Mac/Android dev machine:

```bash
npm install @capacitor-community/background-geolocation
npx cap sync
```

Wire the plugin inside `tracking-provider.js` → `startBackgroundFoundation()`. **Do not claim background tracking works until verified on a real drive.**

---

## Capacitor configuration

| Setting | Value |
|---------|-------|
| App name | MilePilot |
| App ID | `uk.milepilot.app` |
| Web directory | `www/` (synced from `frontend/`) |
| Config file | `capacitor.config.json` |

---

## One-time setup

**Requirements:** Node.js 18+, npm

```bash
cd /path/to/milepilot
npm install
npm run sync:www          # copy frontend → www
npx cap add android       # first time only
npx cap add ios           # first time only (Mac for builds)
npm run cap:sync          # sync web + patch permissions
```

After every frontend change:

```bash
npm run cap:sync
# or for web-only Cloudflare deploy: use build-upload.sh as before
```

---

## Android — test APK (priority)

### Requirements

- [Android Studio](https://developer.android.com/studio) (includes SDK + emulator)
- JDK 17+
- `ANDROID_HOME` set (Android Studio usually configures this)

### Build debug APK

```bash
npm run android:assemble
```

Output:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Install on a physical phone:

1. Enable **Developer options** → **USB debugging** (or sideload APK via file share)
2. `adb install android/app/build/outputs/apk/debug/app-debug.apk`
3. Open MilePilot → complete onboarding → start a shift

### Android permissions (auto-patched)

`scripts/patch-android-permissions.js` adds:

- `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`
- `ACCESS_BACKGROUND_LOCATION`
- `FOREGROUND_SERVICE` + `FOREGROUND_SERVICE_LOCATION`
- `POST_NOTIFICATIONS` (for future shift notification)
- `WAKE_LOCK`

On Android 10+, **background location** is a separate runtime prompt after “While using the app” is granted. Test on device: Settings → Apps → MilePilot → Permissions → Location → **Allow all the time**.

### Open in Android Studio

```bash
npm run android:open
```

---

## iOS — TestFlight plan

iOS cannot be built on Windows/Linux alone. The `ios/` project is prepared in-repo; builds require a Mac.

### Requirements

| Item | Notes |
|------|-------|
| Mac with Xcode 15+ | Build & sign |
| Apple Developer account | $99/year — [developer.apple.com](https://developer.apple.com) |
| Bundle ID | `uk.milepilot.app` (must match App ID in Apple portal) |
| Signing | Automatic signing in Xcode with your team |
| TestFlight | Archive → Upload → Internal testing group |

### Xcode steps (Mac)

```bash
npm run cap:sync
npm run ios:open          # opens Xcode
```

In Xcode:

1. Select **App** target → **Signing & Capabilities**
2. Add capability: **Background Modes** → check **Location updates**
3. Confirm **Info.plist** strings (auto-patched by `scripts/patch-ios-permissions.js`):
   - `NSLocationWhenInUseUsageDescription`
   - `NSLocationAlwaysAndWhenInUseUsageDescription`
4. Product → Archive → Distribute → TestFlight

### Permission copy (Info.plist)

- **When in use:** “MilePilot uses location to record your business journeys while you are working.”
- **Always / background:** “MilePilot uses background location so your mileage can continue recording when your phone is locked.”

### iOS background location review

Apple may ask why you need “Always” location. Answer: business mileage recording during active shifts when the driver’s phone is locked. Have a short demo video ready for App Review if submitting beyond TestFlight internal testing.

---

## Native permission strategy

| Permission | When requested | Copy |
|------------|----------------|------|
| Location (foreground) | Start shift / Enable Location | MilePilot uses location to record your business journeys while you are working. |
| Background location | After foreground granted (native only) | MilePilot uses background location so your mileage can continue recording when your phone is locked. |
| Motion / activity | Future — not required this sprint | — |
| Notifications | Future — report delivery | — |

In-app health checks:

- **Browser / PWA:** Background row shows green “Browser mode” / “PWA mode” with note — not amber failure
- **Native:** Shows real permission state; background row stays “Not confirmed” until device test passes

---

## How to test a real journey

1. Install native build (APK or TestFlight)
2. Complete onboarding on device (same flow as web)
3. Enable Location when prompted
4. Start AutoPilot shift
5. Drive 2+ miles with phone locked part of the way
6. End shift → verify miles and route in History
7. Compare with odometer / known route

**Pass criteria for background GPS sprint:** Miles increase while app is backgrounded/locked. If not, enable `@capacitor-community/background-geolocation` and retest before claiming success.

---

## How to collect logs

### In-app (test mode)

Add `?testmode=1` to URL or enable test mode in Settings dev panel.

Test panel shows: runtime (`Browser` / `Installed PWA` / `Native app`), tracking provider, GPS accuracy, route points.

### Native JavaScript logs

In Chrome remote debugging (Android) or Safari Web Inspector (iOS):

```javascript
MPTrackingProvider.getLogs()
MPPlatform.getRuntimeMode()
```

Console prefix: `[MPTrackingProvider]`

### Android logcat

```bash
adb logcat | grep -i -E 'milepilot|capacitor|geolocation'
```

### Xcode console

Run app from Xcode → View device logs while driving test.

---

## Expected limitations (this sprint)

| Item | Status |
|------|--------|
| Capacitor shell + same UI | ✅ |
| Foreground native GPS via Capacitor Geolocation | ✅ Foundation |
| Background GPS while locked | ⚠️ Foundation only — needs background-geolocation plugin + device proof |
| Push notifications | Not in scope |
| App Store / Play Store release | Not in scope — internal testing only |
| Backend changes | None |

---

## Web deploy unchanged

Cloudflare Pages still deploys from `frontend/` via `build-upload.sh` / upload zip. PWA install, service worker, and browser flow are preserved.

Native builds use the same `frontend/` source synced to `www/`.

---

## Quick reference commands

```bash
npm install
npm run sync:www
npm run cap:sync
npm run android:assemble    # debug APK
npm run android:open
npm run ios:open            # Mac only
```

---

## Success criteria (MP-039)

- [x] Capacitor added with `uk.milepilot.app`
- [x] Android + iOS project structure in repo
- [x] Web app still works; PWA not removed
- [x] Tracking provider abstraction (`web` / `native`)
- [x] Platform detection — no false amber for impossible browser background GPS
- [x] Native permission copy in manifests
- [x] Android APK build path documented (`npm run android:assemble`)
- [x] iOS TestFlight requirements documented
- [ ] **Device proof:** background miles on locked phone (follow-up after plugin + real drive)

**Final goal:** Stop proving background mileage through the browser. Test MilePilot properly in a native shell.
