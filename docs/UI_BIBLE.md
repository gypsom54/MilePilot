# RankAura UI Bible

**Version:** 1.1  
**Status:** AUTHORITATIVE VISUAL LOCK (with superseded dashboard IA — see §6)  
**Source of truth:** Approved screenshot set (uploaded localhost RankAura React/Next UI) + Growth Plan Phase 2 decisions  
**Product owner:** Jonathan  
**Growth Plan spec:** `docs/GROWTH_PLAN_SPEC.md`  
**Ask RankAura spec:** `docs/ASK_RANKAURA_SPEC.md`  
**Design tokens:** `docs/DESIGN_TOKENS.md` · `docs/DESIGN_SYSTEM.md`

---

## Global lockdown rule

**No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner (Jonathan).**

Cursor / agents may improve implementation quality only (bugs, accessibility wiring, missing assets, performance).  
Never redesign approved UX. Never reinterpret screenshots into a generic SaaS look.

If docs and screenshots disagree → **screenshots win** → update docs.

**Exception (Jonathan, Phase 1 audit approved):** The old dashboard **information architecture** (Mission language, Analysis → Dashboard) is **superseded**. Visual DNA from `06-dashboard.png` remains a reference for spacing, typography, card softness, calm layout, and blue accents — not for Mission IA.

---

## Design authority

| Source | Authority |
|--------|-----------|
| Approved screenshots in `docs/ui-reference/` | **Primary** |
| Existing React/Next onboarding + dashboard implementation | **Primary implementation** |
| `rankaura/docs/*` product docs | Secondary — must be updated to match screenshots |
| `rankaura/` HTML SPA prototype | **Not authority** — discard as visual reference |

---

## Global visual system (from approved screenshots)

### Colours
| Role | Value (approx from screenshots / code) | Usage |
|------|----------------------------------------|--------|
| Ink / primary text | `#080f1a` | Headings, completed labels, primary buttons |
| Muted text | `#8b95a5` | Eyebrows, placeholders, incomplete steps |
| Soft border | `#e5e7eb` | Incomplete tick rings, subtle lines |
| Page background | `#FFFFFF` / near-white | Onboarding full bleed white |
| Dashboard canvas | Light grey behind white cards | Main content area |
| Primary button | Near-black / deep navy (`#080f1a` family) | Get Started, Continue, Review Mission |
| Accent (nav active) | Soft electric blue wash | Active dashboard nav item |
| Success tick | `#2eb88a` | Analysis green check circles |

### Typography
- Clean modern **sans-serif** (implementation typeface already in the React app — do not swap).
- Large, bold/semibold headings (`text-3xl`–`text-5xl` range in onboarding).
- Comfortable muted body / support copy.
- Minimal uppercase. Do **not** introduce Mission-style labels (`PRIORITY MISSION`, etc.) on new surfaces.
- No dense text blocks.

### Spacing & layout
- Large vertical whitespace; one purpose per screen.
- Centered onboarding content column.
- Prefer spacing over card grids in onboarding.
- Dashboard uses soft rounded white cards on a light canvas with a fixed left sidebar.

### Buttons
- One primary pill / large rounded rectangle per screen.
- Near-black fill, white label.
- Labels in use: **Get Started**, **Continue**; Growth Plan: **Continue to Workspace**.
- Do not use **Review Mission** on new surfaces (superseded).
- Disabled when required field empty (onboarding).

### Inputs
- Onboarding single-line: **underline-only** (no heavy box).
- Description: rounded bordered textarea (as in screenshot).
- Placeholders calm and example-led.

### Motion
- Calm transitions only.
- Analysis: sequential green ticks (`onboarding-check`), soft opacity for upcoming steps.
- No confetti, bounce, or aggressive glow.

### Responsive
- Onboarding: centered column; `sm:` left-align allowed for analysis list (existing component).
- Dashboard: sidebar + main; preserve hierarchy on laptop/desktop; do not invent a new mobile IA without approval.

---

## Approved product flow (LOCKED)

```
Welcome
→ What should we call you?
→ Nice to meet you (one-time)
→ Website URL
→ Business name
→ Business description
→ Business and website analysis
→ Growth Plan OR Launch Plan
→ Main Workspace
```

**Hard rule:** Do not send users directly from Analysis into the old Mission dashboard.

**Personalisation:** Customer first name only at key moments. Prefer business name elsewhere.  
**Placeholders:** Neutral only (`Enter your business name`, `https://yourwebsite.co.uk`, `Tell us about your business...`). No demo industries or sample businesses.

