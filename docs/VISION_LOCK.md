# MilePilot Vision Lock

**Status:** 🔒 Locked — End of Day, June 2026  
**Rule:** All future development must follow this document.

---

## What MilePilot is

MilePilot is **no longer just a mileage tracker**.

It is becoming **the business companion for self-employed professionals**.

Mileage tracking remains the **core feature**, but the platform must grow naturally **without redesigning the experience**.

> Driversnote helps people track miles.  
> MilePilot helps people run their business.

---

## Two experiences (do not build Business tools yet)

### 1. MilePilot Tracker — £5.99/month (target)

For users who want simplicity only:

- Automatic mileage tracking
- GPS route recording
- HMRC mileage estimates
- Automatic PDF reports
- Automatic email reports
- History

**Nothing else.** Simple. Beautiful. Zero clutter.

### 2. MilePilot Business — £9.99/month (target)

Everything in Tracker, plus future business tools:

- Business expenses
- Receipt storage
- Accountant exports
- Tax estimates
- Business insights (extended)
- Income tracking
- Business dashboard
- AI business assistant
- Future self-assessment support

**Do not build these until the platform layer is ready.** Architecture only for now.

---

## Future onboarding flow

Target sequence:

```
Welcome
  ↓
Name
  ↓
Vehicle
  ↓
GPS Permissions
  ↓
Automatic Reports (notifications)
  ↓
Choose your experience  ✅ MP-020
  • MilePilot Tracker — "I just want mileage tracking and automatic reports."
  • MilePilot Business — "I'd like MilePilot to help manage my business."
  ↓
What do you use MilePilot for?  ✅ MP-019
  • Professional Driver
  • Tradesperson
  • Mobile Business
  • Self-employed Professional
  • Other
  ↓
Dashboard
```

Both selections save permanently to the **Business Profile**.

---

## Business Profile (architecture)

Single profile object — not hard-coded "Work Type" only.

**Current fields:**

| Field | Purpose |
|-------|---------|
| `experience` | `tracker` \| `business` |
| `profession` | Driver, tradesperson, etc. |

**Reserved for future:**

| Field | Purpose |
|-------|---------|
| `vehicle` | Profile vehicle (may mirror tracking vehicle) |
| `accountant` | Accountant contact / export prefs |
| `vatRegistered` | VAT status |
| `businessStructure` | Sole trader / Ltd company |
| `hmrcMethod` | Mileage allowance vs actual costs |
| `taxYear` | Active tax year |
| `receiptsEnabled` | Receipt capture preference |

Storage key: `mp_business_profile` (JSON in localStorage today; cloud later).

---

## Personalised experience matrix

| Profession | Tracker | Business |
|------------|---------|----------|
| Professional Driver | Simple mileage tracking | Mileage + business tools |
| Tradesperson | Mileage for client visits | Mileage + expenses & receipts |
| Mobile Business | Business travel tracking | Full mobile business hub |
| Self-employed Professional | Client visit mileage | Mileage + tax & accountant tools |
| Other | General business mileage | General business companion |

Terminology adapts by profession. UI layout stays identical.

---

## Design principles 🔒

The UI language is **locked**. Continue using:

- Navy backgrounds (`#031126`)
- Electric blue highlights (`#0D6BFF`)
- Large typography
- Minimal cards
- Calm spacing
- Premium animations
- Centred MilePilot branding

**Never sacrifice simplicity for more features.**

- Hide complexity
- Reveal functionality only when appropriate
- Tracker users must never feel overwhelmed

See also: [DESIGN_LOCKED.md](./DESIGN_LOCKED.md)

---

## Golden rule (every future feature)

Before building, answer **yes** to all:

1. Does this make MilePilot feel more valuable?
2. Does this reduce admin for the user?
3. Does it still feel calm and uncluttered?
4. Can the feature be hidden if the user only wants simple mileage tracking?
5. Does it reinforce MilePilot as a premium business companion?

If **no** to any — rethink before building.

---

## Platform architecture (code)

| Layer | Location | Purpose |
|-------|----------|---------|
| Business Profile | `mp_business_profile` | User experience + profession + future fields |
| Experience tiers | `EXPERIENCES` in `index.html` | Tracker vs Business definitions |
| Feature registry | `FEATURE_REGISTRY` | Gate future features by tier |
| Access helpers | `canAccessFeature()`, `getUserExperience()` | Hide Business-only UI when on Tracker |

Payment/subscription screens: **not built yet**. Tier IDs and prices are defined for future billing integration.

---

## Long-term vision (not built)

MilePilot eventually helps users:

- Track mileage
- Track expenses
- Organise receipts
- Prepare HMRC records
- Work with accountants
- Understand business performance
- Prepare tax returns

All while maintaining the **same calm, premium interface**.

---

## What this document does NOT authorise

- Redesigning onboarding, dashboard, or navigation without explicit approval
- Adding Business-tier features before platform gating exists
- Showing pricing screens before billing is implemented
- Increasing dashboard clutter for Tracker users

---

## North star

**The business companion for self-employed professionals.**

Mileage is the beginning. The platform is the future.
