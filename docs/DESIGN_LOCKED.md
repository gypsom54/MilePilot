# MilePilot Design Language — 🔒 LOCKED

**Status:** Frozen as of Phase 2 (June 2026)  
**Rule:** No screen redesigns. New features inherit this system.

---

## Locked elements

| Element | Status | Notes |
|---------|--------|-------|
| Logo & wordmark | 🔒 | Mile **Pilot** + brand pulse |
| Colours | 🔒 | Navy `#031126`, blue `#0D6BFF`, muted `#B9C8DD` |
| Typography | 🔒 | System UI, weight hierarchy in existing screens |
| Onboarding MP-001 → MP-005 | 🔒 | Copy and layout final |
| Command Centre (Dashboard) | 🔒 | Layout frozen; live data updates only |
| Navigation MP-007 | 🔒 | Floating dark bar, 4 tabs |
| Cards | 🔒 | `cc-card`, `.card`, 22–24px radius |
| Buttons | 🔒 | `.premium-btn`, `.cc-primary-btn`, `.btn` |
| Flow | 🔒 | Onboard → Dashboard → Reports / History / Settings |

---

## CSS tokens (do not change)

```css
--bg: #031126
--panel: #0B2348
--blue: #0D6BFF
--muted: #B9C8DD
--card-radius: 24px
--button-radius: 16px
```

---

## Brand lines (see VOICE_GUIDE.md)

- Every business mile matters.
- Now let's make every business mile count.
- Never miss another business mile.
- Your driving business. On auto pilot.

---

## What IS allowed going forward

- **Engine logic** — tracking, reports, intelligence (no layout changes)
- **Copy updates** inside existing components (metrics, insights, toasts)
- **New screens** that reuse `.card`, `.brand-bar`, `.cc-*` patterns exactly
- **Data** — live numbers, PDF content, email bodies

## What is NOT allowed

- Redesigning onboarding, dashboard, or navigation
- New colour palettes or typography systems
- Moving core actions or changing screen structure

---

## Inheritance rule

Every new screen must use:

1. `brand-bar` + wordmark + pulse  
2. Existing card / metric / button classes  
3. Existing spacing (22px padding, 108px nav inset)  
4. Voice from VOICE_GUIDE.md  

This is how products mature.

---

## Vision & platform

Product direction is locked in [VISION_LOCK.md](./VISION_LOCK.md):

- **MilePilot Tracker** — simple mileage + reports (£5.99/mo target)
- **MilePilot Business** — full business companion (£9.99/mo target)
- Business Profile architecture for experience + profession + future fields
- Golden rule for every future feature

All new work must align with the vision lock before implementation.
