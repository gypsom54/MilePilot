# MP-037 — Deploy v8.9.0 + Installed PWA Phone Test

**Version:** v8.9.0  
**Build:** MP-036 (deploy verification sprint MP-037)  
**Goal:** Confirm v8.9.0 is live and MilePilot works as an installed app on a real phone.

---

## Download

| Asset | Link |
|-------|------|
| Upload zip | [MilePilot-UPLOAD-v8.9.0.zip](https://github.com/gypsom54/MilePilot/raw/cursor/mp-036-real-device-test-ae00/MilePilot-UPLOAD-v8.9.0.zip) |
| Live app | https://app.milepilot.uk |
| Test mode | https://app.milepilot.uk/?testmode=1 |

---

## Part 1 — Deployment

### Upload steps

1. Download `MilePilot-UPLOAD-v8.9.0.zip`
2. Extract all files — upload **everything** to Cloudflare Pages (`milepilot-app`)
3. Ensure these are included:
   - `index.html`
   - `manifest.json`
   - `service-worker.js`
   - `icon.svg`
   - `version.txt`
   - `_headers`
   - **`js/` folder** (all 5 scripts including `pwa-device.js`)
4. Deploy and wait for propagation (~1 min)

### Post-deploy verification

| Check | Expected | Status |
|-------|----------|--------|
| `/version.txt` | `MilePilot OS v8.9.0 — MP-036 Real device testing build` | ✅ Verified live |
| `/manifest.json` | name **MilePilot**, standalone, `#031126` theme | ✅ Verified live |
| `/service-worker.js` | cache `milepilot-v8-9-0` | ✅ Verified live |
| `/js/pwa-device.js` | MP-036 install + test mode module | ✅ Verified live |
| `/index.html` | `APP_VERSION='8.9.0'`, pwa-device.js loaded | ✅ Verified live |

Run automated checks locally:

```bash
./scripts/verify-v890-deploy.sh
# or against production explicitly:
./scripts/verify-v890-deploy.sh https://app.milepilot.uk
```

### Desktop cache clear (after deploy)

1. Open https://app.milepilot.uk
2. Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
3. If old version persists:
   - DevTools → Application → Service Workers → **Unregister**
   - Application → Storage → **Clear site data**
   - Hard refresh again
4. Confirm footer/version shows **v8.9.0**

---

## Part 2 — Installed PWA test (phone)

Use a **real phone** — not desktop emulation only.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 1 | Open https://app.milepilot.uk on phone | App loads, navy theme | ☐ |
| 2 | **Add to Home Screen** (iOS) or **Install App** (Android/Chrome) | Install succeeds; icon shows MilePilot branding | ☐ |
| 3 | Open MilePilot **from home screen icon** | Launches **standalone** — no browser address bar or tabs | ☐ |
| 4 | Visual check | Icon, splash, navy theme, layout look correct | ☐ |
| 5 | Returning user: Welcome → **Continue** | Lands on **Dashboard** — not repeated Reports/Email/Setup | ☐ |
| 6 | Install prompt (Chrome) | Shows once after onboarding if not dismissed before | ☐ |

**iOS tip:** Safari → Share → **Add to Home Screen**  
**Android tip:** Chrome menu → **Install app** or **Add to Home screen**

---

## Part 3 — Real-world drive test checklist

Enable diagnostics first: open with **`?testmode=1`**, then go to **Settings** for the debug panel.

| # | Test | Expected | Pass |
|---|------|----------|------|
| 1 | **Start Shift indoors** | Shift starts; GPS status shows waiting/locating message | ☐ |
| 2 | GPS message | Clear in-app text — no browser alert boxes | ☐ |
| 3 | **Go outdoors** | GPS permission granted; signal improves | ☐ |
| 4 | GPS connects | Test mode: permission **granted**, accuracy shows metres | ☐ |
| 5 | **Live map appears** | Route preview on dashboard updates | ☐ |
| 6 | **Pulsing blue marker** | Blue dot with pulse animation on map | ☐ |
| 7 | **Tap map → expand** | Full-screen map; Back returns to dashboard; End Shift visible | ☐ |
| 8 | **Walk 3–5 minutes** | Miles/timer increment | ☐ |
| 9 | **Route points (test mode)** | Settings debug panel: route point count increases | ☐ |
| 10 | **End Shift** | Confirmation → summary → saved | ☐ |
| 11 | Shift saves | No error toast; summary shows miles/time | ☐ |
| 12 | **History updates** | Today's shift visible with correct miles | ☐ |
| 13 | **Report generates** | Reports tab shows data; View/Download PDF works | ☐ |
| 14 | **Email report** | If email + auto reports on: email arrives (check spam) | ☐ |
| 15 | **Close app, reopen from home screen** | App opens standalone | ☐ |
| 16 | **Returning user** | Welcome → Continue → **Dashboard** (no setup repeat) | ☐ |

### Test mode fields (Settings, `?testmode=1`)

| Field | What to watch |
|-------|----------------|
| App version | `v8.9.0` |
| Display mode | `standalone` when opened from home screen |
| Location permission | `granted` after allowing |
| GPS accuracy | Decreasing metres outdoors (e.g. 5–80 m) |
| Tracking state | `tracking` during shift |
| Route points | Increases while walking/driving |
| Last saved shift | Updates after end shift |
| Report schedule | Your configured frequency |
| Email status | Your email + auto report state |

---

## Part 4 — What to fix (if test fails)

**Do not add features during this test.** Only fix:

| Area | Examples |
|------|----------|
| Install | Wrong name/icon, not standalone, prompt broken |
| Mobile layout | Cropped buttons, nav overlap, keyboard hiding inputs |
| Permissions | Wrong copy, alert boxes, denied state unclear |
| Map | Overflow, expand broken, marker missing |
| Tracking | GPS not connecting, points not recording |
| Save/report/history | Shift lost, history empty, report/email fails |

Log failures with: device model, browser, standalone vs browser, test mode screenshot.

---

## Success criteria

MilePilot **feels like a real app** when opened from the phone home screen:

- No browser chrome
- Returning user reaches Dashboard quickly
- Full shift cycle works: start → track → map → end → history → report
- Ready for **first live driving test**

---

## Production status (MP-037)

Automated verification run against https://app.milepilot.uk — **all deploy checks passed** as of MP-037.

Phone tests (Parts 2–3) must be completed manually on device.

---

## Related docs

- [MP-036 Real Device Testing](MP-036-REAL-DEVICE-TESTING.md) — PWA prep checklist
- [MP-035 Returning Welcome Flow](MP-035-RETURNING-WELCOME-FLOW.md) — returning user routing
- [MP-034 Beta Testing Checklist](MP-034-BETA-TESTING-CHECKLIST.md) — broader beta QA
