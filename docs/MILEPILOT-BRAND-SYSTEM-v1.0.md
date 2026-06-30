# MilePilot Brand System v1.0

**Status:** 🔒 Canonical — June 2026  
**Audience:** Design, development, marketing, PDF/email, App Store, video  
**Rule:** If a screen does not use this system, it is not MilePilot.

---

## Why this exists

The website felt like *a good website for a company called MilePilot*.  
It did not feel like **MilePilot**.

That happens when each section is designed independently. Apple, Stripe, Notion, and Linear do not win on “good pages” — they win because **every screen follows the same visual rules**.

This document is that rulebook.  
**Stop building pages. Start applying the system.**

---

## 1. Brand DNA

### Emotion

| We are | We are never |
|--------|----------------|
| Calm | Busy |
| Professional | Loud |
| Confident | Generic |
| Premium | SaaS-template |
| Intelligent | Technical / GPS-jargon |

### What MilePilot is NOT (visually)

- Blue as decoration  
- GPS as marketing  
- Mileage as the headline  
- Tracking as the hero  

### What MilePilot IS (the visual stack)

```
Dark Navy
    ↓
Blue Pulse          ← signature (our Nike tick)
    ↓
Premium Maps
    ↓
AutoPilot           ← product inside the product
    ↓
Clean Cards
    ↓
Minimal Copy
    ↓
Confidence
    ↓
Calm
```

Every asset must climb this stack — never skip to “features” without the foundation.

---

## 2. Core brand message

### Hierarchy (locked)

| Level | Copy | Role |
|-------|------|------|
| **Primary** | Stop thinking about mileage. | The hook. First line people remember. |
| **Secondary** | Your business.<br>On AutoPilot. | The emotional centre. Brand moment. |
| **Supporting** | Background mileage for self-employed professionals. | Context only — never the hero. |
| **Legacy** | Drive • Track • Claim | Retired from hero. PDF footer / transitional only. |

### Application rule

Every platform reinforces **Primary → Secondary**.  
Website hero moment, app welcome, email header, PDF band, App Store subtitle, video outro — same two lines, same order of importance.

---

## 3. Design tokens

**Canonical file:** [`docs/brand/tokens.css`](./brand/tokens.css)

### Colour

| Token | Hex | Use |
|-------|-----|-----|
| Navy | `#031126` | Primary background, brand surfaces |
| Navy soft | `#0A2854` | Gradient tops, depth |
| Panel | `#0B2348` | Cards, elevated surfaces |
| Map | `#0B1B36` | Map canvas |
| Blue | `#0D6BFF` | Accent, pulse, routes, CTAs |
| Muted | `#B9C8DD` | Secondary text on dark |
| Green | `#20D781` | Route start, success |
| Amber | `#F0C35A` | Pending review |

### Typography

- **Family:** System UI stack only (`--mp-font`)
- **Wordmark:** Weight 700, letter-spacing `-0.04em`, **Mile** white + **Pilot** blue
- **Headlines:** 700, tight tracking, few words
- **Body:** 15–16px, weight 400–500, max 2 lines per block on marketing
- **Labels:** 10–11px, uppercase, letter-spacing `0.08em`, blue-muted

### Spacing & shape

- Card radius: **24px**
- Inner card / map: **18px**
- Button radius: **16px**
- Screen padding: **22px** horizontal, **108px** bottom (nav clearance)
- Section gaps: **48–148px** — when in doubt, add air

### Motion

- Ease: `cubic-bezier(0.22, 1, 0.36, 1)`
- Always respect `prefers-reduced-motion`
- Motion must communicate **movement** or **intelligence** — never decoration

---

## 4. Signature element: The Blue Pulse

**The Blue Pulse is MilePilot’s signature mark** — our Nike tick, our Tesla charging ring.

It is **not optional**. It appears on every major touchpoint.

### Spec

| Property | Value |
|----------|-------|
| Height | 2px |
| Shape | Full-width gradient bar OR 8px GPS dot with glow |
| Gradient | `#0A52D4 → #0D6BFF → #7EC0FF → #0D6BFF → #0A52D4` |
| Glow | `0 0 18px rgba(13,107,255,0.42)` |
| Alive loop | 4s ease-in-out (`brandPulseGlow` / GPS 2s) |

### Where it MUST appear

- [ ] App: brand bar, maps, loading, AutoPilot status
- [ ] Website: hero moment, logo proximity, maps, primary CTAs (subtle)
- [ ] PDF: header band
- [ ] Email: header rule or logo area
- [ ] Notifications: icon accent or left border pulse
- [ ] App Store: screenshot accents, icon glow
- [ ] Video: logo reveal, map scenes

### GPS pulse (live state)

