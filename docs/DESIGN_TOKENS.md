# RankAura Design Tokens

**Status:** LOCKED — official design system for RankAura UI  
**Owner:** Jonathan  
**Authority:** Applies to Workspace, Ask RankAura, Growth Plan, and all future screens  
**Related:** `docs/UI_BIBLE.md` · `docs/PRODUCT_GUARDRAILS.md` · `docs/ASK_RANKAURA_SPEC.md`

Every new RankAura screen must be built from these tokens.  
Do **not** invent one-off colours, radii, shadows, borders, or control styles.

Implementation: CSS variables in `rankaura-web/app/globals.css` · Tailwind theme in `rankaura-web/tailwind.config.js` · reusable components in `rankaura-web/components/ui/`

---

## 1. Colour

| Token | Value | Usage |
|-------|-------|--------|
| `--ra-ink` | `#0B0F19` | Primary text, primary buttons |
| `--ra-ink-soft` | `#3D4654` | Secondary body text |
| `--ra-muted` | `#8B95A5` | Placeholders, supporting labels |
| `--ra-canvas` | `#F3F5F7` | Page background |
| `--ra-surface` | `#FFFFFF` | Cards, inputs |
| `--ra-border` | `#D8DEE7` | **One border colour only** |
| `--ra-border-strong` | `#B8C0CC` | Hover borders on secondary controls |
| `--ra-accent` | `#3B6FD4` | Text links, accents |
| `--ra-accent-soft` | `#EEF3FF` | Accent wash / badge tint |
| `--ra-focus` | `#5B8DEF` | Focus rings |
| `--ra-success` | `#1F8A62` | Success text |
| `--ra-success-soft` | `#E8F8F1` | Success badge tint |
| `--ra-warning` | `#A16207` | Waiting / approval text |
| `--ra-warning-soft` | `#FFF6E8` | Waiting badge tint |
| `--ra-info` | `#3B6FD4` | Info / prepared text |
| `--ra-info-soft` | `#EEF3FF` | Info badge tint |
| `--ra-neutral` | `#4B5563` | Monitoring / connected text |
| `--ra-neutral-soft` | `#F1F4F8` | Neutral badge tint |

---

## 2. Radius

| Token | Value | Usage |
|-------|-------|--------|
| `--ra-radius-sm` | `8px` | Small chips, tight controls |
| `--ra-radius-md` | `12px` | Buttons, badges, inputs |
| `--ra-radius-lg` | `16px` | Cards, panels |
| `--ra-radius-full` | `9999px` | Optional pill shape for badges only |

Buttons and inputs use **medium (12px)** — not fully rounded pills.  
Cards use **large (16px)**.

---

## 3. Shadow

One premium shadow for elevated surfaces:

| Token | Value |
|-------|--------|
| `--ra-shadow` | `0 1px 2px rgba(11, 15, 25, 0.04), 0 4px 16px rgba(11, 15, 25, 0.06)` |

Use for cards and focused inputs. No multi-layer glow. No Material-style elevation stack.

---

## 4. Spacing

Prefer the existing Tailwind spacing scale. Common control paddings:

| Control | Padding |
|---------|---------|
| Primary / secondary button | `px-5` · height `44px` (`h-11`) |
| Badge | `px-2.5 py-1` |
| Input | `px-4` · height `44px` |
| Question chip | `px-3.5 py-2.5` |
| Card | `p-5` / `p-6` |

---

## 5. Typography

| Role | Weight | Notes |
|------|--------|--------|
| Titles | Bold / semibold (`font-semibold`–`font-bold`) | Section and card headings |
| Subtitles | Regular | Supporting sentences |
| Buttons | Semibold (`font-semibold`) | Primary + secondary |
| Badges | Medium (`font-medium`) | Status labels |
| Inputs | Regular | Body-sized |
| Text buttons | Semibold | Accent colour, no pill |

---

## 6. Buttons

### Primary — `ButtonPrimary`

- Solid `--ra-ink` (`#0B0F19`)
- White text
- Radius medium (12px)
- Height 44px
- Semibold
- Hover: slight brighten / lift via opacity or background `#161C28`
- Disabled: 40% opacity (still ink, not grey fill)
- Used for: Ask · Review & Fix · Approve · Continue · Connect · Save

### Secondary — `ButtonSecondary`

- White background
- 1px `--ra-border`
- Dark ink text
- Hover: light grey background (`--ra-neutral-soft`) + border darkens to `--ra-border-strong`
- Used for: View Progress · View Research · Open Strategy · Cancel · Ask another question

### Ghost / text — `ButtonGhost`

- Simple accent text (`--ra-accent`)
- No pill, no unnecessary border
- Underline on hover
- Used for: View full Growth Plan · Learn more · Open report · timeline actions

---

## 7. Badges

One reusable `Badge` component. Same height, radius, typography, padding. Only colour changes.

| Variant | Background | Border | Text |
|---------|------------|--------|------|
| `approval` | `--ra-warning-soft` | warning tint border | `--ra-warning` |
| `prepared` | `--ra-info-soft` | info tint border | `--ra-info` |
| `completed` | `--ra-success-soft` | success tint border | `--ra-success` |
| `monitoring` | `--ra-neutral-soft` | `--ra-border` | `--ra-neutral` |
| `connected` | `--ra-success-soft` | success tint border | `--ra-success` |
| `waiting` | `--ra-warning-soft` | warning tint border | `--ra-warning` |
| `info` | `--ra-info-soft` | info tint border | `--ra-info` |

Always include a **clear 1px border** — no washed-out outline-only greys.

---

## 8. Inputs

- White background (`--ra-surface`)
- Clear 1px `--ra-border`
- Slight `--ra-shadow`
- Radius medium
- Height 44px
- Focus: border `--ra-focus` + focus ring
- Placeholder invites conversation

Ask RankAura placeholder (locked):

> Ask about your business…

---

## 9. Ask RankAura control

Preferred pattern (**Option A**):

- Full-width white input
- Adjacent / below solid black primary button labelled **Ask** (or **Ask RankAura** where space allows)
- Same primary button component as Review & Fix

Do not use a soft grey “disabled-looking” Ask button when idle — keep ink primary; disable via opacity only when the field is empty.

---

## 10. Reusable components

| Component | Path |
|-----------|------|
| `ButtonPrimary` | `components/ui/ButtonPrimary.tsx` |
| `ButtonSecondary` | `components/ui/ButtonSecondary.tsx` |
| `ButtonGhost` | `components/ui/ButtonGhost.tsx` |
| `Badge` | `components/ui/Badge.tsx` |
| `Input` | `components/ui/Input.tsx` |
| `QuestionChip` | `components/ui/QuestionChip.tsx` |
| `SurfaceCard` | `components/ui/SurfaceCard.tsx` |
| `TimelineItem` | `components/ui/TimelineItem.tsx` |
| `GrowthCard` | `components/ui/GrowthCard.tsx` |
| `RecommendationCard` | `components/ui/RecommendationCard.tsx` |

Extend these. Do not duplicate styling in page components.

---

## 11. Hard rules

1. One border colour token (`--ra-border`) for default borders.  
2. One shadow token (`--ra-shadow`).  
3. One primary button style.  
4. One badge anatomy (height / radius / type / padding).  
5. No arbitrary greys for interactive fills.  
6. No layout redesign when applying tokens — visual refinement only.  
7. Ask RankAura must feel like the same premium product as Biggest Opportunity, Growth Areas, and Recent Progress.

---

**End of Design Tokens.**