Growth Plan / Launch Plan specification: `docs/GROWTH_PLAN_SPEC.md`.  
Canonical app: `rankaura-web/` (`/onboarding`, `/growth-plan`).

---

# Screen locks

## 1. Welcome

| Field | Spec |
|-------|------|
| **Status** | APPROVED — VISUALLY LOCKED |
| **Screenshot** | `docs/ui-reference/01-welcome.png` |
| **Route** | `/onboarding` (step `welcome`) |
| **Components** | `OnboardingWelcome` (referenced), orchestrated by `components/onboarding/OnboardingFlow.tsx` |
| **Purpose** | Brand entry; start onboarding |
| **Exact visible copy** | Headline: **We Help Grow Businesses.** · Support: *RankAura quietly improves your online presence while you focus on running your business.* · CTA: **Get Started** · Brand lockup: RankAura — We Help Grow Businesses. |
| **Layout hierarchy** | Top brand/logo row → large centered headline → short support → bottom primary CTA |
| **Typography** | Large bold sans headline; smaller muted support; compact brand line |
| **Colours** | White/near-white ground; black/ink headline; grey support; near-black CTA |
| **Spacing** | Generous vertical whitespace; CTA anchored low |
| **Button behaviour** | Single CTA **Get Started** → advances to Website step |
| **Navigation** | No back; no secondary actions |
| **Responsive** | Centered stack; preserve whitespace on mobile/desktop |
| **Locked elements** | Headline, support copy, CTA label, white minimal composition, single CTA |

---

## 2. Website

| Field | Spec |
|-------|------|
| **Status** | APPROVED — VISUALLY LOCKED |
| **Screenshot** | `docs/ui-reference/02-website.png` |
| **Route** | `/onboarding` (step `website`) |
| **Components** | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` |
| **Purpose** | Capture business website |
| **Exact visible copy** | Heading: **What's your website?** · Placeholder example: `www.portsmouthhypnotherapy.co.uk` · CTA: **Continue** |
| **Layout hierarchy** | Segmented progress (top) → large question → underline input → Continue |
| **Typography** | Large semibold ink heading; light grey placeholder |
| **Colours** | White ground; ink heading; grey placeholder/progress idle; black progress active + CTA |
| **Spacing** | Centered; ample space between heading, input, CTA |
| **Button behaviour** | Continue disabled until website non-empty → Business Name |
| **Navigation** | Progress segments indicate onboarding position |
| **Responsive** | Same hierarchy; maintain underline input style |
| **Locked elements** | Heading copy, underline input style, Continue CTA, progress treatment, whitespace |

---

## 3. Business name

| Field | Spec |
|-------|------|
| **Status** | APPROVED — VISUALLY LOCKED |
| **Screenshot** | `docs/ui-reference/03-business-name.png` |
| **Route** | `/onboarding` (step `business-name`) |
| **Components** | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` |
| **Purpose** | Capture business name |
| **Exact visible copy** | Heading: **Business name** · Placeholder example: `Portsmouth Hypnotherapy` · CTA: **Continue** |
| **Layout hierarchy** | Progress → heading → underline input → Continue |
| **Typography** | Large ink heading; muted placeholder |
| **Colours** | Same onboarding system as Website |
| **Spacing** | Identical onboarding rhythm |
| **Button behaviour** | Continue disabled until name non-empty → Business Description |
| **Navigation** | Progress advances |
| **Responsive** | Preserve centered minimal form |
| **Locked elements** | Heading “Business name”, underline field, Continue, progress, spacing |

---

## 4. Business description

| Field | Spec |
|-------|------|
| **Status** | APPROVED — VISUALLY LOCKED |
| **Screenshot** | `docs/ui-reference/04-business-description.png` |
| **Route** | `/onboarding` (step `business-description`) |
| **Components** | `OnboardingFlow`, `OnboardingShell`, `OnboardingTextarea`, `OnboardingPrimaryButton` |
| **Purpose** | Capture plain-language business description |
| **Exact visible copy** | Heading: **Tell Aura about your business** · CTA: **Continue** · Placeholder (implementation): hypnotherapy example sentence in `OnboardingFlow` |
| **Layout hierarchy** | Progress → heading → rounded textarea → Continue |
| **Typography** | Large ink heading; regular body in textarea |
| **Colours** | White ground; thin dark textarea border; near-black CTA |
| **Spacing** | Generous; textarea is the sole input focus |
| **Button behaviour** | Continue disabled until description non-empty → Analysis / Setup |
| **Navigation** | Final form step before analysis |
| **Responsive** | Preserve large textarea + one CTA |
| **Locked elements** | Heading wording (“Tell Aura about your business”), single textarea, Continue, progress, minimal chrome |

