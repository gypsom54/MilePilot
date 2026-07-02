# Dashboard UI Lock

**Status:** DESIGN COMPLETE — Frozen (July 2026)  
**Screen:** Command Centre — `#home` `data-mp="MP-006"` `data-locked="true"`  
**Version locked:** v8.43.19

> **Rule:** No further cosmetic redesigns unless a genuine usability issue is discovered.

**Related docs:**
- [MILEPILOT_UI_LOCK.md](./MILEPILOT_UI_LOCK.md) — screen status board
- [MILEPILOT_LOCKED_COMPONENTS.md](./MILEPILOT_LOCKED_COMPONENTS.md) — Phase 1 lock policy
- [MILEPILOT-DESIGN-BIBLE.md](./MILEPILOT-DESIGN-BIBLE.md) — visual standard for remaining screens

---

## Freeze policy

The Dashboard is the **visual standard** for the rest of the application.

### Allowed future work

- Displaying **live mileage**
- Displaying **journey history**
- Displaying **AI insights** (when engine is ready)
- Displaying **reports**
- Populating **Recent Activity** with real trip data
- Bug fixes that affect usability

### Not allowed

- Layout redesigns
- Copy polish passes (unless bug)
- New cards or navigation changes
- Typography / colour system changes
- Competing CTAs or visual hierarchy experiments

---

## Approved structure

| Section | Element | Notes |
| --- | --- | --- |
| Header | Brand bar + wordmark + pulse | Unchanged |
| Trial | Status pill + chevron | `7 days left in your free trial ›` |
| Greeting | `Good {time}, {name} 👋` | Dynamic from `getTimeGreeting()` |
| Support line | `Ready for another shift?` | Below greeting |
| Hero label | `Today's Business Miles` | Above metric |
| Hero value | Large mileage number | e.g. `0.0` |
| Hero message | **MilePilot is ready when you are.** | Permanent — beneath metric |
| Primary CTA | `Start Shift` | Prominent button |
| Today's Business | 3 stat cards | Business Miles · Drive Time · Journeys |
| Empty state | First journey prompt | Shown when no shifts |
| Recent Activity | List or empty state | *No journeys yet* / *Your completed trips will appear here.* |
| Navigation | 4-tab floating bar | Matches dashboard navy; active tab glows only |

### Removed (do not reintroduce)

- Business Insight card (redundant with empty state)
- *Drive. Track. Claim.* marketing line on dashboard
- *Ready to start earning?* hero message
- Day-by-day “No journeys recorded” dead rows in Recent Activity

---

## Permanent hero message

**MilePilot is ready when you are.**

- Works for every self-employed profession
- Does not imply ride-hail or delivery
- Reinforces MilePilot brand
- Premium, calm, confident, timeless

---

## Screenshot reference

Captured at lock: `scripts/capture-dashboard-screen.js` → `/opt/cursor/artifacts/screenshots/dashboard-phase1-polish.png`

---

## Agent checklist

Before editing `#home`:

- [ ] Is this a genuine usability bug? If no → stop.
- [ ] Is this only populating live data (miles, trips, AI, reports)? If yes → allowed.
- [ ] Am I changing layout, copy, colours, or card structure? If yes → stop.
