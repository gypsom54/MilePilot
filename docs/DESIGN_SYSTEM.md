# RankAura Design System

**Status:** LOCKED — visual consistency authority  
**Owner:** Jonathan  
**Related:** `docs/DESIGN_TOKENS.md` · `docs/UI_BIBLE.md` · `docs/PRODUCT_GUARDRAILS.md` · `docs/ASK_RANKAURA_SPEC.md`  
**Implementation:** `rankaura-web/app/globals.css` · `rankaura-web/tailwind.config.js` · `rankaura-web/components/ui/`

---

## Locked principles

1. **Calm does not mean visually weak. RankAura components must remain restrained while still being clearly defined, interactive and intentional.**

2. **Every button, badge, input and interactive control must come from the shared RankAura component system.**

3. **One Primary Button. One Secondary (outlined) Button. One Badge. One Input. One Card. Reuse them everywhere. No Ask RankAura exceptions. Suggested questions use ButtonSecondary — not a unique pill.**

4. Borders provide most of the structure. Shadows stay minimal.

5. Do not invent one-off greys, radii, or control styles inside screens.
6. If two components perform the same job, they MUST use the same styling — not similar, the same component.

---

## Colour tokens

| Token | Value | Usage |
|-------|-------|--------|
| `--ra-primary` / `--ra-ink` | `#0B0F19` | Primary button background, primary text |
| `--ra-primary-fg` | `#FFFFFF` | Primary button label |
| `--ra-primary-hover` | `#161C28` | Primary hover |
| `--ra-surface` | `#FFFFFF` | Cards, inputs, chips |
| `--ra-surface-subtle` | `#F7F8FA` | Subtle surfaces, hover fills |
| `--ra-canvas` | `#F3F5F7` | Page background |
| `--ra-border` | `#C5CDD8` | **Standard border** — subtle but clearly visible |
| `--ra-border-strong` | `#9AA5B5` | Hover / interactive stronger border |
| `--ra-ink-soft` | `#3D4654` | Secondary text |
| `--ra-muted` | `#6B7585` | Muted labels (stronger than washed grey) |
| `--ra-placeholder` | `#8B95A5` | Placeholder text |
| `--ra-accent` | `#3B6FD4` | Text actions / blue accent |
| `--ra-focus` | `#5B8DEF` | Focus ring |
| `--ra-success` | `#177A56` | Success / completed badge text |
| `--ra-success-soft` | `#E6F6EF` | Success badge background |
| `--ra-success-border` | `#9DD4BC` | Success badge border |
| `--ra-warning` | `#9A5B0A` | Waiting / approval text |
| `--ra-warning-soft` | `#FFF4E5` | Waiting badge background |
| `--ra-warning-border` | `#E2C08A` | Waiting badge border |
| `--ra-info` | `#2F5FBE` | Prepared / info badge text |
| `--ra-info-soft` | `#EAF0FF` | Info badge background |
| `--ra-info-border` | `#B0C4F0` | Info badge border |
| `--ra-neutral` | `#3F4A5A` | Monitoring text |
| `--ra-neutral-soft` | `#EEF1F5` | Monitoring background |
| `--ra-disabled-bg` | `#E8ECF1` | Intentional disabled primary fill |
| `--ra-disabled-fg` | `#8B95A5` | Disabled label |

---

## Border rules

- Thickness: **1px** everywhere
- Standard (`--ra-border`) on cards, inputs, chips, secondary buttons, badges
- Strong (`--ra-border-strong`) on hover / pressed interactive controls
- Avoid blue borders on every control
- Do not invent Ask-only or screen-only border treatments

---

## Radius

| Token | Value | Usage |
|-------|-------|--------|
| `--ra-radius-sm` | `8px` | Compact badges may still use pill |
| `--ra-radius-md` | `12px` | Buttons, inputs |
| `--ra-radius-lg` | `14px` | Reserved (do not invent Ask-only uses) |
| `--ra-radius-xl` | `16px` | Primary cards |
| `--ra-radius-full` | `9999px` | Status badges only |

---

## Shadow

| Token | Value | Usage |
|-------|-------|--------|
| `--ra-shadow` | `0 1px 2px rgba(11,15,25,0.05), 0 6px 18px rgba(11,15,25,0.06)` | Cards |
| `--ra-shadow-focus` | `0 0 0 3px rgba(91,141,239,0.22)` | Reserved token — **not** used on inputs (inputs use a single blue border) |

Inputs, badges, and chips: **no default shadow** — borders define structure.

---

## Components

### ButtonPrimary
Solid `--ra-primary`, white text, height 44px, radius md, semibold.  
Hover: `--ra-primary-hover`. Active: slight press.  
Disabled: `--ra-disabled-bg` + `--ra-disabled-fg` (intentional, not unfinished grey opacity).

### ButtonSecondary
White surface, visible `--ra-border`, dark label, same height/radius.  
Hover: subtle fill + `--ra-border-strong`.

### ButtonGhost / text
Accent blue, semibold, underline on hover. No pill.

### Badge
Shared height (28px), padding, pill radius, medium weight, tinted fill + matching visible border + stronger text.

### TextInput / Input
White, visible border, no default shadow, dark text, placeholder token.  
Hover: stronger border.  
**Focus: ONE treatment only** — a single blue border (`--ra-focus`).  
Never a blue glow + blue border. Never outline + border. Never two concentric strokes.  
Implementation: shared `.ra-input` / `Input` component only.  
Disabled: subtle fill + muted text.

### QuestionButton / QuestionChip
**Alias of ButtonSecondary** (the outlined button). Same height, radius, border, typography, hover, focus, disabled. Layout-only helpers allowed (`w-full`, `text-left`) for multi-line suggested questions. Not a separate visual style.

### Card / SurfaceCard
White, standard border, xl radius, shared shadow, consistent padding (`p-5 sm:p-6`).  
Ask RankAura, Biggest Opportunity, Recent Wins, Growth Areas, and Recent Progress all use this same card. No accent variants. No Ask-only borders, dividers, or callout boxes.

---

## Interaction states (required)

Every interactive control defines: default · hover · focus-visible · active/pressed · disabled.

Buttons / links: focus-visible uses a single 2px outline + offset (`--ra-focus`).  
Inputs: focus uses **one** treatment only — a single blue border. Never glow + border, never outline + border.

---

## Ask RankAura compliance

- Placeholder: **Ask about your business…**
- Empty input → Ask button uses intentional **disabled** tokens (`ButtonPrimary`)
- Valid input → Ask button switches to solid primary black immediately (`ButtonPrimary`)
- Suggested questions → `ButtonSecondary` (same outlined button as View Progress / Open Strategy)
- Card → shared `SurfaceCard` (same border, radius, shadow, padding as peer Workspace cards)
- Section heading → same as Since last visit / Recent progress (`text-lg font-semibold text-ra-ink`)
- Desktop: input + Ask side by side, equal height
- Mobile: stacked full-width controls
- **Zero Ask-specific visual styles** (no unique borders, callout boxes, radii, or typography)

---

## Do not

- Invent greys inside components
- Use washed-out outline-only badges
- Use bright saturated badge colours
- Use heavy Material shadows
- Use neon glows or gradients
- Move layout or add features during visual passes

---

**End of Design System.**