8px dot, `#0D6BFF`, shadow `0 0 10px rgba(13,107,255,0.55)`, 2s opacity pulse.  
Used when **AutoPilot Active** or location is live.

### Do not

- Use pulse as a logo underline (retired)
- Place pulse without navy/dark context
- Animate pulse frantically or bounce

---

## 5. Signature element: The Route Line

**Replace all decorative dividers with journey.**

| Use | Don’t use |
|-----|-----------|
| Animated blue route SVG | Squiggly lines |
| Route between sections | Generic horizontal rules |
| Map route in phone/PDF | Meaningless wave graphics |
| Start dot (green) + end dot (blue) | Stock illustration paths |

### Spec

- Stroke: `#0D6BFF`, 2–3px, round caps
- Animation: `stroke-dashoffset` draw, 3.5–8s, infinite or on-scroll once
- Glow: `drop-shadow(0 0 6px rgba(13,107,255,0.75))`
- Map grid: subtle `rgba(110,180,255,0.1)` lines on `#0B1B36`

Every divider should feel like **part of a journey**.

---

## 6. Signature element: AutoPilot

**AutoPilot is a product inside the product.** Same everywhere.

### Locked copy

| State | Label | Meta (optional) |
|-------|-------|-----------------|
| Live | **AutoPilot Active** | GPS locked |
| Waiting | GPS waiting | Enable location to track |
| Review | Pending review | {n} journeys |

### Visual

- GPS pulse dot (left of label)
- Same font size/weight in app, website phone, email status line
- Navy chip background: `rgba(13,107,255,0.1)` border `rgba(13,107,255,0.22)`

### Platforms

Website phone · App dashboard · PDF header · Email preheader · Push notifications · App Store caption

**Wording, icon, colour — identical. No variations.**

---

## 7. Logo rules

The logo is **not** styled text. It has rules.

### Wordmark

```
Mile Pilot
^^^^      ^^^^^
white     #0D6BFF
```

- Weight: **700**
- Letter-spacing: **-0.04em**
- Never stretch, skew, or outline
- **Never underline** (no pulse bar under wordmark on marketing — pulse sits *nearby*, not attached)

### Placement

| Rule | Value |
|------|-------|
| Background | **Dark navy only** for primary lockup |
| Clear space above | ≥ 24px |
| Clear space below (to tagline) | 10px |
| Pulse proximity | Within 16px vertically — glow association, not underline |
| Min size (digital) | 17px app header, 20px nav, 34px welcome |

### Don’t

- Logo on light grey without navy band
- Logo without pulse nearby on hero/brand moments
- “MilePilot” as one word
- Raster logo scaled blurry — use CSS/SVG wordmark

---

## 8. The hero visual (THE moment)

This is the **one screen people remember**. Not a webpage layout — a **brand film still**.

### Composition

```
┌─────────────────────────────────────┐
│  DARK NAVY (#031126)                │
│                                     │
│     ○ ○ ○  radar rings (subtle)     │
│        ●  GPS pulse dot             │
│     ~~~~~~~~ route drawing ~~~~     │
│                                     │
│     Your business.                  │
│     On AutoPilot.                   │
│                                     │
│  (optional: phone enters after)     │
└─────────────────────────────────────┘
```

### Sequence (website / video / App Store)

1. Dark screen  
2. Blue pulse expands (radar)  
3. Route line draws  
4. GPS dot moves along route  
5. Headline fades in: **Your business. On AutoPilot.**  
6. Supporting line (optional): *While you're working, MilePilot is quietly recording your day.*

**This is the hero.** Not a split layout with stock copy. The moment can sit above or behind the phone — but the pulse + route + headline are non-negotiable.

---

## 9. The phone (hero prop)

The phone must look like: **“I’ve just unlocked my phone.”**  
Not: **“A designer mocked up an app.”**

### Required UI (real components, real data)

| Element | Spec |
|---------|------|
| Status | AutoPilot Active + GPS pulse |
| Hero metric | TODAY · {miles} · Business miles |
| Journeys | Count + driving time |
| Map | London-style streets, live route, pulse on position |
| Pending | Review card with real trip times |
| Next report | Schedule chip (e.g. Sun 6pm) |
| Notification | “{n} journeys ready to review” |
| Nav | App bottom bar (4 tabs) |

### Data rules

- Use plausible numbers (24.6 mi, 4h 12m, £13.53)
- Real street names (Camden, City, Westminster)
- Real timestamps (09:14, 14:05)
- Animate: count-up miles, route draw, map pan, notification slide-in

### Don’t

- Placeholder grey boxes
- Generic “Lorem” trips
- Phone without notification + GPS row
- Carousel of fake screens — one **live session**

---

