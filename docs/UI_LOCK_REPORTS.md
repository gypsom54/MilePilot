# Reports Screen UI Lock

**Status:** APPROVED — Frozen (July 2026)  
**Component:** `#reports` `.reports-screen` — Report Centre  
**Version locked:** v8.43.22

> **Rule:** No redesign, functionality, report generation, or navigation changes unless a genuine usability issue is discovered.

**Related docs:**
- [UI_LOCK_NAVIGATION.md](./UI_LOCK_NAVIGATION.md) — bottom navigation dock
- [MILEPILOT_UI_LOCK.md](./MILEPILOT_UI_LOCK.md) — screen status board

---

## Freeze policy

Visual polish only. Future work on this screen concerns **real report generation and report data** — not layout.

### Locked copy

| Element | Text |
| --- | --- |
| Search placeholder | Search saved reports… |
| Empty heading | Your reports will appear here |
| Empty body | After each completed business shift, MilePilot automatically prepares your professional mileage report. |
| Empty support | Ready to share with HMRC or your accountant. |
| Premium kicker | Accountant-ready PDF reports |
| Bottom features | ✓ Business mileage · Journey history · HMRC summary · PDF export |

### Locked visuals

| Element | Value |
| --- | --- |
| Active filter chip | Brighter blue gradient + glow (palette unchanged) |
| Report icon | ~10% larger (53×53px, 24px emoji) |
| Empty illustration | ~10% larger (132×97px container) |
| Typography | Centred empty state; existing Reports hierarchy |

### Not allowed

- Redesigning Report Centre layout
- Changing report generation, archive logic, or email flows
- Navigation or tab changes
- Altering filter/search behaviour

### Allowed

- Bug fixes for safe-area or scroll on new devices
- Real report data / PDF generation improvements (Phase 2)

---

## Agent checklist

Before editing `#reports`:

- [ ] Is this a genuine layout/safe-area bug? If no → stop.
- [ ] Am I changing report logic, archive APIs, or navigation? If yes → stop.
- [ ] Does the empty state still match locked copy above?
