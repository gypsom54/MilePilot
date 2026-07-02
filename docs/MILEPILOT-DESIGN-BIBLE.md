# MilePilot Design Bible

**Status:** Canonical — June 2026  
**Audience:** Cursor agents, designers, developers  
**Rule:** Before shipping any new screen, modal, card, or copy block — **check it against this document.**

> **Design philosophy:** If it doesn't make the decision easier, it probably doesn't need to be there.

**Related docs (do not duplicate — reference):**
- Product constitution: [MILEPILOT-BIBLE.md](./MILEPILOT-BIBLE.md)
- Visual tokens & signature elements: [MILEPILOT-BRAND-SYSTEM-v1.0.md](./MILEPILOT-BRAND-SYSTEM-v1.0.md)
- CSS tokens: [brand/tokens.css](./brand/tokens.css)
- Component code refs: [brand/COMPONENT-SPECS.md](./brand/COMPONENT-SPECS.md)
- Frozen screens: [DESIGN_LOCKED.md](./DESIGN_LOCKED.md), [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md)

---

## Pre-ship checklist (agents)

Use this for **every** new or changed UI surface:

- [ ] **3-second test:** User knows what this screen is and what to do next
- [ ] **One primary action** — no competing CTAs at equal weight
- [ ] **Benefit-first copy** — not feature lists or GPS jargon
- [ ] **Less text** — every line earns its place
- [ ] **Brand bar** or approved screen pattern reused (no one-off layouts)
- [ ] **Tokens only** — colours, radius, type from `tokens.css` / existing CSS vars
- [ ] **Blue pulse** present on brand moments where appropriate
- [ ] **AutoPilot** named consistently (not “tracking engine”, “GPS mode”, etc.)
- [ ] **Safe area** respected on iOS (`env(safe-area-inset-*)`)
- [ ] **Reduced motion** honoured (`prefers-reduced-motion`)
- [ ] **Tracker vs Business** — Tracker users never overwhelmed
- [ ] **AI suggests, never decides** — user confirms classifications

---

## 1. Brand principles

### North star

> **Your business. On AutoPilot.**

We sell **peace of mind** and **less admin** — not GPS, not mileage spreadsheets, not technical accuracy bragging.

### Emotional register

| We are | We are never |
|--------|----------------|
| Calm | Busy |
| Confident | Hesitant |
| Premium | Template SaaS |
| Intelligent | Technical |
| Effortless | Cluttered |
| Professional | Loud / hypey |

### Visual stack (build bottom-up)

```
Dark navy foundation
    ↓
Blue pulse (signature)
    ↓
Premium maps / routes (when relevant)
    ↓
AutoPilot (product inside the product)
    ↓
Clean cards
    ↓
Minimal copy
    ↓
Confidence
```

Do not skip to feature bullets without the calm foundation.

### Product principles (gate every feature)

1. Does this make running a small business **easier**?
2. Does it **reduce admin** (not add it)?
3. Does it feel **calm** within 3 seconds?
4. Can Tracker users stay **uncluttered**?
5. Does it reinforce **Your business. On AutoPilot.**?

If any answer is **no** — rethink.

### No hardware — ever

Never imply beacons, tags, dongles, or accessories.  
**Install → enable permissions → drive normally.**

---

## 2. UI rules

### Screen structure

Every app screen should follow an existing pattern:

| Pattern | Use for |
|---------|---------|
| `brand-bar` + wordmark + pulse + tagline | Onboarding, headers |
| `.cc-screen` / Command Centre | Dashboard, live shift |
| `.card` / `.cc-card` | Grouped content |
| `.knowYou-*` / `.onboard-*` | Onboarding steps |
| `.mode-card` | Binary or few choices (e.g. AutoPilot vs Manual) |
| Floating `.nav` | Main app tabs only |

**Inheritance rule:** New screens reuse existing classes. Do not invent parallel component systems.

### Layout