## 10. Component library

All components use tokens from `tokens.css`. Full specs: [COMPONENT-SPECS.md](./brand/COMPONENT-SPECS.md).

| Component | Class / pattern | Platforms |
|-----------|-----------------|-----------|
| Brand bar | `brand-bar` + wordmark + tagline | App, website phone |
| Card | `cc-card` / `mp-card` | App, website, PDF blocks |
| Metric hero | `cc-hero` / TODAY + large number | App, website phone |
| Metrics grid | 2×2, tabular nums | App, reports |
| GPS row | dot + label + meta | App, website, email |
| Map card | `#0B1B36` + route + pulse | App, website, PDF thumb |
| Primary button | blue gradient + pulse edge on marketing | All |
| Trust card | navy card + pulse dot left | Website |
| Report doc | navy band + wordmark + stats table | PDF, website |

**Inheritance rule:** New UI reuses these components — never invent a new card style per page.

---

## 11. Platform application matrix

| Platform | Primary message | Pulse | Route | AutoPilot label | Logo on navy |
|----------|-----------------|-------|-------|-----------------|--------------|
| Native app | Secondary under logo | ✅ | ✅ maps | ✅ | ✅ |
| PWA | Same as app | ✅ | ✅ | ✅ | ✅ |
| Website | Primary hook + hero moment | ✅ | ✅ | ✅ phone | ✅ |
| PDF reports | Secondary in band | ✅ | ✅ thumb | ✅ footer | ✅ |
| Email | Primary subject, Secondary header | ✅ | Optional route header | ✅ status | ✅ |
| Push notification | Short Primary | Dot accent | — | ✅ | — |
| App Store | Secondary + Primary subtitle | ✅ screenshots | ✅ map shots | ✅ | ✅ |
| Marketing video | Hero sequence §8 | ✅ | ✅ | ✅ | ✅ |

Checklist detail: [PLATFORM-CHECKLIST.md](./brand/PLATFORM-CHECKLIST.md).

---

## 12. Copy rules

- **Headlines:** ≤ 8 words
- **Paragraphs:** ≤ 2 lines on marketing
- **No:** GPS, tracking engine, configure, module, initialise
- **Yes:** quietly, automatically, review your day, peace of mind
- **Audience:** Self-employed professionals — not “anyone who drives for work”

### Built for (locked)

**Headline:** Built for the Self-Employed  

**Body:** Whether you're behind the wheel of a taxi, visiting clients, delivering parcels or travelling between jobs, MilePilot keeps track of your business mileage so you don't have to.

---

## 13. What to stop doing

- ❌ Designing website sections one at a time  
- ❌ Decorative squiggles and generic SaaS icons  
- ❌ Pulse as logo underline  
- ❌ “Drive • Track • Claim” as hero  
- ❌ Light hero without navy brand moment  
- ❌ Phone mockups without live session UI  
- ❌ Different AutoPilot wording per platform  

---

## 14. Implementation order

**Phase A — System (this document)** ✅  
Define tokens, signatures, components, platform matrix.

**Phase B — App audit**  
Map every app screen to components. Fix `cc-version` hardcode. Ensure pulse on every major screen.

**Phase C — Website rebuild**  
Apply system only — hero visual §8, phone §9, trust cards, built-for copy. No new section types.

**Phase D — Collateral**  
PDF template, email header, notification format, App Store screenshot grid.

**Phase E — Video**  
90s explainer follows hero sequence.

---

## 15. Relationship to other docs

| Doc | Role |
|-----|------|
| **This file** | Visual identity — how MilePilot *looks* everywhere |
| [MILEPILOT-BIBLE.md](./MILEPILOT-BIBLE.md) | Company constitution — what MilePilot *is* |
| [DESIGN_LOCKED.md](./DESIGN_LOCKED.md) | App screen layout freeze — don’t rearrange MP-001–007 |
| [NO-HARDWARE-PHILOSOPHY.md](./NO-HARDWARE-PHILOSOPHY.md) | Product constraint |
| [marketing/WEBSITE-V1.md](./marketing/WEBSITE-V1.md) | ⚠️ Superseded by Brand System for visual work |

---

## 16. Sign-off criteria

Brand System v1.0 is **applied** when a stranger can:

1. See the website hero moment and say *“That’s the same app on my phone.”*  
2. Point to the blue pulse and associate it with MilePilot without reading the name.  
3. Recite **Stop thinking about mileage** and **Your business. On AutoPilot.** after 5 seconds.  
4. Find the same AutoPilot Active treatment in app, site, and PDF.

Until then: **no new website sections.**

---

*MilePilot Brand System v1.0 — June 2026*  
*Stop thinking about mileage. Your business. On AutoPilot.*
