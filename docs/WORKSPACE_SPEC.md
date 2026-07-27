# RankAura Workspace — Phase 4 Specification

**Status:** PHASE 4 — SPEC + STATIC PROTOTYPE  
**Owner:** Jonathan  
**Authority:** Onboarding + Growth Plan locked · Mission dashboard superseded  
**Related:** `docs/GROWTH_PLAN_SPEC.md` · `docs/UI_BIBLE.md` · `docs/SCREEN_LOCK_STATUS.md` · `docs/PRODUCT_GUARDRAILS.md`

---

## 0. Purpose

The Workspace is the **home of RankAura** after the Growth Plan.

It answers one question:

> **What does the business owner need to know right now?**

It must feel calm, premium, and reassuring — not like an SEO dashboard.

**Do not reuse the old Mission dashboard IA or language.**

---

## 1. Product position

| The Workspace is | The Workspace is not |
|------------------|----------------------|
| A calm daily briefing | An SEO scorecard |
| Proof that RankAura is working | A wall of KPIs |
| One clear next step | Many competing CTAs |
| Opportunity-focused | Problem/error theatre |
| Plain English | SEO jargon |

---

## 2. Required page structure (LOCKED)

```text
1. Welcome
2. Today’s Biggest Opportunity
3. Since Your Last Visit
4. Growth Areas (most relevant only)
5. Business Feed
```

Do not reorder. Do not add homepage sections without approval.

---

## 3. Section specifications

### 3.1 Welcome

| Element | Spec |
|---------|------|
| Greeting | Time-aware: **Good morning / Good afternoon / Good evening, {First Name}.** |
| Support | **RankAura has been working on your business.** |
| Summary | One short sentence of meaningful activity since last visit |
| Identity | Business name may appear calmly as secondary context |

Name usage: first name in greeting only (matches personalisation lock). Prefer business name elsewhere.

### 3.2 Today’s Biggest Opportunity

| Element | Spec |
|---------|------|
| Count | **Exactly one** featured recommendation |
| Content | Plain-English title + short explanation |
| Action | **One** primary action button |
| Tone | Opportunity, not alarm |

Labels: avoid Mission / Priority Mission / Review Mission.

Preferred CTA examples: Review & Fix · View Strategy · Approve · View Plan · Review

### 3.3 Since Your Last Visit

| Element | Spec |
|---------|------|
| Purpose | Show work RankAura has **already completed** |
| Format | Short calm list (typically 3–5 items) |
| Focus | Completed actions, not a backlog of tasks |
| Visual | Soft ticks or quiet markers — not progress bars |

### 3.4 Growth Areas

| Element | Spec |
|---------|------|
| Source | Most relevant categories only (typically 3–5) |
| Design | Reuse Growth Plan card language (name, subtitle, status, impact, View details) |
| Link | Through to Growth Plan / category detail |
| Rule | Do not dump all 13 categories on the homepage |

### 3.5 Business Feed

| Element | Spec |
|---------|------|
| Format | Reverse-chronological timeline |
| Item types | Competitor updates · completed research · new opportunities · content ideas · monitoring updates |
| Density | Calm — readable sentences, not event spam |
| Graphs | None on homepage |

---

## 4. Visual direction (LOCKED for this prototype)

Preserve the Growth Plan / approved light workspace DNA:

- Light neutral canvas (`#f3f5f7`)
- Soft white cards
- Premium navy text (`#080f1a`)
- Controlled blue accents
- Generous spacing
- Soft shadows / borders
- Minimal visual noise

Do **not**:

- Convert to a dark navy SaaS dashboard
- Add charts, gauges, or SEO scores
- Add AI employee cards
- Reintroduce Mission language
- Create multiple competing primary CTAs

---

## 5. Language

### Prefer

- Opportunity · Recommendation · Worth your attention  
- We’ve completed · We’re monitoring · We’ve prepared  
- Growth Areas · Business Feed · Workspace  

### Ban

- Mission · Priority Mission · Today’s Mission · Review Mission  
- Quest · Level · XP · streak gamification  
- AI employee supervision framing  
- Critical errors / broken / failure theatre on the homepage  

---

## 6. Personalisation

| Moment | Use |
|--------|-----|
| Welcome greeting | Customer first name |
| Opportunity / feed / areas | Business name where identity helps |
| Everywhere else | “your business” / RankAura voice |

Sparse name use remains locked.

---

## 7. Data model (prototype)

```ts
interface WorkspaceWelcome {
  firstName: string;
  businessName: string;
  greeting: string; // Good morning, Jonathan.
  support: string;  // RankAura has been working on your business.
  activitySummary: string;
}

interface BiggestOpportunity {
  title: string;
  support: string;
  actionLabel: string;
  href?: string;
}

interface CompletedActivity {
  id: string;
  text: string;
  completedAtLabel: string; // e.g. Yesterday · This morning
}

interface WorkspaceGrowthArea {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  impact: string;
  href: string;
}

type FeedItemType =
  | "competitor"
  | "research"
  | "opportunity"
  | "content"
  | "monitoring";

interface BusinessFeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  body: string;
  timestampLabel: string;
}

interface WorkspaceData {
  welcome: WorkspaceWelcome;
  biggestOpportunity: BiggestOpportunity;
  sinceLastVisit: CompletedActivity[];
  growthAreas: WorkspaceGrowthArea[];
  businessFeed: BusinessFeedItem[];
}
```

---

## 8. Routing

| Route | Purpose |
|-------|---------|
| `/workspace` | Phase 4 static Workspace prototype |
| Growth Plan Continue CTA | Points to `/workspace` |
| `/` | Legacy Mission dashboard — **not** the product home; do not extend |

After approval, `/` may become the Workspace. Not in this phase without review.

---

## 9. Responsive behaviour

### Desktop

- Centre reading column (`max-w-3xl`), same calm stack as Growth Plan
- One primary opportunity card with clear CTA
- Growth areas as soft stacked cards
- Feed as vertical timeline

### Mobile

- Same section order
- Full-width cards
- Comfortable touch targets
- No horizontal scrolling
- Single primary CTA remains obvious

---

## 10. Accessibility

- Semantic headings (`h1` welcome, section `h2`s)
- Status not colour-only
- Keyboard-focusable actions
- Adequate contrast on light canvas
- Respect `prefers-reduced-motion`

---

## 11. Mock data requirements

Deterministic, realistic, **no demo-industry hard-coding** in identity fields.

- Prefer session personalisation when present (first name + business name)
- Fallback: generic “there” / “Your business” — never Portsmouth Hypnotherapy / Northern Materials
- Activity, opportunity, and feed copy must sound like real work already done
- Growth areas aligned with Growth Plan human category names

---

## 12. Phase boundaries

### In Phase 4 (this deliverable)

- Specification document
- Static prototype with mock data
- Desktop + mobile screenshots
- Stop for review

### Out of Phase 4

- Live SEO APIs / real scanning
- Authentication changes
- Rebuilding all category detail pages
- Dark theme conversion
- Restoring Mission IA on `/`

---

## 13. Approval checklist (Jonathan)

- [ ] Page structure 1–5 accepted  
- [ ] Visual DNA matches Growth Plan calm light system  
- [ ] No Mission / score / AI-employee residue  
- [ ] Screenshots approved  
- [ ] Ready for live-data phase (later)  

---

**End of Workspace specification.**
