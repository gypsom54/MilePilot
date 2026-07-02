# TestFlight Native App — Background GPS

## Why background miles failed

The TestFlight app is a **native shell** that loads the PWA from `app.milepilot.uk`. Background mileage needs **both** layers working:

1. **PWA** (`tracking-provider.js`, `index.html`) — must use the native GPS bridge, not browser geolocation
2. **Native shell** (`expo-location` + `expo-task-manager`) — records GPS when the phone is locked
3. **iOS permission** — Location must be set to **Always** (not just "While Using")

### v8.40.0 fixes (build 6)

| Issue | Fix |
|-------|-----|
| "When In Use" reported as granted | Native bridge returns `foreground-only` when background denied |
| Background task never started | `expo:tracking:start` reports `backgroundActive`; task only starts with Always permission |
| Miles lost while locked | Buffered background GPS points flush to WebView on app resume |
| No user guidance | Banner prompts to open Settings → MilePilot → Location → Always |
| PWA poll on native | Skips useless `startBackgroundGpsPoll()` on Expo native (uses task-manager instead) |

## Production TestFlight (v8.40.0)

### Step 1 — Cloudflare (required first)

Upload `MilePilot-v8.40.0-CLOUDFLARE-UPLOAD.zip` to Cloudflare Pages.

Verify: https://app.milepilot.uk/version.txt → `8.40.0`

### Step 2 — EAS build + TestFlight

From repo root (requires `EXPO_TOKEN` in Cursor secrets or local `eas login`):

```bash
git checkout cursor/background-gps-fix-testflight-4c0e
npm install
npm run release:ios
```

Pins: `app.config.js` `buildNumber: 6`, `eas.json` `WEB_APP_URL` `v=8.40.0`.

Or separately:

```bash
npm run build:ios:production -- --non-interactive
npm run submit:ios -- --non-interactive
```

## Device test checklist

1. Install TestFlight build **6** (v8.40.0)
2. Start a shift in AutoPilot mode
3. When prompted, grant location — then set **Always** in Settings → MilePilot → Location
4. Confirm miles increase while app is visible
5. Lock phone / switch apps for 3+ minutes while driving
6. Unlock → miles should catch up (may briefly show reconnecting)
7. End shift → miles saved in history

## Permissions on iPhone

Settings → MilePilot → Location → **Always**

Without Always, background mileage will not record when the phone is locked. The app shows a banner if only foreground permission is granted.
