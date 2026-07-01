# MilePilot Calm Glow — Design Language (v8.2.0)

Inspired by the PULSE glow philosophy, adapted for MilePilot’s blue brand and AutoPilot calm UX.

## Principle

> Premium, calm, never demanding. Technology disappears; the experience feels human.

MilePilot uses **blue glow** (`#0D6BFF`), not PULSE cyan. Same breathing rhythm, different accent.

## Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--calm-breathe` | 4s | Card/pulse breathing cycle |
| `--calm-glow-min` | 0.22 | Softest glow opacity |
| `--calm-glow-max` | 0.42 | Peak glow opacity |
| `--glass-blur` | 18px | Glass card backdrop |
| `--card-radius` | 20px | Cards, prompts, timeline |
| `--button-radius` | 16px | Buttons, inputs |

## Surfaces

- **Glass cards** — `backdrop-filter` + soft inner highlight + breathing `box-shadow`
- **Ambient glow** — radial gradients on Home, Tracking, Reports, Daily Review
- **End-of-day CTA** — `cc-report-btn` gentle pulse when review is ready

## Motion

| Interaction | Behaviour |
|-------------|-----------|
| Button press | `scale(0.97)` |
| Card tap | `scale(0.985)` |
| Input focus | Blue ring + soft outer glow |
| Screen enter | `screenCalmIn` fade + 4px lift |
| Brand pulse | Glow + subtle `scaleX(1.04)` breathe |
| Hero (review ready) | `calmHeroGlow` on mileage figure |

## Reduced motion

All breathe/pulse animations disabled when `prefers-reduced-motion: reduce`.

## UX alignment with AutoPilot

- No aggressive font weights on primary actions (600, not 1000)
- End-of-day review uses glass timeline cards — calm, not alert-heavy
- Shift end prompt uses glass + breathe — suggests, does not shout
