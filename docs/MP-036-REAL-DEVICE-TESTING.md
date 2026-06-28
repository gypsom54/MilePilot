# MP-036 — Real Device Testing Checklist

**Version:** v8.9.0  
**Build:** MP-036  
**Goal:** Verify MilePilot feels like a real app when installed to the phone home screen — full shift workflow without browser chrome.

---

## Before you start

| Step | Action | Pass |
|------|--------|------|
| Deploy | Upload `MilePilot-UPLOAD-v8.9.0.zip` to Cloudflare Pages | ☐ |
| Version | Confirm `https://app.milepilot.uk/version.txt` shows **v8.9.0 — MP-036** | ☐ |
| Test mode | Optional: append `?testmode=1` to URL for Settings debug panel | ☐ |
| Device | Use a real iPhone and a real Android phone (not desktop emulation only) | ☐ |

---

## PWA install experience

| # | Test | Expected | Pass |
|---|------|----------|------|
| 1 | **Install to home screen** | Browser offers install, or use Share → Add to Home Screen (iOS). App name shows **MilePilot**. Icon is navy MilePilot branding. | ☐ |
| 2 | **Open from home screen** | Launches in standalone mode — no browser address bar or tabs. Theme/splash colour is MilePilot navy (`#031126`). | ☐ |
| 3 | **Install prompt (Chrome/Edge)** | After onboarding, “Install MilePilot” overlay appears once. “Install App” triggers native install. “Not now” dismisses and does not reappear. | ☐ |

---

## Onboarding & permissions

| # | Test | Expected | Pass |
|---|------|----------|------|
| 4 | **Complete onboarding** | New user: Welcome → Reports → Email → Location → AutoPilot Ready → Dashboard. Returning user: Welcome → Continue → Dashboard. | ☐ |
| 5 | **Location permission copy** | Onboarding shows: “MilePilot needs location access to track business miles while you're working.” | ☐ |
| 17 | **Denied permission test** | Deny location in browser/phone settings. App shows plain in-app message (no alert box): “Location access is blocked… enable location permissions for MilePilot…” | ☐ |

---

## Shift tracking — indoor / outdoor / movement

| # | Test | Expected | Pass |
|---|------|----------|------|
| 5 | **Start shift indoors** | Shift starts; GPS may show “waiting” — no crash, clear status. | ☐ |
| 6 | **Start shift outdoors** | GPS connects; accuracy shown; map updates. | ☐ |
| 7 | **Walk test (5 min)** | Route records; miles increment sensibly; timer runs. | ☐ |
| 8 | **Short drive test (10 min)** | Route line visible; miles and HMRC estimate update; End Shift reachable with one thumb. | ☐ |
| 9 | **Longer drive test (30+ min)** | No data loss; shift persists; bottom nav remains visible; primary actions reachable. | ☐ |
| 16 | **Weak signal test** | In poor GPS area, app shows weak-signal messaging — does not crash or lose shift. | ☐ |

---

## Map & UI

| # | Test | Expected | Pass |
|---|------|----------|------|
| 10 | **Expand map** | Tap live route → full-screen map. Back button returns to dashboard. End Shift visible in expanded dock. | ☐ |
| — | **Mobile layout** | Test iPhone size, Android size, short height (SE), tall height (Pro Max). No cropped buttons, hidden nav, or report actions cut off. | ☐ |
| — | **Keyboard** | Email inputs scroll into view when keyboard opens — not hidden behind keyboard. | ☐ |

---

## End shift, history & reports

| # | Test | Expected | Pass |
|---|------|----------|------|
| 11 | **End shift** | Confirmation dialog; summary shows miles/time/HMRC; shift saves. | ☐ |
| 12 | **Confirm history saved** | History tab shows today's shift with correct miles and time. | ☐ |
| 13 | **Confirm report generated** | Reports tab shows data for the period; PDF/view actions work. | ☐ |
| 14 | **Confirm email delivered** | If email + auto reports enabled, report email arrives (check inbox/spam). | ☐ |

---

## App lifecycle

| # | Test | Expected | Pass |
|---|------|----------|------|
| 15 | **Close and reopen app** | Open from home screen again — dashboard loads; completed shift still in history. | ☐ |
| 16 | **Refresh during tracking** | With active shift, refresh page — shift restores; tracking resumes if location granted. | ☐ |

---

## PWA limitations (expected behaviour)

| Check | Expected | Pass |
|-------|----------|------|
| Background note | Dashboard/settings explain PWA works best from home screen; native background tracking coming in mobile app build. | ☐ |
| Background tracking | Do **not** expect full native background GPS when app is fully backgrounded — document any gaps honestly. | ☐ |

---

## Test mode debug panel (`?testmode=1`)

Visible in **Settings only** when URL contains `?testmode=1`:

| Field | Use |
|-------|-----|
| App version | Confirm v8.9.0 |
| Location permission | granted / denied / prompt |
| GPS accuracy | Live metres during tracking |
| Tracking state | idle / tracking |
| Route point count | Increases during movement |
| Last saved shift | Timestamp of active or last completed shift |
| Report schedule | Current frequency |
| Email status | Configured email and auto-report state |

---

## Success criteria

MilePilot should feel like a real app when launched from the phone home screen. The tester can:

- Open the app (no browser UI)
- Start a shift
- See tracking and map
- End a shift
- Receive/generate a report
- Review history

…without using the browser interface.

This build prepares MilePilot for real-world phone testing before TestFlight / native app packaging.

---

## Deploy

Upload `MilePilot-UPLOAD-v8.9.0.zip` — verify `https://app.milepilot.uk/version.txt` shows **v8.9.0**

Service worker cache: `milepilot-v8-9-0`
