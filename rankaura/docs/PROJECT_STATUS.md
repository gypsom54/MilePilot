# RankAura Project Status

**Phase:** Brand direction locked — implementation aligned to `docs/RANKAURA_BRAND.md`  
**Design bible:** `docs/RANKAURA_BRAND.md` (permanent — do not deviate)  
**Simplification roadmap:** `docs/RANKAURA_SIMPLICITY_PLAN.md`

## Brand (locked July 2026)

- **Promise:** We Help Grow Businesses.
- **Logo:** Option 1 RA monogram — white + premium blue gradient, subtle glow, deep navy/white palette (`components/brand/RankAuraLogo.tsx`)
- **Customer philosophy:** Simple, calm, business-growth focused — no SEO overwhelm; AI invisible
- **Screen 1 (onboarding welcome):** Brand implemented — logo, wordmark, tagline, hero, supporting copy, staggered entrance animation
- **No customer-facing:** AI Growth Manager, SEO automation, AI employees terminology

## Phase 1 — Magic Moment onboarding (built — pending brand copy alignment)

- [x] **5-screen onboarding** at `/onboarding` — welcome, website, business name, description, analysis
- [x] **One question per screen** — single input, one button, Apple-like calm layout
- [x] **Analysis sequence** — 6 checkmark steps, then redirect to dashboard
- [x] **Middleware** — first visit redirects `/` → onboarding; cookie on completion

Dashboard, Mission Mode, and Growth Team **unchanged**.

## Mission Mode (prior — pending simplification per constitution)

- [x] **Immersive three-panel layout** — Pipeline · Document · Live Feed
- [x] **7 AI employees** — Scout, Writer, Architect, Guardian, Optimiser, Analyst, Publisher
- [x] **Notion-style document** — Research, Outline, Draft, Images, FAQ, SEO, Internal Links, CTA
- [x] **Live AI Feed** — auto-updating timeline every ~3 seconds
- [x] **Aura AI assistant** — Jarvis-style floating insights with typing animation
- [x] **Premium background** — animated gradients, particles, depth
- [x] **Micro-animations** — pulsing indicators, progress bars, feed entries, entrance morph
- [x] **Dashboard transition** — Review Mission morphs into Mission Mode (no layout changes on dashboard)
- [x] **Cinematic deployment** — Scout → Writer → Guardian → Architect → Publisher → MISSION DEPLOYED
- [x] Tests: `npm run test:aurora`

## Architecture

```
Review Mission (dashboard)
    → MissionModeTransition (session flag + fade)
    → /missions/research-storage-conditions-guide
        → MissionMode
            ├── MissionPipeline (left)
            ├── MissionDocument (centre)
            ├── LiveAIFeed (right)
            ├── AuraAssistant (floating)
            └── MissionModeDeployment (on approve)
```

## Prior sprints (complete)

- Sprint 015: Mission Workspace proper build
- Sprints 001–014: Foundation, Mission Control, briefing primitives

## Known limitations

- Live feed and pipeline are simulated client-side (no real AI)
- Timeline does not sync back to Mission Control dashboard
- Request Changes button is visual only in Mission Mode (not wired)

## How to run

```bash
cd rankaura && npm install && npm run dev
```

- Mission Control: http://localhost:3000
- Mission Mode: http://localhost:3000/missions/research-storage-conditions-guide

Click **Review Mission** for the immersive entrance transition.
