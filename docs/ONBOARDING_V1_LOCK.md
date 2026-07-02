# Onboarding v1.0 — Permanently Locked

**Status:** Approved — locked 2026-06-29  
**Screen:** `#knowYou` (MP-002) — name + vehicle selection  
**Marker:** `data-onboard-lock="v1.0"` on `#knowYou` in `frontend/index.html`

## Policy

**Do not modify the elements below unless a bug is reported.**  
No polish passes, copy tweaks, spacing nudges, or visual experiments on this screen.

## Locked elements (approved)

| Element | Scope | Key selectors / markup |
| --- | --- | --- |
| **Logo** | Wordmark, pulse, tagline | `#knowYou .brand-bar.onboard-brand` |
| **Header** | Greeting + supporting copy | `.knowYou-greeting`, `.knowYou-support`, `.knowYou-section-title` |
| **Progress bar** | Track height, fill, label | `.onboard-progress`, `.onboard-progress-track` (5px), `#onboardProgressName` |
| **Name field** | Input wrap + field styling | `#knowYou .welcome-input-wrap`, `#knowYou .onboard-name-input` |
| **Name icon** | Silhouette size, alignment, SVG | `#knowYou .welcome-input-icon` (16px, flex-centred) |
| **Vehicle layout** | Cards, icons, copy, grid | `#knowYou #onboardVehicleGrid` and scoped vehicle rules |
| **Overall spacing** | Margins, padding, scroll layout | `#knowYou` scoped spacing (logo −12px, section gaps, foot) |
| **Bottom helper text** | Reassurance line | `#knowYou .knowYou-reassure` — “You can always change this later.” |

## Also locked (same screen)

- Vehicle selection copy (Car / Van / Motorcycle titles + descriptions)
- HMRC helper line: “Used to calculate your HMRC mileage.”
- Continue button disabled/enabled **visual** states (logic may change for bugs only)

## Out of scope (future work — not onboarding redesign)

- Background tracking reliability
- Permission flow (`#nativeAlwaysModal`, Open Settings)
- AI journey classification
- Intelligence Engine
