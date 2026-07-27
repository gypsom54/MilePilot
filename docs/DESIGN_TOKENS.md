# RankAura Design Tokens

**Status:** LOCKED — token reference  
**Full system:** `docs/DESIGN_SYSTEM.md` (component rules, states, principles)  
**Owner:** Jonathan  

Implementation: CSS variables in `rankaura-web/app/globals.css` · Tailwind theme in `rankaura-web/tailwind.config.js` · reusable components in `rankaura-web/components/ui/`

Every new RankAura screen must be built from these tokens.  
Do **not** invent one-off colours, radii, shadows, borders, or control styles.

---

## Locked principles

1. **Calm does not mean visually weak. RankAura components must remain restrained while still being clearly defined, interactive and intentional.**
2. **Every button, badge, input and interactive control must come from the shared RankAura component system.**

See `docs/DESIGN_SYSTEM.md` for full component documentation.

---

## Colour

| Token | Value | Usage |
|-------|-------|--------|
| `--ra-primary` / `--ra-ink` | `#0B0F19` | Primary button + primary text |
| `--ra-primary-fg` | `#FFFFFF` | Primary button label |
| `--ra-primary-hover` | `#161C28` | Primary hover |
| `--ra-surface` | `#FFFFFF` | Cards, inputs, chips |
| `--ra-surface-subtle` | `#F7F8FA` | Hover fills |
| `--ra-canvas` | `#F3F5F7` | Page background |
| `--ra-border` | `#C5CDD8` | Standard border (clearly visible) |
| `--ra-border-strong` | `#9AA5B5` | Hover / interactive border |
| `--ra-border-accent` | `#B7C9EE` | Ask RankAura card emphasis only |
| `--ra-ink-soft` | `#3D4654` | Secondary text |
| `--ra-muted` | `#6B7585` | Muted labels |
| `--ra-placeholder` | `#8B95A5` | Placeholder text |
| `--ra-accent` | `#3B6FD4` | Text actions |
| `--ra-focus` | `#5B8DEF` | Focus ring |
| `--ra-success` / soft / border | `#177A56` / `#E6F6EF` / `#9DD4BC` | Completed badges |
| `--ra-warning` / soft / border | `#9A5B0A` / `#FFF4E5` / `#E2C08A` | Approval badges |
| `--ra-info` / soft / border | `#2F5FBE` / `#EAF0FF` / `#B0C4F0` | Prepared badges |
| `--ra-neutral` / soft | `#3F4A5A` / `#EEF1F5` | Monitoring |
| `--ra-disabled-bg` | `#E8ECF1` | Intentional disabled fill |
| `--ra-disabled-fg` | `#8B95A5` | Disabled label |

---

## Radius

| Token | Value | Usage |
|-------|-------|--------|
| `--ra-radius-md` | `12px` | Buttons, inputs |
| `--ra-radius-lg` | `14px` | Question buttons |
| `--ra-radius-xl` | `16px` | Cards |
| `--ra-radius-full` | `9999px` | Status badges only |

---

## Shadow

| Token | Value | Usage |
|-------|-------|--------|
| `--ra-shadow` | subtle dual layer | Cards only |
| `--ra-shadow-focus` | soft blue glow | Focused inputs |

Inputs / badges / chips: no default shadow.

---

## Components

`ButtonPrimary` · `ButtonSecondary` · `ButtonGhost` · `Badge` · `Input` · `QuestionChip` / `QuestionButton` · `SurfaceCard` / `Card` · `TimelineItem` · `GrowthCard` · `RecommendationCard`

Ask placeholder: **Ask about your business…**

---

**End of Design Tokens.**
