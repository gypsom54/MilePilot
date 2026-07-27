# RankAura Workspace — Phase 4 Specification

**Status:** PHASE 4 — FINAL POLISH (static prototype)  
**Owner:** Jonathan  
**Authority:** Onboarding + Growth Plan locked · Workspace architecture approved  
**Related:** `docs/GROWTH_PLAN_SPEC.md` · `docs/UI_BIBLE.md` · `docs/SCREEN_LOCK_STATUS.md` · `docs/PRODUCT_GUARDRAILS.md`

---

## 0. Purpose

The Growth Plan answers: **“What did RankAura discover?”**  
The Workspace answers: **“What has RankAura done since I was last here?”**  
Future reports will answer: **“What impact has RankAura’s work had?”**

Every time a customer opens RankAura, they should immediately feel that their business is in a better position than it was the last time they looked.

**Locked Workspace principles:**

1. RankAura should never make customers feel like they have more work to do. It should make them feel like less work needs to be done because RankAura is already doing it.
2. Every time a customer opens RankAura, they should immediately feel that their business is in a better position than it was the last time they looked.

**Do not reuse the old Mission dashboard IA or language.**

---

## 1. Product position

| The Workspace is | The Workspace is not |
|------------------|----------------------|
| Proof of quiet ongoing work | An SEO scorecard |
| Momentum and reassurance | A wall of KPIs |
| One clear next step | Many competing CTAs |
| Opportunity-focused | Problem/error theatre |
| Plain English | SEO jargon |

---

## 2. Required page structure (LOCKED)

```text
1. Greeting
2. Ask RankAura (compact adviser card — Phase B prototype)
3. Biggest Opportunity (typed featured item)
4. Recent Wins (max 3 — calm, restrained)
5. Since Your Last Visit
6. Growth Areas (max 4 featured)
7. Recent Progress (timeline)
```

Ask RankAura insertion is specified in `docs/ASK_RANKAURA_SPEC.md`. Do not remove or redesign sections 3–7.

---

## 3. Section specifications

### 3.1 Greeting

| Element | Spec |
|---------|------|
| Greeting | Time-aware: **Good morning / afternoon / evening, {First Name}.** |
| Support | **RankAura has been working on your business.** |
| Monitoring line | Quiet secondary: **RankAura is actively monitoring your business across 13 growth areas.** |
| Summary | One short sentence of meaningful activity since last visit |
| Identity | Business name as calm secondary context |

### 3.2 Biggest Opportunity

| Element | Spec |
|---------|------|
| Count | **Exactly one** featured item |
| Variant field | `opportunity` · `review` · `approval` · `celebration` · `reminder` · `milestone` |
| Visual | Same premium card across variants — do not invent separate card designs |
| Tone | Opportunity-led, not corrective |
| Title example | We found an opportunity to help more local customers discover your services. |
| Support example | We’ve prepared a set of improvements designed around the phrases your customers are already searching for. |
| Action | One primary CTA (e.g. **Review & Fix**) |

### 3.3 Recent Wins

| Element | Spec |
|---------|------|
| Max items | **3** |
| Tone | Celebratory but restrained — no confetti, gamification, or oversized graphics |
| Content | Realistic completed progress only — no unsupported ranking claims |

### 3.4 Since Your Last Visit

| Element | Spec |
|---------|------|
| Purpose | Completed customer-facing work only |
| Timestamps | Natural language (This morning · Yesterday afternoon · Last night) |
| Forbidden | Internal AI processing logs |
| Focus | Completed actions, not a backlog of tasks |
| Visual | Soft ticks or quiet markers — not progress bars |

### 3.5 Growth Areas

| Element | Spec |
|---------|------|
| Max | **4** featured areas |
| Fields | Name · short description · state · one context-specific action |
| Actions | Prefer View Progress · Open Strategy · Review Recommendations · View Research |
| Link | Through to Growth Plan |
| Rule | Do not dump all 13 categories on the homepage |

### 3.6 Recent Progress

Formerly “Business Feed”.

