# MP-031 — MilePilot Product Principles

**Status:** 🔒 Permanent — required reading before any new feature, screen, or interaction  
**Branch:** `cursor/mp-031-product-principles-ae00`  
**Type:** Product philosophy (not a feature sprint)

Before adding any further features, every decision must follow this document.

---

## Product Promise

**Drive.**

**Track.**

**Claim.**

**Your business.**

**On AutoPilot.**

This is the promise on every screen, in every sprint, and in every line of copy.

---

## Core Philosophy

MilePilot exists to **remove mileage administration**.

The customer should spend **less time using MilePilot, not more**.

Every feature must reduce work.

**Never create more work.**

If a feature adds complexity without reducing work, it should not be added.

---

## UX Principles

Every future screen, feature, and interaction must follow these rules:

1. **One purpose per screen.**
2. **One primary action per screen.**
3. **One decision at a time.**
4. **Plain English only.**
5. **If something can happen automatically, automate it.**
6. **Hide complexity.**
7. **Never interrupt a working user.**
8. **Every completed shift should require zero admin.**
9. **Every report should appear automatically.**
10. **The app should feel calm.**

---

## Dashboard Rules

The dashboard is **reassurance, not analytics**.

Show only what matters today.

### Show

| Element | Purpose |
|---------|---------|
| **Today's Business** | Business miles + driving time |
| **AutoPilot Status** | Is everything working? |
| **Next Scheduled Report** | When the next report arrives |
| **Primary action** | Start Shift or End Shift |

### Remove

Unnecessary visual noise. Analytics layers, extra metrics, and configuration that belongs in Settings do not belong on the idle dashboard.

The dashboard answers one question:

> **Is everything working?**

---

## Copywriting Rules

Replace technical language with human language.

| Avoid | Use |
|-------|-----|
| GPS Initialising | Finding your location… |
| Database updated | Everything has been saved. |
| PDF queued | Your report will arrive automatically. |
| SMTP unavailable | Reports won't be emailed until an email address has been added. |
| Storage blocked | Your records could not be saved on this device. |

**Voice:** Calm. Reassuring. Professional. Plain English. No jargon.

See also: `docs/MP-022-BRAND-MESSAGING.md` for taglines and brand lines.

---

## Design Rules

Preserve the existing MilePilot visual identity:

- Dark navy background
- Blue highlights
- Rounded cards
- Minimal copy
- Consistent spacing

Every new screen must feel like part of the **same product** — not a new app bolted on.

See also: `docs/DESIGN_LOCKED.md` for locked onboarding screens.

---

## Feature Gate

Before every new feature, answer these questions in order:

1. **Does this make the user's life easier?**  
   If no → do not build it.

2. **Does this reduce mileage administration?**  
   If no → do not build it.

3. **Can AutoPilot do this instead?**  
   If yes → automate it. The user should barely notice.

4. **Does this add a decision, tap, or screen the user didn't need?**  
   If yes → remove, hide, or automate it.

5. **Does this follow all ten UX principles above?**  
   If no → redesign before shipping.

---

## Success Criteria

Every future feature must support the MilePilot promise:

**Your business. On AutoPilot.**

MilePilot succeeds when the customer says:

> *"I don't even think about mileage anymore."*

That is the experience we are building.

That is our competitive advantage.

Every competitor says *"We track mileage."*

We say: **We remove mileage admin from your life.**

---

## Related docs

| Doc | Role |
|-----|------|
| `docs/MP-023-NORTH-STAR.md` | Extended product vision and hierarchy |
| `docs/MP-022-BRAND-MESSAGING.md` | Taglines, voice, and copy examples |
| `docs/MP-021-AUTOPILOT-PHILOSOPHY.md` | AutoPilot onboarding implementation |
| `docs/MP-029-AUTOPILOT-CONFIDENCE.md` | AutoPilot Status health check |
| `docs/MP-030-PERFECT-FTUE.md` | First-time user experience |
| `docs/AUTO_PILOT.md` | Driving flow and end-shift automation |

**MP-031 is the gate.** If another doc conflicts with MP-031, MP-031 wins.
