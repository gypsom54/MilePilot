# MP-017 — Live Tracking Screen & Map Strategy

**Version:** v7.6.4  
**Status:** Complete

## v7.6.4 polish

- Live map always draws a reassuring route line (green start + blue polyline) even when parked or GPS drift is minimal
- GPS accuracy colour tiers: Excellent (0–15m), Good (15–40m), Fair (40–80m), Weak (80m+)
- Merged tracking header: 🟢 Tracking + High Accuracy GPS subtitle
- **Current Journey** card under map: Started, Elapsed, Distance, Average Speed + live insight
- Premium **Shift Summary** on End Shift: longest journey, average speed, report saved ✓, weekly schedule
- Smarter Business Insight copy (longest journey, HMRC saved, driven further than yesterday)

## Product principle

MilePilot is a calm, premium business assistant — not a full-screen GPS logger. The map supports confidence and proof; it does not dominate the experience.

## Live tracking (Dashboard)

During an active shift the Command Centre shows:

1. **Shift in progress** header
2. **● Tracking** status + **GPS connected** line
3. Large live shift timer
4. **Business Miles** hero stat
5. Supporting stats: Driving Time, Current Speed, Business Miles, GPS Accuracy
6. **Live Route** card with polyline, markers, GPS status, tap-to-expand
7. **End Shift** primary action

No full-screen map. The legacy `#tracking` screen remains in the bundle but is not used in the default flow.

## Map placement

| Location | Size |
|----------|------|
| Live tracking | Live Route card + optional full-screen expand |
| History shift detail | Larger route review |
| PDF report | Route Map section when route points exist |

## State flow (v7.6.1 fix)

Dashboard is **state-driven**, not screen-driven:

| State | When | Dashboard |
|-------|------|-----------|
| Default | No shift today | Greeting + Start Shift |
| Active | Shift running | Live tracking |
| Complete | Immediately after End Shift | One-time overlay → Done |
| Today done | Shift ended, no active shift | Today's driving + Start New Shift |

The completion screen never becomes the permanent dashboard. `mp_work_done` removed.

## PWA GPS limits

Browser/PWA location works while the app is open. Branded in-app messaging when permission is blocked — no native `alert()`.

## PDF

- Route Map section on page 2 when GPS points exist
- Plain text: "No route map available for this shift." when not
- Unicode arrows/emojis removed from PDF output (ASCII-safe labels)
