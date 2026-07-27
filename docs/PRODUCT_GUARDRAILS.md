# RankAura Product Guardrails

**Status:** FINAL AUTHORITY for future development  
**Owner:** Jonathan  
**Related locks:** `docs/UI_BIBLE.md` · `docs/SCREEN_LOCK_STATUS.md` · `docs/GROWTH_PLAN_SPEC.md` · `docs/WORKSPACE_SPEC.md` · `docs/ASK_RANKAURA_SPEC.md` · `docs/DESIGN_TOKENS.md` · `docs/DESIGN_SYSTEM.md` · `docs/ui-reference/` · `rankaura/docs/PRODUCT_VISION.md`

This document governs every future RankAura change.  
If a proposal conflicts with these guardrails, the proposal loses.

---

## Product rules

1. **RankAura is an AI Growth Manager, not an SEO dashboard.**

2. **Simplicity always wins over feature quantity.**

3. **Every screen must answer:**  
   “Does this help a business owner grow their business?”

4. **If a feature requires SEO knowledge to understand, redesign the wording instead of teaching SEO.**

5. **Premium, calm and trustworthy always take priority over flashy.**

6. **Existing approved screenshots remain the visual source of truth until replaced by newer approved screenshots.**  
   Exception: legacy Mission dashboard IA in `06-dashboard.png` is superseded; keep only its light visual DNA as reference (`docs/SCREEN_LOCK_STATUS.md`).

7. **New functionality should fit naturally into the existing interface rather than creating new sections unnecessarily.**

8. **Cursor should always prefer extending existing components over creating duplicate components.**

9. **Every new feature must feel like it has always belonged in RankAura.**

10. **Before implementing any UI change, verify it does not conflict with:**
    - `docs/UI_BIBLE.md`
    - `docs/SCREEN_LOCK_STATUS.md`
    - `docs/GROWTH_PLAN_SPEC.md` (for Growth Plan / Launch Plan / category system)
    - `docs/WORKSPACE_SPEC.md` (for Workspace)
    - `docs/ASK_RANKAURA_SPEC.md` (for Ask RankAura)
    - `docs/DESIGN_TOKENS.md` (for colours, controls, and reusable UI)
    - `rankaura/docs/PRODUCT_VISION.md` (and `docs/` copies where present)
    - `docs/PRODUCT_GUARDRAILS.md`

---

## Workspace principles (LOCKED)

1. **RankAura should never make customers feel like they have more work to do. It should make them feel like less work needs to be done because RankAura is already doing it.**

2. **Every time a customer opens RankAura, they should immediately feel that their business is in a better position than it was the last time they looked.**

3. Growth Plan = what we discovered · Workspace = what we’ve done since last visit · Reports (future) = what impact the work had.

4. Workspace homepage must remain understandable in under 30 seconds — no scores, graphs, Mission language, AI employee cards, or KPI walls.

## Ask RankAura principles (LOCKED)

**Ask RankAura is the primary interface for interacting with RankAura. It is not a chatbot. It is the customer's trusted business growth adviser. Every future feature should be designed so it can be discovered, understood or launched through Ask RankAura using natural language. Navigation and buttons remain available, but conversation is the preferred interface whenever practical.**

Ask RankAura is a **permanent core feature**, not a secondary chatbot or support bubble.

1. Ask RankAura should feel like **checking in with a trusted business growth adviser** — not opening a generic AI chatbot.
2. Answers must be grounded in the customer’s **own RankAura data** (Growth Plan, Workspace activity, connected sources). **Never invent** rankings, traffic, reviews, competitor activity, completed work, opportunities, recommendations, or results.
3. When data is unavailable, say so clearly and explain what is missing or what RankAura will monitor once connected.
4. Ask RankAura sits **beneath the Workspace greeting** (Phase B) — compact by default; no huge chat window; no floating bubble; no avatars or AI employee characters.
5. Spec: `docs/ASK_RANKAURA_SPEC.md`. **Status: PROTOTYPE BUILT — PENDING SCREENSHOT APPROVAL.** Do not connect live AI until approved.

## Design system (LOCKED)

Official tokens and reusable controls live in `docs/DESIGN_SYSTEM.md`, `docs/DESIGN_TOKENS.md`, and `rankaura-web/components/ui/`.