---

## 5. Analysis / Setup

| Field | Spec |
|-------|------|
| **Status** | APPROVED — VISUALLY LOCKED |
| **Screenshot** | `docs/ui-reference/05-analysis-setup.png` *(binary slot — capture after green ticks complete)* |
| **Route** | `/onboarding` (step `analysis`) |
| **Components** | `OnboardingFlow` (`AnalysisStep`), `OnboardingShell` (`showProgress={false}`), `OnboardingAnalysis`, `ANALYSIS_STEPS` from `@/types/onboarding`, `simulateAnalysis` from onboarding service |
| **Purpose** | Final onboarding transition after business info; reassure while setup runs; then enter Growth Plan / Launch Plan |
| **Exact visible copy (component source of truth)** | Eyebrow: **Aura goes to work** · Title: **Setting up {businessName}** (fallback: “your business”) · Step labels: exact `ANALYSIS_STEPS[].label` values from types (do not invent) · Green tick character: **✓** |
| **Layout hierarchy** | No progress bar → eyebrow → title → vertical list of steps with circular ticks |
| **Typography** | Eyebrow small medium muted; title large semibold ink; step labels `text-lg`/`text-xl` medium |
| **Colours** | Incomplete: grey border circle + muted label · Complete: `#2eb88a` fill + white ✓ + ink label · Upcoming further steps dimmed |
| **Spacing** | `mt-6` title; `mt-14`/`sm:mt-16` list; `space-y-5` between rows |
| **Button behaviour** | No CTA — automatic completion then redirect to Growth Plan / Launch Plan |
| **Navigation** | After analysis completes → Growth Plan / Launch Plan (**not** the old Mission dashboard). Implementation routing change is Phase 3+ after Growth Plan approval. |
| **Responsive** | `text-center sm:text-left` on container |
| **Locked elements** | Wording above, green-tick sequence, layout, styling classes/colours, no spinner redesign |
| **Timing note** | Temporary 15s post-complete delay may exist for screenshot capture only — **must return to original production duration** after capture; not a permanent UX change |

---

## 6. Legacy dashboard screenshot — VISUAL REFERENCE ONLY (IA SUPERSEDED)

| Field | Spec |
|-------|------|
| **Status** | **IA SUPERSEDED** · visual DNA retained as reference |
| **Screenshot** | `docs/ui-reference/06-dashboard.png` |
| **Route (legacy)** | `/` |
| **Authority change** | Jonathan Phase 1 audit approval — old dashboard information architecture is **no longer visually or structurally locked** |
| **May still reference for** | Spacing · typography · card softness · layout quality · controlled blue accents · calm premium light composition |
| **Explicitly superseded (do not preserve as product IA)** | Priority Mission · Today’s Mission · Review Mission · Mission-based language · AI employee supervision framing · Direct Analysis → Dashboard routing · Existing dashboard content hierarchy |
| **Theme note** | Keep calm **light** workspace for Growth Plan / first Workspace rebuild. Do **not** convert the whole product to dark navy without screenshot approval. Dark navy may appear selectively in nav / brand accents / premium moments. |
| **Replacement surfaces** | Growth Plan / Launch Plan (`docs/GROWTH_PLAN_SPEC.md`) → Main Workspace (spec after Growth Plan approval) |

Historical screenshot copy (for archaeology only — not to rebuild):

> Northern Materials Co. · Evening Brief · PRIORITY MISSION · Review Mission · Today’s Mission · AI Team nav, etc.

---

## 7. Growth Plan / Launch Plan (IMPLEMENTED — awaiting screenshot approval)

