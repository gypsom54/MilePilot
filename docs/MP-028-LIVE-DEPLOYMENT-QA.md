# MP-028 — Live Deployment QA Checklist

**Target build:** v8.5.0  
**Environment:** https://app.milepilot.uk (Cloudflare Pages)  
**Type:** Manual live QA — no new features during this pass

Fix only: deployment, caching, state, GPS, reports, history, and broken-flow issues.

---

## Deployment steps

1. Download **MilePilot-UPLOAD-v8.5.0.zip**  
   https://github.com/gypsom54/MilePilot/raw/cursor/mp-027-production-hardening-ae00/MilePilot-UPLOAD-v8.5.0.zip

2. Unzip **all** files — the `js/` folder is required (tracking engine, plan UX, driver intelligence).

3. Cloudflare → **milepilot-app** → Upload assets → Deploy (replace all files).

4. Confirm version endpoint:  
   https://app.milepilot.uk/version.txt  
   Must contain: **`MilePilot OS v8.5.0`**

5. Hard refresh the app on your test phone/browser.

6. Clear old service worker cache if the version still looks wrong (see below).

---

## Pre-flight verification (before testing)

| Check | How | Pass |
|-------|-----|------|
| Version file | Open `/version.txt` | Shows v8.5.0 |
| App footer | Dashboard bottom: `MilePilot v8.5.0` | Matches |
| Script load | DevTools → Network → `tracking-engine.js?v=8.5.0` | 200 OK |
| Service worker | DevTools → Application → Service Workers | Cache name `milepilot-v8-5-0` |
| No stale UI | Button never shows Start Shift while Live Route is active | — |

### Clear service worker cache (if needed)

**Chrome (Android / desktop):**
1. Open https://app.milepilot.uk
2. DevTools or `chrome://inspect` → Application → Service Workers → Unregister
3. Application → Storage → Clear site data
4. Hard reload

**Safari (iOS):**
1. Settings → Safari → Advanced → Website Data → search `milepilot` → Delete
2. Re-open https://app.milepilot.uk

**Quick check after clear:** `/version.txt` = v8.5.0 and dashboard shows **Start Shift** when idle.

---

## Test device log

| Field | Value |
|-------|-------|
| Date | |
| Tester | |
| Device / OS | |
| Browser | |
| Plan (Tracker / Pro) | |
| Location permission | Granted / Denied / Skipped |
| Network | Wi‑Fi / Mobile / Offline |

---

## 1. Fresh open

**Goal:** App loads cleanly in idle state.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 1.1 | Open https://app.milepilot.uk (logged-in / onboard complete) | App loads without blank screen or JS errors | ☐ |
| 1.2 | Check layout on phone viewport | No broken layout, nav bar visible, no horizontal scroll | ☐ |
| 1.3 | Check branding | Mile **Pilot** wordmark, tagline “Drive • Track • Claim”, brand pulse | ☐ |
| 1.4 | Dashboard state | Greeting + today hero visible; **no** Live Route card | ☐ |
| 1.5 | Primary button | **Start Shift** (or **Start New Shift** if today already has a saved shift) | ☐ |
| 1.6 | No stale shift | Button is **not** End Shift unless a shift is genuinely active | ☐ |

---

## 2. Start Shift

**Goal:** Shift starts once, feedback is clear, tracking UI appears.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 2.1 | Tap **Start Shift** once | Button disables briefly; cannot start two shifts | ☐ |
| 2.2 | Status feedback | Status bar or toast: **Starting AutoPilot…** then **Finding GPS…** | ☐ |
| 2.3 | Button label | Changes to **End Shift** (red) within 1–2 seconds | ☐ |
| 2.4 | Live Route card | Appears with map area / GPS waiting copy | ☐ |
| 2.5 | Timer | Tracking bar timer counts up (`00:00:01`, …) | ☐ |
| 2.6 | GPS row | Shows GPS status (waiting → tier label when locked) | ☐ |
| 2.7 | Map | After GPS lock + movement/fix: route line and **Tap to expand** hint | ☐ |
| 2.8 | Pulse marker | Live marker visible on map when GPS points exist | ☐ |
| 2.9 | Double-tap Start | Rapid second tap does **not** reset or duplicate shift | ☐ |

**Note:** Map and pulse require location permission and a GPS fix. Indoors you may see “GPS waiting” — that is OK; shift should still run.

---

## 3. Expanded map

**Goal:** Full-screen map works without breaking tracking.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 3.1 | Wait for GPS lock + at least one route point | “Tap to expand” visible on Live Route | ☐ |
| 3.2 | Tap map / Live Route area | Full-screen **Today's Route** opens | ☐ |
| 3.3 | Expanded stats | Miles, timer, speed, GPS status visible in dock | ☐ |
| 3.4 | Wait 10–15 s | Timer and miles continue updating | ☐ |
| 3.5 | Tap **← Back** | Returns to dashboard; still **End Shift** | ☐ |
| 3.6 | End Shift from dashboard | Confirm dialog opens and completes normally | ☐ |
| 3.7 | End Shift from expanded map | **End Shift** in expand dock opens same confirm flow | ☐ |

---

## 4. End Shift

