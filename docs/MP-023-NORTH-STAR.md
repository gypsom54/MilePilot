# MP-023 — AutoPilot Product Philosophy (The North Star)

**Status:** Active — supersedes all prior philosophy docs for product decisions  
**Promise:** Set it up once. MilePilot does the rest.

> Before building another feature, align with this document.  
> It is more important than any individual screen.

---

## The Mission

MilePilot is **not** a mileage tracker.

MilePilot is an **AutoPilot for business mileage**.

Our job is not to help people track mileage.

Our job is to **remove mileage administration from their lives**.

The customer should set MilePilot up once.

After that, MilePilot quietly handles everything in the background.

---

## Product Promise

**Set it up once. MilePilot does the rest.**

This is the foundation of every product decision.

---

## AutoPilot

AutoPilot is a **core product feature**.

AutoPilot means MilePilot automatically:

- Detects movement (where supported)
- Records business journeys
- Saves every shift
- Builds reports
- Archives history
- Calculates mileage totals
- Emails reports
- Keeps records organised

The user should never need to remember any of these tasks.

---

## User Experience

The experience should feel **effortless**.

The customer should never think: *"I need to open MilePilot."*

They should think: *"I know MilePilot has already taken care of it."*

That is success.

---

## Dashboard Philosophy

The Dashboard is **not** a control panel.

It is **reassurance**.

The dashboard answers one question:

> **Is everything working?**

Examples:

- ✓ AutoPilot Active
- ✓ Next weekly report: Sunday 6:00 PM
- ✓ Last shift successfully saved

**Primary action:** Start Shift

Nothing else should distract from this.

---

## Reports Philosophy

Reports should never feel like work.

The customer should never manually save, generate, download, or organise.

**The reports simply exist.**

- If automatic reports are enabled → they are already waiting
- If email reports are enabled → they are already delivered

Document Centre is for viewing when needed — not daily admin.

---

## Automation First

Every future feature must answer:

> **Can AutoPilot do this instead?**

| Answer | Action |
|--------|--------|
| **Yes** | Automate it |
| **No** | Ask the user only when absolutely necessary |

---

## Simplicity Rule

Reduce taps. Reduce decisions. Reduce admin.

If a feature creates unnecessary work → remove it, hide it, or automate it.

---

## Silent Automation

The best feature is the one the user never notices.

- Trips quietly saved
- Reports quietly generated
- History quietly organised
- Emails quietly delivered

Nothing requires manual management unless the user specifically wants it.

---

## Trust

MilePilot is built on trust.

The customer must believe: **"My records are always ready."**

That feeling is more valuable than dozens of extra features.

---

## Product Hierarchy

### Layer 1 — Tracker

Simple mileage tracking. Automatic reports. **No clutter.**

### Layer 2 — Business (Pro)

Everything in Tracker, plus future business tools:

- Expenses
- Receipts
- Business insights
- Tax preparation
- AI assistance

Users should only see the level they chose. Never overwhelm them.

---

## Design Principle

Do not add features because competitors have them.

Only add features if they **reduce work**.

The interface should become **simpler** as the product becomes **smarter**.

---

## Golden Question

Before every new feature:

> **Does this make the user's life easier?**

If not → do not build it.

If yes → **Can AutoPilot handle it?**

If AutoPilot can → the user should barely notice the feature exists.

---

## Definition of Success

MilePilot succeeds when the customer says:

> **"I don't even think about mileage anymore."**

That is the experience we are building.

That is our competitive advantage.

That is the future of MilePilot.

---

## Related docs

- `docs/MP-021-AUTOPILOT-PHILOSOPHY.md` — onboarding implementation
- `docs/MP-022-BRAND-MESSAGING.md` — copy and voice
- `docs/AUTO_PILOT.md` — driving flow automation (MP-016)