| Element | Spec |
|---------|------|
| Supporting copy | A calm timeline of the work RankAura has completed and the opportunities it has identified. |
| Format | Reverse-chronological timeline |
| Types | New opportunity · Work completed · Research completed · Competitor update · Recommendation prepared · Approval needed · Milestone reached |
| Entry | Type label · natural timestamp · title · 1–2 sentences · optional action |
| Forbidden | Noisy system events / every background check / social-media feed feel |

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

- Opportunity · Recommendation · Worth reviewing · Ready for approval  
- We’ve prepared · We’ve completed · We’ve identified · We’re monitoring  
- Growth Areas · Recent Progress · Workspace · Progress · Next step  

### Ban

- Mission · Priority Mission · Today’s Mission · Review Mission  
- Quest · Level · XP · streak gamification  
- AI employee supervision framing  
- Problems · Failures · Critical errors · Weak performance · Falling behind  
- Urgent mission language on the homepage  

---

## 6. Personalisation

| Moment | Use |
|--------|-----|
| Welcome greeting | Customer first name |
| Opportunity / progress / areas | Business name where identity helps |
| Everywhere else | “your business” / RankAura voice |

Sparse name use remains locked.

---

## 7. Data model (prototype)

```ts
type FeaturedItemVariant =
  | "opportunity"
  | "review"
  | "approval"
  | "celebration"
  | "reminder"
  | "milestone";

type ProgressItemType =
  | "opportunity"
  | "completed"
  | "research"
  | "competitor"
  | "recommendation"
  | "approval"
  | "milestone";

interface WorkspaceWelcome {
  firstName: string;
  businessName: string;
  greeting: string;
  support: string;
  monitoringLine: string;
  activitySummary: string;
}

interface BiggestOpportunity {
  variant: FeaturedItemVariant;
  title: string;
  support: string;
  actionLabel: string;
  href?: string;
}

interface RecentWin {
  id: string;
  text: string;
}

interface CompletedActivity {
  id: string;
  text: string;
  completedAtLabel: string;
}

interface WorkspaceGrowthArea {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  impact: string;
  actionLabel: string;
  href: string;
}

interface RecentProgressItem {
  id: string;
  type: ProgressItemType;
  title: string;
  body: string;
  timestampLabel: string;
  actionLabel?: string;
  href?: string;
}

interface WorkspaceData {
  welcome: WorkspaceWelcome;
  biggestOpportunity: BiggestOpportunity;
  recentWins: RecentWin[];
  sinceLastVisit: CompletedActivity[];
  growthAreas: WorkspaceGrowthArea[];
  recentProgress: RecentProgressItem[];
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
- Recent Wins compact — must not dominate
- Growth areas as soft stacked cards (max 4)
- Recent Progress as vertical timeline

### Mobile

- Same section order (single column)
- Greeting remains compact
- Biggest Opportunity appears early
- Recent Wins does not dominate the screen
- Since Your Last Visit remains easy to scan
- Growth Areas have comfortable touch targets
- Recent Progress entries do not become excessively tall
- No horizontal scrolling
- Actions remain clearly visible

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
- Activity, opportunity, wins, and progress copy must sound like real work already done
- Growth areas aligned with Growth Plan human category names (max 4 on Workspace)
- No unsupported ranking success claims

---

## 12. Phase boundaries

### In Phase 4 (this deliverable)

- Specification document (final polish)
- Static prototype with mock data
- Desktop + mobile + section screenshots
- Stop for review

### Out of Phase 4

- Live SEO APIs / real scanning
- Authentication changes
- Rebuilding all category detail pages
- Dark theme conversion
- Restoring Mission IA on `/`
- Live reports / impact surfaces

---

## 13. Approval checklist (Jonathan)

- [ ] Page structure 1–6 accepted  
- [ ] Opportunity-led language accepted  
- [ ] Recent Wins calm and restrained  
- [ ] Visual DNA matches Growth Plan calm light system  
- [ ] No Mission / score / AI-employee residue  
- [ ] Screenshots approved  
- [ ] Ready for live-data phase (later)  

---

**End of Workspace specification.**
