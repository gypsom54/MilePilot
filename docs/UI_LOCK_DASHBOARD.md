# Dashboard UI Lock

**Status:** APPROVED — Frozen (2 July 2026)  
**Screen:** Command Centre — `#home` `data-mp="MP-006"` `data-locked="true"`  
**Version locked:** v8.43.23 (nav dock v8.43.21 — see [UI_LOCK_NAVIGATION.md](./UI_LOCK_NAVIGATION.md))  
**User approval:** Dashboard screenshot approved — Phase 1 Dashboard UI complete.

**Related docs:**
- [UI_LOCK_NAVIGATION.md](./UI_LOCK_NAVIGATION.md) — bottom navigation dock
- [MILEPILOT_UI_LOCK.md](./MILEPILOT_UI_LOCK.md) — screen status board
- [MILEPILOT_LOCKED_COMPONENTS.md](./MILEPILOT_LOCKED_COMPONENTS.md) — Phase 1 lock policy
- [MILEPILOT-DESIGN-BIBLE.md](./MILEPILOT-DESIGN-BIBLE.md) — visual standard for remaining screens

---

## Freeze policy

**Dashboard approved. Dashboard frozen.**

This concludes **Phase 1 Dashboard UI**. The Dashboard is the **visual standard** for the rest of the application.

### Allowed future work

- **Live mileage data** — real-time values in hero and Today's Business
- **AI insights** — intelligence layer when engine is ready
- **Journey history** — Recent Activity populated from trips
- **Reports** — links and summaries from real report data
- **Premium features** — subscription-gated content display
- Bug fixes that affect usability or safe-area layout

### Not allowed

- Layout redesigns
- Copy polish passes (unless genuine usability bug)
- New cards or navigation changes
- Typography / colour system changes
- Competing CTAs or visual hierarchy experiments
- Reintroducing duplicate hero messaging

---

## Approved structure

Visual hierarchy (top → bottom):

| Order | Section | Element | Notes |
| --- | --- | --- | --- |
| 1 | Header | Compact brand bar | Logo ~12% smaller than app default; pulse + tagline |
| 2 | Trial | Status pill + chevron | `7 days left in your free trial ›` |
| 3 | Greeting | `Good {time}, {name} 👋` | Dynamic from `getTimeGreeting()` |
| 4 | Support line | `Ready for another shift?` | Below greeting — sole idle-state prompt |
| 5 | Hero label | `Today's Business Miles` | Above metric |
| 6 | Hero value | Large mileage number | e.g. `0.0` |
| 7 | Primary CTA | `Start Shift` | Prominent button |
| 8 | Today's Business | 3 stat cards | Business Miles · Drive Time · Journeys |
| 9 | Empty state | First journey prompt | When no shifts |
| 10 | Recent Activity | List or empty state | *No journeys yet* / *Your completed trips will appear here.* |
| 11 | Navigation | Full-width dock | See [UI_LOCK_NAVIGATION.md](./UI_LOCK_NAVIGATION.md) |

### Removed (do not reintroduce)

- **MilePilot is ready when you are.** — duplicate of greeting/support line (removed v8.43.23)
- Business Insight card (redundant with empty state)
- *Drive. Track. Claim.* marketing line on dashboard
- *Ready to start earning?* hero message
- Day-by-day “No journeys recorded” dead rows in Recent Activity
- Oversized dashboard logo (reduced v8.43.23)

---

## Dashboard logo (locked)

Dashboard-only compact branding — user already knows they are in MilePilot:

- Wordmark: `clamp(28px, 7.2vw, 29px)` (~12% smaller than default 34px)
- Pulse width: `min(170px, 48vw)`
- Tagline: 10px, tightened margins

Other screens retain standard brand-bar sizing.

---

## Screenshot reference

Captured at final lock: `scripts/capture-dashboard-screen.js` → `/opt/cursor/artifacts/screenshots/dashboard-phase1-polish.png`

---

## Agent checklist

Before editing `#home`:

- [ ] Is this a genuine usability bug? If no → stop.
- [ ] Is this only populating live data (miles, trips, AI, reports)? If yes → allowed.
- [ ] Am I changing layout, copy, colours, or card structure? If yes → stop.
