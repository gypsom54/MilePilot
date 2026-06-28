# MP-027 — Production Hardening & Edge Case Sprint

**Version:** v8.5.0  
**Branch:** `cursor/mp-027-production-hardening-ae00`  
**Type:** Reliability polish — no new features

---

## Goal

Make MilePilot feel calm, reliable, and professional. Every shift path must end in a valid state. Users should never be stuck or confused.

---

## What shipped

### Shift lifecycle

- **Atomic end-shift save** — if `persistShifts()` fails, shift rolls back to tracking (restores `mp_active_shift` snapshot) instead of leaving ghost state
- **`cancelEndShift()`** engine helper for ENDING → TRACKING rollback
- **Start shift** protected with `shiftBusy` + "Starting AutoPilot…" loading state
- **End shift confirm** buttons disabled while saving; zero-mile confirm copy
- Legacy tracking screen END SHIFT routes through confirm dialog

### Loading states

- Fixed **status bar** (`#mpStatusBar`) for background operations:
  - Starting AutoPilot…
  - Finding GPS…
  - Saving today's shift…
  - Generating report…
  - Sending report…
  - Preparing history…

### Button protection

- Start Shift, End Shift, Done, Save Settings, Stay Updated, report download/email — all guarded against double-tap
- Disabled button styling (opacity + no pointer events)

### Edge cases

- GPS denied/unavailable/weak — existing banners + clearer "Finding GPS…" status
- Offline — network banner unchanged; save failures explain next step
- Refresh during tracking — reconcile + lighter tick render
- Zero-mile shifts — full summary stats shown; dashboard journey count only when miles/stops exist
- Empty history — dedicated empty state card
- Single-shift days — tap opens shift detail directly

### Performance

- **`renderTrackingTick()`** — timer updates elapsed/miles without full dashboard re-render every second
- Full `renderCommandCentre()` on GPS events, start/end, navigation

### Auto-save validation

End shift flow: save shift → persist history → clear active → update dashboard → archive reports → queue PDF/email (with failure toasts, never blocking save)

---

## QA checklist

| Path | Expected |
|------|----------|
| Fresh install | Idle dashboard, Start Shift |
| First shift | Start → End → Done → saved in history |
| Zero-mile shift | Saves, summary shows time/HMRC |
| GPS denied | Shift continues, clear enable prompt |
| Refresh while tracking | Restores End Shift + timer |
| Save failure on end | Returns to tracking, toast explains |
| Double-tap Start/End | Ignored while busy |
| Empty history | Helpful empty card |
| Empty reports | Existing empty state |
| Daily/weekly/monthly reports | Zero-mile shifts included with 0.0 mi |

---

## Deploy

Upload `MilePilot-UPLOAD-v8.5.0.zip` — verify `https://app.milepilot.uk/version.txt` shows **v8.5.0**

Service worker cache: `milepilot-v8-5-0`
