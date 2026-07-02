# Tracking modes (MP-046)

## Philosophy

Not every customer wants background tracking. MilePilot supports both:

| Mode | Positioning |
|------|-------------|
| **AutoPilot** | Flagship — full automation, background GPS, auto-end |
| **Manual** | Privacy-first — user starts/ends each journey |

Users can switch at any time in Settings → Tracking Mode.

## Storage

| Key | Values |
|-----|--------|
| `mp_tracking_mode` | `autopilot` \| `manual` |
| `mp_driving_frequency` | `daily` \| `weekly` \| `occasionally` |

## Behaviour differences

| Feature | AutoPilot | Manual |
|---------|-----------|--------|
| Background GPS | Yes | No |
| Lock-screen recording | Yes | Only while app active |
| 90 min auto-end | Yes | No |
| Native idle watchdog | Yes | No |
| Reports | Same pipeline | Same pipeline |
| UI labels | Start/End Shift | Start/End Journey |

## Onboarding order

`permissions` → **`trackingMode`** → `notifications` → experience → profile

## Intelligence (future)

`frontend/js/intelligence-recommendations.js` records signals and exposes stub hooks:

- `getPendingRecommendations()` — returns `[]` until AI ships
- `evaluateModeRecommendation()` — returns `null`
- `recordJourneyCompleted(shift)` — called on trip end

## Files

| File | Role |
|------|------|
| `frontend/js/tracking-mode.js` | Mode state + recommendations |
| `frontend/js/intelligence-recommendations.js` | Future AI architecture (stubs) |
| `frontend/index.html` | Onboarding screen, settings, behaviour hooks |
| `tests/tracking-mode.test.js` | Unit tests |
