# MP-017 — Live Tracking Screen & Map Strategy

**Version:** v7.6.0  
**Status:** Complete

## Product principle

MilePilot is a calm, premium business assistant — not a full-screen GPS logger. The map supports confidence and proof; it does not dominate the experience.

## Live tracking (Dashboard)

During an active shift the Command Centre shows:

1. **Shift in progress** header
2. **● Tracking** status + **GPS connected** line
3. Large live shift timer
4. **Business Miles** hero stat
5. Supporting stats: Driving Time, Journeys, Estimated HMRC Allowance
6. **Route preview** card (map or branded placeholder)
7. **End Shift** primary action

No full-screen map. The legacy `#tracking` screen remains in the bundle but is not used in the default flow.

## Map placement

| Location | Size |
|----------|------|
| Live tracking | Small preview card |
| History shift detail | Larger route review |
| PDF report | Route Map section when route points exist |

## End shift

Auto-save flow from MP-016 is unchanged: stop GPS, save shift + route, generate reports in background, **Done** only on completion screen.

## PWA GPS limits

Browser/PWA location works while the app is open. Branded in-app messaging when permission is blocked — no native `alert()`.

## PDF

- Route Map section on page 2 when GPS points exist
- Plain text: "No route map available for this shift." when not
- Unicode arrows/emojis removed from PDF output (ASCII-safe labels)