| Rule | Value |
|------|-------|
| Max content width | `min(430px, 100vw)` inside `.app` |
| Horizontal padding | 22–24px |
| Bottom padding (with nav) | 108px |
| Bottom padding (onboarding) | `max(24px, env(safe-area-inset-bottom))` |
| Card gap | 14–16px |
| Section breathing room | When in doubt, add air — never cram |

### Hierarchy

1. **One headline** — what decision or status is this?
2. **One line of support** — optional, removes fear or adds context
3. **Content** — cards, metrics, map
4. **One primary button** — fixed foot on onboarding flows

### Selection screens (e.g. tracking mode)

- **Recommended option** gets blue border, badge, and visual dominance
- Secondary option stays premium but quieter (no competing highlight)
- **No bullet checklists** unless they clearly shorten the decision (default: avoid)
- Short body + short footer line beats paragraphs

### iOS / native

- `viewport-fit=cover` + safe-area insets on all full-screen flows
- Web shell and native `SafeAreaView` background must match screen navy (`#020B1B` welcome, `#031126` app default)
- No logo clipping under status bar / Dynamic Island

### Maps

- Canvas: `#0B1B36`
- Route: `#0D6BFF`, round caps, subtle glow
- Live dot: 8px blue pulse — not static pins for “active”

---

## 3. Copywriting rules

### Hierarchy (locked)

| Level | Copy | Role |
|-------|------|------|
| Primary hook | Stop thinking about mileage. | Marketing memory line |
| Brand centre | Your business. On AutoPilot. | Emotional core |
| Supporting | Background mileage for self-employed professionals. | Context only — never hero |

### Voice

| Do | Don't |
|----|-------|
| Short sentences | Paragraphs |
| Benefit-first | Feature dumps |
| Plain English | GPS / SDK / engine jargon |
| “Your reports are ready” | “Configure reporting module” |
| Reassure (“change anytime in Settings”) | Create lock-in anxiety |
| UK spelling for UK users | American tax terms unless relevant |

### Length

- **Onboarding beat:** under ~15 words per line where possible
- **Card body:** 1–2 lines maximum
- **Card footer:** 1 line — who is this for?
- **Headings:** ask the decision in plain language (“How would you like to track your business mileage?”)

### AutoPilot copy (locked labels)

| Context | Copy |
|---------|------|
| Product name | **AutoPilot** (one word, capital P) |
| Live status | **AutoPilot Active** |
| Mode card | 🚀 AutoPilot — “Drive normally.” |
| Manual mode | ✋ Manual Tracking |
| Tagline | Your business. On AutoPilot. |

Never: “GPS mode”, “background tracker”, “automatic classification engine”.

### Examples

- ✅ “Automatically records journeys and prepares your reports.”
- ❌ “Uses background GPS with stop detection and MIE classification.”

- ✅ “Best for less admin.”
- ❌ “Best if you want mileage handled with minimal effort and reduced cognitive load.”

---

## 4. Colours

**Canonical file:** `docs/brand/tokens.css`

| Token | Hex | Use |
|-------|-----|-----|
| Navy | `#031126` | App background, theme-color, panels |
| Navy deep | `#020B1B` | Welcome / uniform onboarding surfaces |
| Navy soft | `#0A2854` | Gradient tops |
| Panel | `#0B2348` | Elevated cards |
| Map | `#0B1B36` | Map canvas |
| Blue | `#0D6BFF` | Accent, pulse, routes, primary actions |
| Blue bright | `#1E88FF` | Button gradient top |
| Muted | `#B9C8DD` | Secondary text on dark |
| Muted dim | `rgba(147,168,196,.88)` | Supporting copy |
| Green | `#20D781` | Success, route start |
| Amber | `#F0C35A` | Pending review |
| Red | `#EF3333` | Destructive only |

### Colour rules