**Goal:** Save flow is single-shot, clear, and completes cleanly.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 4.1 | Tap **End Shift** | Confirmation dialog: miles, time, HMRC estimate | ☐ |
| 4.2 | Tap **Cancel** | Dialog closes; shift **still tracking**; button still **End Shift** | ☐ |
| 4.3 | Tap **End Shift** → confirm | Status: **Saving today's shift…**; confirm buttons disabled | ☐ |
| 4.4 | Save completes once | Only one completion screen; no duplicate saves in History | ☐ |
| 4.5 | Completion screen | “Nice work.” or “Shift complete.” + stats (incl. zero-mile) | ☐ |
| 4.6 | Tap **Done** once | Returns to dashboard; Done cannot double-submit | ☐ |
| 4.7 | After Done | **No** completion screen loop on refresh | ☐ |

---

## 5. Dashboard after shift

**Goal:** Idle dashboard reflects today’s work.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 5.1 | Primary button | **Start New Shift** (if today has journeys) or **Start Shift** | ☐ |
| 5.2 | No completion loop | `#ccSummary` hidden; no stuck “Done” overlay | ☐ |
| 5.3 | Today hero | Business miles / today totals include completed shift | ☐ |
| 5.4 | Recent activity | **Pro:** recent days update. **Tracker:** section hidden by design | ☐ |
| 5.5 | AutoPilot panel | Status lines sensible (last shift / reports schedule) | ☐ |

---

## 6. Reports

**Goal:** PDF and email paths work; empty and populated states behave.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 6.1 | Open **Reports** tab | Document Centre loads | ☐ |
| 6.2 | **Daily** tab | Today’s miles/journeys match completed shift | ☐ |
| 6.3 | **View PDF** | PDF opens or mobile viewer; no garbled characters (£, miles, dates) | ☐ |
| 6.4 | **Download PDF** | File downloads; status “Generating report…” then success toast | ☐ |
| 6.5 | Route in PDF | Shifts with route show journey data; zero-route shifts omit map gracefully | ☐ |
| 6.6 | **Weekly / Monthly** | Totals calculate; zero-mile shifts show as 0.0 mi | ☐ |
| 6.7 | **Email Again** (if email configured) | “Sending report…” → success or clear offline/error toast | ☐ |
| 6.8 | Empty period | Before any shifts: empty state copy, no crash | ☐ |

---

## 7. History

**Goal:** Saved shifts appear correctly with drill-down.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 7.1 | Open **History** tab | Calendar loads for current month | ☐ |
| 7.2 | Today’s row | Shows miles, time, shift count for today | ☐ |
| 7.3 | Tap today (single shift) | Opens shift detail directly | ☐ |
| 7.4 | Shift detail | Correct miles, times, HMRC, journey count | ☐ |
| 7.5 | Route preview | Map renders when ≥2 GPS points; placeholder when no route | ☐ |
| 7.6 | Zero-mile shift | Saves and displays 0.0 mi; no broken map crash | ☐ |
| 7.7 | Empty history (new install) | “No shifts saved yet” card with guidance | ☐ |
| 7.8 | **View report** from day detail | Opens Reports for that day | ☐ |

---

## 8. Edge cases

**Goal:** Recovery paths never leave the user stuck.

| # | Scenario | Expected | Pass |
|---|----------|----------|------|
| 8.1 | **Refresh during tracking** | Still **End Shift**; timer resumes; Live Route visible | ☐ |
| 8.2 | **Refresh after Done** | Idle dashboard; no completion screen; no ghost active shift | ☐ |
| 8.3 | **Double-tap Start Shift** | One shift only | ☐ |
| 8.4 | **Double-tap End Shift / confirm** | One save only; one History entry | ☐ |
| 8.5 | **Location denied** | Shift can start; banner explains enable location; no crash | ☐ |
| 8.6 | **Weak GPS** (indoors) | “GPS accuracy low” or waiting; shift continues | ☐ |
| 8.7 | **Offline** (airplane mode) | Offline banner; shift saves locally; report email fails gracefully | ☐ |
| 8.8 | **Background / return** | Tab away 1–2 min, return: tracking resumes or reconnects | ☐ |
| 8.9 | **Short shift** (<1 min) | End and save without error | ☐ |
| 8.10 | **Second shift same day** | Start New Shift → End → both in History | ☐ |

---

## Failure log (use if any test fails)

| Test # | What happened | Expected | Device | Fix priority |
|--------|---------------|----------|--------|--------------|
| | | | | P0 / P1 / P2 |

**P0:** Data loss, wrong button state, cannot end shift, duplicate saves  
**P1:** Missing feedback, broken PDF, history wrong  
**P2:** Copy, animation, minor layout

---

## Success criteria

The live Cloudflare app is ready for real phone testing when:

- [ ] `/version.txt` confirms **v8.5.0**
- [ ] All **P0** tests pass on at least one iOS and one Android device
- [ ] Full shift cycle (Start → track → End → Done) completes without confusion
- [ ] Refresh during tracking and after completion both land in valid states
- [ ] History and Daily report reflect the completed shift
- [ ] No Start Shift + active Live Route contradiction

---

## Scope reminder (MP-028)

| In scope | Out of scope |
|----------|--------------|
| Deploy / cache verification | New features |
| State & button logic fixes | UI redesign |
| GPS / save / report bugs | New screens |
| History / PDF broken flows | Backend changes unless blocking |

---

## Quick reference URLs

| Resource | URL |
|----------|-----|
| App | https://app.milepilot.uk |
| Version check | https://app.milepilot.uk/version.txt |
| Upload zip | MilePilot-UPLOAD-v8.5.0.zip (see Deployment steps) |
