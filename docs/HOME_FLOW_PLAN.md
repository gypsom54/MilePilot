# MilePilot — Home Flow & Business Hub Plan

**Status:** 📋 PLAN ONLY — not yet implemented. Requires explicit approval before any build.
**Governed by:** [PRODUCT_VISION_MASTER.md](./PRODUCT_VISION_MASTER.md)

> This document plans the next home/dashboard flow, pricing structure, and
> onboarding. **No code changes are authorised by this document.** The working
> tracking engine is locked — see [TRACKING_ENGINE_LOCKDOWN.md](./TRACKING_ENGINE_LOCKDOWN.md).
> Business Hub implementation is **not** approved yet.

---

## 1. Home screen structure

Three simple choices, built on the existing calm navy/electric-blue language.

```
┌───────────────────────────────────────────┐
│  Today summary / current tracking status   │   ← top (existing hero)
├─────────────────────┬─────────────────────┤
│    Auto Track       │    Manual Track      │   ← two equal cards side by side
├─────────────────────┴─────────────────────┤
│           BUSINESS HUB (large)             │   ← premium card below
│  Mileage • Expenses • Receipts • Tax •     │
│  Accountant Pack        [Explore →]        │
└───────────────────────────────────────────┘
```

- **Auto Track** and **Manual Track**: two equal cards, side by side.
- **Business Hub**: larger premium card below — the future centre of the product.

### Preserve
The existing tracking status surfaces (mode badge, AutoPilot status bar, live
timer) are **locked** (MP-HOME-UI-1). Any new home layout must keep those
working and must not regress the AutoPilot/Manual status behaviour.

---

## 2. Auto Track card

**Purpose:** hands-free tracking.

- Title: **Auto Track**
- Copy: "MilePilot detects driving and records trips automatically."
- Status states: `Ready` · `Tracking` · `Needs permission` · `Idle timer active`

## 3. Manual Track card

**Purpose:** user-controlled tracking.

- Title: **Manual Track**
- Copy: "Start and stop trips yourself when you prefer full control."
- Button: **Start Manual Trip**

## 4. Business Hub card

**Purpose:** premium business admin centre (future).

- Title: **Business Hub**
- Copy: "Receipts, expenses, mileage, tax insights and accountant-ready records in one place."
- CTA: **Explore Business Hub**
- Feature chips: `Receipts` · `Expenses` · `Fuel` · `Tax` · `Reports` · `AI Assistant`

Must feel like the premium future centre — but is **not implemented yet**.

---

## 5. Pricing structure

Keep it dead simple — the difference must be obvious at a glance.

### MilePilot Core — £4.99/month
> Mileage tracking.

- AutoPilot
- Manual tracking
- Background tracking
- PDF reports
- Email reports
- HMRC mileage estimates

### MilePilot Business — £9.99/month
> Full self-employed admin assistant. Everything in Core, plus:

- Business Hub
- AI receipt scanner
- Expense tracking
- Fuel / parking / toll tracking
- AI Assistant
- Business Health Score
- Accountant Pack
- Tax dashboard

**One-line difference:** Core = mileage tracking · Business = full self-employed admin assistant.

> Note: existing `VISION_LOCK.md` referenced Tracker £5.99 / Business £9.99.
> This plan proposes **Core £4.99 / Business £9.99**. Final prices and billing
> integration require explicit approval before any pricing screen is built.

---

## 6. Onboarding flow (keep simple)

Plain language, no technical wording, no overwhelm.

```
1. Welcome
2. Choose tracking style   (Auto / Manual)
3. Permissions             (location, notifications)
4. Report delivery
5. Plan selection          (Core / Business)
6. Start using MilePilot
```

Plain-language explanations to use:

- **AutoPilot:** "AutoPilot can detect driving and record mileage automatically, even when the app is in the background."
- **Manual:** "Manual mode lets you start and stop trips yourself."
- **Business Hub:** "Business Hub helps organise receipts, expenses, tax records and accountant reports."

---

## 7. Design rules (locked language)

- Deep navy background (`#031126`)
- Electric blue glow (`#0D6BFF`)
- Rounded cards, clean typography
- Simple navigation
- Premium but not confusing
- Must stay easy for non-technical self-employed drivers

See [DESIGN_LOCKED.md](./DESIGN_LOCKED.md) and [MILEPILOT-DESIGN-BIBLE.md](./MILEPILOT-DESIGN-BIBLE.md).

---

## 8. Do NOT (until explicitly approved)

- Do not implement the Business Hub.
- Do not build pricing/billing screens.
- Do not alter locked PDFs or email templates.
- Do not break or redesign the locked tracking engine.
- Do not overcomplicate onboarding.

---

## 9. Suggested phasing (one phase, one objective, one approval, one lock)

Per the master vision's principle. Proposed order — each needs its own approval:

1. **Home layout** — introduce Auto Track / Manual Track / Business Hub cards
   (Business Hub card is a teaser that routes to a "coming soon" placeholder).
2. **Onboarding refresh** — the simplified 6-step flow above.
3. **Pricing/plan selection** — Core vs Business (no billing yet).
4. **Business Hub — Organise pillar** — receipts & expenses first (highest admin pain).
5. **AI Bookkeeper** — intelligence layer over captured + organised data.

Nothing in phases 1–5 begins without explicit sign-off for that phase.