1. **Calm does not mean visually weak. RankAura components must remain restrained while still being clearly defined, interactive and intentional.**
2. **Every button, badge, input and interactive control must come from the shared RankAura component system.**
3. **One Primary Button · One Secondary (outlined) Button · One Badge · One Input · One Card.** Reuse everywhere. No Ask RankAura exceptions. Suggested questions use `ButtonSecondary` — not a unique pill.
4. Every new screen must reuse design tokens — do not invent one-off greys, radii, shadows, or button styles.
5. Primary actions share one solid ink button (`ButtonPrimary`) with an intentional disabled state (`--ra-disabled-bg` / `--ra-disabled-fg`). Secondary / outlined actions use bordered white (`ButtonSecondary`). Text actions use accent links (`ButtonGhost`).
6. Badges share one anatomy; tinted fill + clearly visible matching border + stronger text. Only colour changes by variant.
7. Ask RankAura input uses the shared `Input` and placeholder **Ask about your business…**. Ask heading/padding/card chrome must match peer Workspace section cards.
8. Borders must be subtle but clearly visible (`--ra-border`); interactive hover uses `--ra-border-strong`.
9. If covering the text with your hand, you must not be able to tell which Workspace section a control came from. Zero Ask-specific visual styles.

## First-use flow (LOCKED)

```text
Welcome → Name → Nice to meet you → Website URL → Business name → Business description
  → Analysis → Growth Plan OR Launch Plan → Main Workspace
```

- Do **not** route Analysis directly into the legacy dashboard.
- Growth Plan / Launch Plan is the most important post-analysis page.
- Spec: `docs/GROWTH_PLAN_SPEC.md`.

### Personalisation (LOCKED)

- Capture the customer’s first name early.
- Use it sparingly: “Nice to meet you, {name}.” · “{name}, your Growth Plan is ready.” · Workspace greeting (“Good morning, {name}.”).
- Prefer the **business name** for ongoing strategy identity.
- No demo business names, example industries, or pre-filled sample text in onboarding fields.

---

## Language (LOCKED for new surfaces)

**Prefer:** Opportunity · Recommended next step · Worth your attention · Work completed · Planned next · Waiting for approval · Growth Plan / Launch Plan · Workspace · Ask RankAura  

**Do not use:** Mission · Priority Mission · Today’s Mission · Review Mission · Quest · Level · AI employee supervision / productivity framing · Generic chatbot framing (“How can I help you today?”) on Ask RankAura  

---

## Visual direction (current phase)

- Preserve the calm **light** workspace (white cards, light canvas, premium blue/navy accents).
- Do **not** convert the whole product to a dark navy dashboard without screenshot approval.
- Dark navy may appear selectively in navigation, brand accents, and premium moments.
- Structure and emotional clarity beat theme experimentation.

---

## Category system (LOCKED)

All 13 RankAura growth categories must exist, including **Reddit & Community Research** as first-class.  
Categories are relevance-ordered — never presented as 13 equal cards.  
Details: `docs/GROWTH_PLAN_SPEC.md`.

---

## Visual lockdown

No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner (Jonathan).

Screenshots in `docs/ui-reference/` win over documentation when they disagree — **except** where Jonathan has explicitly superseded IA (legacy Mission dashboard).  
Update docs to match screenshots — never redesign the UI to match outdated docs.

The standalone HTML prototype under `rankaura/` is not a visual reference.

---

## Permanent development workflow

Work **one objective at a time**. Never implement multiple major features in one iteration.

```text
Audit
  ↓
Single feature proposal
  ↓
Implement one feature
  ↓
Run checks
  ↓
Screenshot
  ↓
Approval
  ↓
Lock
  ↓
Move to the next feature
```

### For every change
1. State the single objective.
2. List the exact files you will touch.
3. Make the smallest safe change.
4. Run the relevant checks.
5. Report what changed.
6. Stop for approval before beginning another screen or feature.

### Forbidden by default
- Broad refactors
- Speculative improvements
- Features outside the current roadmap sprint
- Modifying multiple approved screens at once
- Creating parallel/duplicate UI systems
- Coding Growth Plan / Workspace / Ask RankAura / theme conversion before the relevant phase is approved
- Reintroducing Mission IA because it appears in an older screenshot

---

## Quick pre-flight checklist

Before coding:

- [ ] Does this help a business owner grow without making them work harder?
- [ ] Can a non-SEO owner understand it immediately?
- [ ] Does it extend an existing component/screen instead of inventing a new area?
- [ ] Does it conflict with UI Bible / Screen Lock / Growth Plan Spec / Workspace Spec / Ask RankAura Spec / Vision / these Guardrails?
- [ ] Does the first-use flow still end Analysis → Growth/Launch Plan → Workspace?
- [ ] Is this a single feature, ready for screenshot + approval + lock?
