# MVP Product Scope — SEO AutoPilot Version One

**Date:** 2026-07-30  
**Authority:** Product planning direction + repository evidence in `docs/CURRENT_STATE_AUDIT.md`  
**Rule:** Smallest credible version that demonstrates the trusted-adviser philosophy — not the full vision.

---

## Guiding definition of MVP

Version One must let a small-business owner:

1. Tell the platform who their business is (plain English).  
2. Land in a calm Home that shows what we know and what happens next.  
3. Read clear education that reduces fear and jargon.  
4. See that work is structured around a few priorities — not hundreds of issues.  

Version One must **not** pretend Ask, Google connections, Ads management, or live ranking guarantees exist before infrastructure and Bible unlocks allow them.

---

## Candidate capability classification

| # | Capability | Classification | Rationale |
| --- | --- | --- | --- |
| 1 | Calm onboarding | **Essential for MVP** | Required to collect Business Growth Profile; BD engine already exists |
| 2 | Business Growth Profile | **Essential for MVP** | Maps to Business Discovery — real backend behaviour available |
| 3 | Minimal home workspace | **Essential for MVP** | One-purpose calm landing; no dashboard clutter |
| 4 | Ask SEO AutoPilot | **Blocked by missing infrastructure / lock** | Volume 3 implementation lock; orchestration not authorised |
| 5 | Business Health overview | **Useful after MVP** | Needs assessment/inference product rules + UI; no Assessment volume yet |
| 6 | Top-three Opportunity Queue | **Useful after MVP** | Opportunity engine is stub only |
| 7 | Growth Timeline | **Useful after MVP** | No timeline engine/UI; can stub *honest* “what we’ll track” later, not fake history |
| 8 | Weekly progress update | **Useful after MVP** | Requires recurring work log + copy system |
| 9 | Monthly business letter | **Useful after MVP** | Same as weekly; higher polish |
| 10 | Plain-English FAQ / Learning Centre | **Essential for MVP** | Static educational content — no integrations required; proves adviser tone |
| 11 | Google Search Console connection | **Blocked by missing infrastructure** | No OAuth/API |
| 12 | Google Analytics connection | **Blocked by missing infrastructure** | No OAuth/API |
| 13 | Google Business Profile connection | **Blocked by missing infrastructure** | No OAuth/API |
| 14 | Optional Google Ads connection | **Future capability** | Also blocked until scopes/compliance confirmed; read-only later |
| 15 | Clear SEO vs paid-ads guidance | **Essential for MVP** (content) | Can ship as Learning Centre education without Ads API |

---

## Version One included scope

### In

1. **Calm onboarding** that collects a Business Growth Profile in plain English.  
2. **Persistence of that profile** via existing Business Discovery engine (in-memory acceptable for Version One demos, with honest limitation noted).  
3. **Minimal Home** with one primary purpose: summarise the business profile, state current focus pillars in customer language, and show clear next steps.  
4. **Learning Centre** with a curated FAQ set covering SEO vs Ads, timescales, approvals, and “how you’ll know progress is happening” — supportive, no guarantees.  
5. **Customer-language UI foundation** (shared tone components: what / why / next).  
6. **Explicit non-claims** on Home: no fake health scores, no invented ranking charts, no mock Google “connected” states.

### Out (Version One)

- Ask SEO AutoPilot as working front door  
- Live Google data connections  
- Google Ads management  
- Opportunity scoring engine UI  
- Weekly/monthly automated letters  
- Dense SEO dashboards, issue floods, neon AI chrome  
- Changes to MilePilot production app  

---

## Customer-facing pillars (Version One language)

Use these five pillars only as **plain-English framing** on Home and Learning Centre — not as scored widgets yet:

1. Strong Foundations → making the website easier to use  
2. Visibility → helping more customers find the business  
3. Acceleration → generating enquiries sooner (including optional paid ads education)  
4. Reputation → building trust  
5. Sustainable Growth → lasting results over time  

---

## Success definition for Version One

A busy owner can finish onboarding in a few minutes, understand what SEO AutoPilot will help with, learn SEO vs Ads without jargon fear, and leave Home knowing the next honest step — without being shown a technical SEO control panel.

---

## Dependencies

- Decision on SEO AutoPilot UI host/framework (`docs/DECISIONS_REQUIRED.md`)  
- Business Discovery engine (exists)  
- UX tone rules (`docs/ENGINEERING_GUARDRAILS.md`)  
- Ask remains locked until Volume 3 unlock  

---

## Relationship to Engineering Bible

Engine work continues under `docs/seo-autopilot/` (new intelligence volumes).  
MVP customer shell is a **product delivery track** that consumes engines — it must not violate Ask lock, invent Google APIs, or reopen a foundation refactor sprint (`PLATFORM_ARCHITECTURE_AUDIT.md`).
