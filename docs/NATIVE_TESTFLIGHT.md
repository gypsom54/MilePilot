# TestFlight Native App — Background GPS

## Why TestFlight broke on 8.26.2

The TestFlight app is a **native shell** that loads the PWA from `app.milepilot.uk`. Version 8.26.2 was missing:

1. **Native GPS bridge** (`native-platform.js`, `tracking-provider.js`) — without these, the app used browser geolocation inside a WebView, which **stops in background**
2. **Native speed gate** — fast GPS bursts caused miles to stay at 0 even when the route drew
3. **PWA background resilience** — fixed in 8.28.0 but not deployed to Cloudflare

## Fix in v8.28.1

| Layer | Fix |
|-------|-----|
| PWA | MP-043 background GPS + native bridge restored |
| Native shell | `expo-location` + `expo-task-manager` background task |
| Speed gate | `nativeGps` + `movementSpeedMps()` for TestFlight bursts |
| iOS build | `buildNumber: 3` |

## Production TestFlight (v8.39.0+)

Before building, confirm Cloudflare serves the matching PWA:

- https://app.milepilot.uk/version.txt → `8.39.0`

Then from repo root (requires `EXPO_TOKEN` or `eas login`):

```bash
npm install
npm run build:ios:production -- --non-interactive
npm run submit:ios -- --non-interactive
```

Or one command:

```bash
npm run release:ios
```

Pins: `app.config.js` `buildNumber`, `eas.json` `WEB_APP_URL` `v=8.39.0`, production profile.

## Deploy (two steps required)

### Step 1 — Cloudflare (immediate)

Upload `MilePilot-v8.28.1-CLOUDFLARE-UPLOAD.zip` to Cloudflare Pages.

Verify: https://app.milepilot.uk/version.txt shows `8.28.1`

### Step 2 — New TestFlight build (required for full background GPS)

The native shell must be rebuilt — uploading Cloudflare alone fixes the WebView code, but **true background location** needs the Expo native layer:

```bash
npm install
eas build --platform ios --profile preview
eas submit --platform ios --latest
```

iOS build **3** loads `?runtime=expo&v=8.28.1`.

## Device test checklist

1. Install new TestFlight build (build 3+)
2. Grant **Always Allow** location when prompted during a shift
3. Start shift → confirm miles increase while app visible
4. Lock phone / switch apps for 3+ minutes while driving
5. Return → miles should continue (may briefly show reconnecting)
6. End shift → miles saved in history

## Permissions on iPhone

Settings → MilePilot → Location → **Always**

Without Always, background mileage will not record when the phone is locked.
