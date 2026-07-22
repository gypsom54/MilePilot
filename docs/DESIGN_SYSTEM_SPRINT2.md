# Sprint 2 — Premium Visual Language

**Status:** APPROVED AND LOCKED  
**Base version:** v8.43.31  
**Branch:** `cursor/sprint2-premium-visual-19bd`  
**Merged via:** `cursor/merge-approved-visual-shell-19bd`

---

## Scope

Sprint 2 elevates the design system from functional (4/10) to premium (target 9.5/10).

**Changed files (gallery only):**
- `frontend/css/mp-design-system.css` — Sprint 2 premium tokens, depth, motion
- `frontend/js/design-system-preview.js` — expanded gallery with live demos
- `frontend/design-system-preview.html` — title update only

**NOT changed:**
- Production `index.html` (still CSS link only)
- Protected engine, routing, onboarding, tracking, reports
- Any production screen markup

Loading `mp-design-system.css` in production still produces **zero visual change** — all selectors remain scoped under `.mp-ds-root`.

---

## Design philosophy

Calm · Premium · Expensive · Confident · Alive · Intelligent · Friendly

Inspired by Apple Wallet, Linear, Raycast, Stripe — not copied.

---

## Sprint 2 upgrades

### Typography
- Larger display with tighter tracking
- More whitespace between hierarchy levels
- Softer body weights, muted supporting copy

### Colour & depth
- Tonal surface layers (deep → raised → elevated → selected)
- Suspended cards with ambient shadow, edge lighting, internal highlight
- Restrained blue glow on focus and selection

### Buttons
- Hover lift, press compression, focus glow
- Loading, success, selected, disabled states

### Inputs
- Floating labels with animated transition
- Focus glow, error shake, success pulse

### Cards (redesigned)
- Standard, Elevated, Selected, Summary, Information, Action, Success, Warning, Metric

### Conversation
- Assistant fade-rise, typing indicator, streaming text with cursor
- User slide-up with selection glow

### Microinteractions
- Toggle, checkbox, radio, compact selection chips

### Loading
- Intelligent phrase rotation (Preparing, Analysing, Checking…)
- Pulse indicator — no generic spinner

### Empty & success
- Illustration placeholder, helpful next step
- Tick pop animation, gentle glow

### Motion
- All components animate in; `prefers-reduced-motion` respected

---

## Preview access

```bash
npx serve frontend -p 8000
# Open: http://localhost:8000/design-system-preview.html
```

---

## Rollback

```bash
git checkout cursor/sprint1-design-system-19bd
```