| Field | Spec |
|-------|------|
| **Status** | **IMPLEMENTED** (Phase 3) · screenshots captured · awaiting Jonathan visual approval |
| **Spec** | `docs/GROWTH_PLAN_SPEC.md` |
| **Route** | `/growth-plan` · `?site=existing` \| `?site=new` · optional `?expand=<categoryId>` |
| **App** | `rankaura-web/app/growth-plan/page.tsx` |
| **Components** | `GrowthPlanPage`, `GrowthPlanHeader`, `AnalysisConfirmation`, `PrimaryOpportunityCard`, `WhatHappensNext`, `FeaturedCategories`, `CategoryList`, `GrowthCategoryCard`, `CategoryExpandedContent`, `ContinueToWorkspace` |
| **Purpose** | Most important post-analysis page; confirm understanding; one primary opportunity; relevance-ordered categories; continue to Workspace |
| **Exact titles** | Existing: **Your Growth Plan is Ready** · New: **Your Launch Plan is Ready** |
| **Page hierarchy** | Header → analysis confirmation → primary opportunity → What happens next → featured categories → remaining categories → Continue to Workspace |
| **Categories** | All 13 locked; relevance-ordered; Reddit & Community Research first-class |
| **Visual** | Calm light workspace + premium blue/navy accents; not a dark SaaS conversion |
| **Screenshots** | `docs/ui-reference/growth-plan/07-*.png` … `13-*.png` |
| **Handoff** | Continue to Workspace → `/workspace` |

---

## 8. Workspace home (IMPLEMENTED — final polish awaiting review)

| Field | Spec |
|-------|------|
| **Status** | **FINAL POLISH** · architecture approved · awaiting Jonathan review |
| **Spec** | `docs/WORKSPACE_SPEC.md` |
| **Route** | `/workspace` |
| **App** | `rankaura-web/app/workspace/page.tsx` |
| **Purpose** | Ongoing RankAura home — “what has RankAura done since I was last here?” |
| **Page hierarchy** | Greeting → Ask RankAura → Biggest Opportunity → Recent Wins → Since Your Last Visit → Growth Areas → Recent Progress |
| **Planned (Phase B)** | Ask RankAura card — **PROTOTYPE BUILT** · see `docs/ASK_RANKAURA_SPEC.md` |
| **Visual** | Calm light workspace DNA (same family as Growth Plan); no Mission IA, KPI walls, charts, SEO scores, or AI employee cards |
| **Screenshots** | `docs/ui-reference/workspace/01-*.png` … `07-*.png` |

**Locked principles:**

1. RankAura should never make customers feel like they have more work to do. It should make them feel like less work needs to be done because RankAura is already doing it.
2. Every time a customer opens RankAura, they should immediately feel that their business is in a better position than it was the last time they looked.

2. Every time a customer opens RankAura, they should immediately feel that their business is in a better position than it was the last time they looked.

---

## 9. Ask RankAura (PROTOTYPE BUILT — PENDING SCREENSHOT APPROVAL)

| Field | Spec |
|-------|------|
| **Status** | **PROTOTYPE BUILT — PENDING SCREENSHOT APPROVAL** |
| **Spec** | `docs/ASK_RANKAURA_SPEC.md` |
| **Route** | `/workspace` (card inserted beneath Greeting) |
| **App** | `rankaura-web/components/ask-rankaura/` · `rankaura-web/services/askRankAura/` |
| **Purpose** | Primary conversational interface · eventual front door to RankAura · trusted business growth adviser |
| **Workspace position** | Greeting → **Ask RankAura** → Biggest Opportunity → Recent Wins → Since Your Last Visit → Growth Areas → Recent Progress |
| **Default UI** | Heading **Ask RankAura** · support **Ask anything about your business growth.** · input · max 4 suggested questions |
| **After submit** | Expandable focused answer panel — one active answer; no chat history thread |
| **Trust** | Answers grounded in RankAura mock data only; never invent rankings, traffic, reviews, or completed work |
| **Screenshots** | `docs/ui-reference/ask-rankaura/` |

**Not allowed:** floating support bubble · generic chatbot · AI avatars · voice mode · huge empty chat pane · autonomous live actions · live LLM

---

## Screens not in the current approved screenshot set

| Screen | Classification |
|--------|----------------|
| Name (“What should we call you?”) | Not present in the current approved screenshot set (implemented in onboarding) |

---

## Implementation quality vs redesign

Allowed without new approval:
- Fix broken logo asset on Welcome (restore correct brand mark — not a new design language)
- Restore missing component files to match locked onboarding UI
- Accessibility labels/focus that do not change appearance
- Revert temporary screenshot delay to production timing

Not allowed without written approval:
- New colours, fonts, or a full dark-theme conversion
- Rewriting locked onboarding copy
- Reordering approved onboarding steps (except Analysis **exit** destination → Growth Plan, once approved)
- Reintroducing Mission IA because it appears in `06-dashboard.png`
- Replacing React/Next UI with the HTML prototype look
- Redesigning the approved Workspace hierarchy or adding dashboard sections (Ask RankAura insertion requires spec approval first — see `docs/ASK_RANKAURA_SPEC.md`)
- Changing Growth Plan hierarchy or category system without updating the spec first