- **Dark navy only** for primary brand surfaces — no random greys
- **One accent** — MilePilot blue; no rainbow UI
- **No banding** — avoid stacked gradients + glow overlays on the same screen; prefer single rich navy when cleaner
- **OLED test:** neighbouring sections must not use near-miss navies (e.g. `#07182F` vs `#081C36`) — pick one token

---

## 5. Typography

**Family:** System UI only — `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Wordmark | 34–42px | 700 | Mile white + Pilot `#0D6BFF`, tracking `-0.04em` |
| Screen greeting | `clamp(27px, 6.8vw, 32px)` | 700 | One per screen |
| Welcome headline | `clamp(34px, 8.6vw, 42px)` | 700 | MP-001 only |
| Body / support | 15–16px | 500 | `rgba(159,180,208,.88)` |
| Card title | 18px | 700 | |
| Card body | 13–14px | 400–500 | Muted |
| Labels / steps | 11px | 600 | Uppercase, `letter-spacing: .08em` |
| Tagline | 11px | 600 | `letter-spacing: .12em`, blue-muted |

**Rules:** No custom fonts. No all-caps body text. No more than two weights fighting on one card.

---

## 6. Button styles

**Primary (`.premium-btn.is-ready` / `.btn`)**

| Property | Value |
|----------|-------|
| Height | 52px |
| Radius | 16px (`--button-radius`) |
| Background | `linear-gradient(180deg, #1E88FF, #0D6BFF, #005FE8)` |
| Shadow | `0 8px 24–28px rgba(13,107,255,.28)` |
| Label | 17px, weight 600, sentence case |

**Disabled / waiting**

- Muted navy gradient, no glow, `cursor: not-allowed`
- Clear enabled transition when form valid

**Secondary**

- `.btn.outline` — transparent, blue border, no shadow
- Never place outline primary **beside** filled primary at equal size

**Rules**

- **One primary button per screen** in onboarding and modals
- Press state: `scale(0.985)` — subtle, never bouncy
- Labels are verbs: Continue, Enable AutoPilot, Review journeys — not “Submit” or “OK”

---

## 7. Card styles

### Standard card (`.card`, `.cc-card`)

| Property | Value |
|----------|-------|
| Background | `linear-gradient(180deg, rgba(255,255,255,.06), rgba(13,107,255,.02))` |
| Border | `1px solid rgba(110,180,255,.14–.18)` |
| Radius | 24px (18px inner) |
| Padding | 20px 18px |
| Shadow | Soft + inset top highlight |

### Mode card (`.mode-card`) — onboarding choices

| Variant | Treatment |
|---------|-----------|
| Recommended | Blue border, glow, **Recommended** badge |
| Selected | Stronger blue ring + fill |
| Secondary | Slightly brighter than background but no badge |

**Content order:** Badge (if any) → icon + title → 1–2 line body → 1 line footer  
**No** long bullet lists by default.

### Vehicle card (`.vehicle-card`) — locked on `#knowYou`

Do not redesign — see [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md).

---

## 8. Tone of voice

### Personality

MilePilot speaks like a **calm professional assistant** — competent, warm, never chatty.

- Confident, not salesy
- Helpful, not patronising
- Brief, not blunt
- Smart, not showy

### Words we use

- AutoPilot, business miles, journeys, reports, review, less admin, HMRC-ready
- Drive normally, ready when you are, change anytime

### Words we avoid

- GPS engine, geofence, SDK, algorithm, machine learning (user-facing)
- Sync, configure, initialise, module, pipeline
- Exclamation overload!!!
- “Most common”, “best in class”, startup hype

---

## 9. Animation rules

**Ease:** `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-premium`)

| Animation | Duration | Use |
|-----------|----------|-----|
| Brand pulse glow | 4s | Logo proximity, signature bar |
| GPS dot pulse | 2s | Live tracking |
| Screen in | 0.38–0.45s | App tab transitions |
| Button press | 0.24s | scale 0.985 |
| Onboarding reveal | 0.5–0.7s stagger | Welcome intro only |

### Rules

