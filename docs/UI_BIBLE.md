# RankAura UI Bible

**Version:** 1.0  
**Status:** AUTHORITATIVE VISUAL LOCK  
**Source of truth:** Approved screenshot set (uploaded localhost RankAura React/Next UI)  
**Product owner:** Jonathan  

---

## Global lockdown rule

**No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner (Jonathan).**

Cursor / agents may improve implementation quality only (bugs, accessibility wiring, missing assets, performance).  
Never redesign approved UX. Never reinterpret screenshots into a generic SaaS look.

If docs and screenshots disagree → **screenshots win** → update docs.

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
- Minimal uppercase (dashboard labels like `PRIORITY MISSION` only where already shown).
- No dense text blocks.

### Spacing & layout
- Large vertical whitespace; one purpose per screen.
- Centered onboarding content column.
- Prefer spacing over card grids in onboarding.
- Dashboard uses soft rounded white cards on a light canvas with a fixed left sidebar.

### Buttons
- One primary pill / large rounded rectangle per screen.
- Near-black fill, white label.
- Labels in use: **Get Started**, **Continue**, **Review Mission**.
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

## Approved product flow (screenshot-backed)

```
Welcome
→ Website
→ Business Name
→ Business Description
→ Analysis / Setup
→ Dashboard
```

Screens mentioned in older docs but **not present in the current approved screenshot set** (not assumed retired):

- Name (“What should we call you?”)
- Growth Plan Summary
- Launch Growth Plan CTA screen

Only Jonathan may permanently remove or add product screens.

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
| **Purpose** | Final onboarding transition after business info; reassure while setup runs; then enter dashboard |
| **Exact visible copy (component source of truth)** | Eyebrow: **Aura goes to work** · Title: **Setting up {businessName}** (fallback: “your business”) · Step labels: exact `ANALYSIS_STEPS[].label` values from types (do not invent) · Green tick character: **✓** |
| **Layout hierarchy** | No progress bar → eyebrow → title → vertical list of steps with circular ticks |
| **Typography** | Eyebrow small medium muted; title large semibold ink; step labels `text-lg`/`text-xl` medium |
| **Colours** | Incomplete: grey border circle + muted label · Complete: `#2eb88a` fill + white ✓ + ink label · Upcoming further steps dimmed |
| **Spacing** | `mt-6` title; `mt-14`/`sm:mt-16` list; `space-y-5` between rows |
| **Button behaviour** | No CTA — automatic completion then redirect to dashboard |
| **Navigation** | After analysis completes → `/` dashboard (`router.push("/")`) |
| **Responsive** | `text-center sm:text-left` on container |
| **Locked elements** | Wording above, green-tick sequence, layout, styling classes/colours, no spinner redesign |
| **Timing note** | Temporary 15s post-complete delay may exist for screenshot capture only — **must return to original production duration** after capture; not a permanent UX change |

---

## 6. Dashboard

| Field | Spec |
|-------|------|
| **Status** | APPROVED — VISUALLY LOCKED |
| **Screenshot** | `docs/ui-reference/06-dashboard.png` |
| **Route** | `/` |
| **Components** | Dashboard shell / sidebar / brief cards *(implementation files not yet present in this MilePilot workspace overlay — lock from screenshot)* |
| **Purpose** | Calm daily briefing — not a dense SEO admin console |
| **Exact visible copy (from approved screenshot)** | Company: **Northern Materials Co.** · Subtitle: **Industrial Supplies** · Nav: **Dashboard**, **AI Team**, **Growth**, **Content**, **Website**, **Settings** · Greeting: **Good evening Jonathan** · Stats line: **12 improvements today · 2.8 hrs saved** · Card: **Evening Brief** · Label: **PRIORITY MISSION** · Mission title example: **Create Research Storage Conditions Guide** · CTA: **Review Mission** · Section: **Today's Mission** · Support: **The one thing that matters most today** |
| **Layout hierarchy** | Fixed left sidebar (avatar + company + nav) → main canvas → Evening Brief card → Today's Mission card |
| **Typography** | Large greeting; muted stats; small uppercase priority label; bold mission titles |
| **Colours** | White sidebar/cards; light grey canvas; blue active nav; black primary CTA |
| **Spacing** | Soft card radii (~12–16px); generous padding; clear separation between brief and mission |
| **Button behaviour** | **Review Mission** primary action on priority mission |
| **Navigation** | Left nav; Dashboard active state as shown |
| **Responsive** | Preserve sidebar IA on desktop/laptop; do not invent alternate dashboard without approval |
| **Locked elements** | Left navigation, company identity, greeting/daily brief, improvements + time saved, priority mission, Review Mission, Today's Mission, cards, spacing, hierarchy |

---

## Screens not in the current approved screenshot set

These appear in older docs only. **Do not treat as retired** unless Jonathan explicitly says so.

| Screen | Docs copy (historical) | Classification |
|--------|------------------------|----------------|
| Name | What should we call you? | Not present in the current approved screenshot set |
| Growth Plan Summary | We've finished learning about your business. | Not present in the current approved screenshot set |
| Launch Growth Plan | Launch Growth Plan | Not present in the current approved screenshot set |

---

## Implementation quality vs redesign

Allowed without new approval:
- Fix broken logo asset on Welcome (restore correct brand mark — not a new design language)
- Restore missing component files to match locked UI
- Accessibility labels/focus that do not change appearance
- Revert temporary screenshot delay to production timing

Not allowed without written approval:
- New colours, fonts, card systems, nav patterns
- Rewriting locked copy
- Reordering approved onboarding steps
- Dashboard redesign or densification
- Replacing React/Next UI with the HTML prototype look
