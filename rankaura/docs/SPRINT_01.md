# Sprint 1 — Onboarding Lockdown

## Objective
Preserve and harden the approved onboarding so it remains one continuous premium conversation.

This is not a rebuild.

Use the existing React/Next repository, routes, screens and components as the starting point.  
Approved screenshots are the visual source of truth (`docs/UI_BIBLE.md`).

## Non-Negotiables
- Do not start from scratch.
- Review existing onboarding first.
- Preserve approved screens.
- One question per screen.
- One purpose per screen.
- One CTA per screen.
- Large typography.
- Generous whitespace.
- Subtle motion.
- Existing brand direction from screenshots.
- No dashboard redesign.
- No unrelated features.
- No SEO jargon in the main experience.
- No feature creep.
- No approved screen may be visually redesigned without explicit written approval from Jonathan.

## Approved flow (screenshot-backed)
1. Welcome
2. Website
3. Business name
4. Business description
5. Analysis / Setup
6. Dashboard

## Not present in the current approved screenshot set
(Do not treat as retired without Jonathan’s decision.)

- Name
- Growth Plan Summary
- Launch Growth Plan screen

## Analysis / Setup
Preserve existing component wording and green-tick progression exactly:

- Eyebrow: **Aura goes to work**
- Title: **Setting up {businessName}**
- Step labels: exact `ANALYSIS_STEPS` values
- Styling: green `#2eb88a` ticks, muted incomplete states

Do not use a generic spinner redesign.

After screenshot capture, restore the original production redirect duration.  
Do not leave temporary long delays in production.

## Dashboard
Preserve the approved dashboard screenshot (visually locked), including left navigation, company identity, greeting/daily brief, improvements, time saved, priority mission, Review Mission, Today's Mission, cards, spacing and hierarchy.

## Data Requirements
- Preserve information between steps.
- Support back navigation where already implemented.
- Prevent duplicate submissions.
- Handle invalid domains calmly.
- Handle analysis failure with retry if already part of product.
- Respect reduced motion.
- Do not claim analysis is complete until it is complete.
- Clearly label demo data if the real engine is not connected.

## Definition of Done
- Existing onboarding reviewed first.
- Approved screens preserved and documented in UI Bible / lock register.
- Full screenshot-backed flow works.
- Mobile and desktop work.
- Form state retained.
- Analysis feels calm and premium.
- Temporary screenshot delay reverted to production timing.
- No dashboard redesign.
- No unrelated features.
- Build passes.
- Stop and wait for approval.