- Motion communicates **movement** or **intelligence** — not decoration
- Always provide `@media (prefers-reduced-motion: reduce)` fallbacks
- No bounce, shake, or parallax on core flows
- Count-up metrics: optional, 1.4s max, ease-out

---

## 10. AI personality (MIE & review)

The MilePilot Intelligence Engine is a **quiet assistant behind the glass** — not a chatbot character.

### Principles

| Rule | Meaning |
|------|---------|
| **Suggest, never decide** | AI proposes business/personal; user confirms |
| **Explain in plain English** | “You’ve classified this route 4 times as business” — not confidence scores |
| **Learn from corrections** | User overrides improve future suggestions |
| **No guilt** | Never scold for personal trips or missed reviews |
| **No jargon** | No “model”, “inference”, “cluster” in UI |

### Review screen tone

- ✅ “3 journeys to review — about 30 seconds.”
- ❌ “MIE detected 3 unclassified trajectory segments.”

### Future AI surfaces

- One suggestion at a time
- Always show **why** in one short line
- Always offer **undo / change**

Full architecture: [MIE-ARCHITECTURE.md](./MIE-ARCHITECTURE.md)

---

## 11. Things we never do

### Visual

- ❌ Cluttered screens with bullets, badges, and buttons competing for attention
- ❌ Multiple primary buttons at equal weight
- ❌ New colour palettes or fonts per screen
- ❌ Light-mode onboarding (dark navy is the brand)
- ❌ Stock illustration clutter
- ❌ Decorative dividers — use route lines or space instead
- ❌ Logo underline pulse (retired pattern)
- ❌ Near-miss background colours creating OLED banding

### Copy

- ❌ Technical jargon (GPS, SDK, engine, sync)
- ❌ Long paragraphs on onboarding
- ❌ Feature checklists when a single line suffices
- ❌ Fear-based permission copy (“we need access or the app won’t work”)
- ❌ American spelling in UK HMRC context (unless localised)

### Product

- ❌ Hardware upsells or pairing flows
- ❌ Silent AI changes to mileage records
- ❌ Forcing Business features on Tracker users
- ❌ Reports before review complete (business-only policy)
- ❌ Redesigning locked screens without explicit approval

### Engineering (UI work)

- ❌ Inline styles for colours outside tokens
- ❌ One-off CSS component systems
- ❌ Breaking safe-area on iOS for visual tightness
- ❌ Removing accessibility labels for icon-only controls

---

## 12. Screen-by-screen standards

| Screen | User question answered | Primary action | Max copy density |
|--------|------------------------|----------------|------------------|
| Welcome | What is MilePilot? | Get Started | Minimal |
| Know You | What’s your name & vehicle? | Continue | Low (locked) |
| Tracking Mode | How do I want to track? | Continue | Low — cards only |
| Permissions | Can it work in background? | Enable AutoPilot | Short |
| Dashboard | How’s my business today? | Start shift | Metrics first |
| Tracking | Am I recording? | End shift | Live data |
| Review | Anything to confirm? | Swipe classify | One journey at a time |
| Reports | Where’s my proof? | View / share | Document tone |

---

## 13. When you add a new screen

1. **Read this bible** and [COMPONENT-SPECS.md](./brand/COMPONENT-SPECS.md)
2. **Copy** the closest existing screen HTML/CSS — do not start from blank
3. **Draft copy** aloud — if it sounds like a GPS app, rewrite
4. **Count elements** — if more than one primary CTA, cut
5. **Screenshot** iPhone 14 Pro + safe-area check
6. **Run** `node scripts/verify-welcome-background.js` or equivalent if full-screen
7. **Confirm** locked screens untouched unless bug fix

---

## 14. Changelog

| Date | Change |
|------|--------|
| 2026-06-29 | Design Bible v1.0 — consolidated from Brand System, Bible, onboarding learnings |

---

*Less text. More confidence. Your business. On AutoPilot.*
