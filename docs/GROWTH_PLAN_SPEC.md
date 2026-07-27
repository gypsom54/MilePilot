# RankAura Growth Plan — Phase 2 Specification

**Status:** PHASE 2 — SPECIFICATION ONLY (no production code)  
**Owner:** Jonathan  
**Authority:** Phase 1 audit approved · final decisions in this document  
**Related:** `docs/UI_BIBLE.md` · `docs/SCREEN_LOCK_STATUS.md` · `docs/PRODUCT_GUARDRAILS.md` · `docs/DASHBOARD_REBUILD_AUDIT.md`

---

## 0. Purpose

Define the **Growth Plan** (existing site) and **Launch Plan** (brand-new site) as the primary post-analysis surface in RankAura.

This document locks structure, hierarchy, data model, language, states, and handoff into the Workspace.  
Phase 3 may implement only after Jonathan approves this specification.

**Do not code yet.**

---

## 1. Required product flow (LOCKED)

```text
Welcome
  → Website URL
  → Business name
  → Business description
  → Business and website analysis
  → Growth Plan OR Launch Plan
  → Main Workspace
```

### Hard rules

1. The user must **not** be sent directly from Analysis into the current dashboard.
2. Growth Plan / Launch Plan is the **most important** post-analysis page.
3. Workspace is entered only after the customer continues from Growth Plan / Launch Plan (or returns later via nav once that path exists).

---

## 2. Page variants

| Variant | When | Page title |
|---------|------|------------|
| **Growth Plan** | Business already has a live website (`siteState` family: `existing*`) | Growth Plan |
| **Launch Plan** | Business is starting without a meaningful live site (`siteState` family: `new*`) | Launch Plan |

Same page architecture. Different framing, primary opportunity, “what happens next”, and category relevance ordering.

---

## 3. Site-state data model

### UI-facing states (Phase 3)

| UI switch | Meaning |
|-----------|---------|
| `existing` | Live site available for meaningful analysis |
| `new` | Brand-new / pre-launch / no usable live site yet |

Development review routes:

```text
/growth-plan?site=existing
/growth-plan?site=new
```

Do **not** expose finer states in Phase 3 UI.

### Underlying model (extensible — do not trap later)

```ts
type SiteStateFamily = "existing" | "new";

type SiteState =
  | "existing"
  | "existing_needs_access"
  | "existing_limited_scan"
  | "new"
  | "new_pre_launch"
  | "new_site_live";

interface SiteContext {
  /** Coarse family driving Growth Plan vs Launch Plan chrome */
  family: SiteStateFamily;
  /** Fine-grained state for future product logic */
  state: SiteState;
  /** Optional flags for later without schema rewrite */
  flags?: {
    hasWebsiteAccess?: boolean;
    scanDepth?: "full" | "limited" | "none";
    siteLive?: boolean;
  };
}
```

### Mapping rules (now)

| Stored `state` | `family` | Page title |
|----------------|----------|------------|
| `existing` | `existing` | Growth Plan |
| `existing_needs_access` | `existing` | Growth Plan |
| `existing_limited_scan` | `existing` | Growth Plan |
| `new` | `new` | Launch Plan |
| `new_pre_launch` | `new` | Launch Plan |
| `new_site_live` | `new` → may later migrate to `existing` family | Launch Plan until product decides otherwise |

Phase 3 mock data only needs `existing` and `new`. Schema must accept the longer enum without rewrite.

---

## 4. Page hierarchy (LOCKED)

The Growth Plan must **not** begin as a list of 13 equal cards.

Desktop and mobile share this order:

1. **Growth Plan / Launch Plan header**
2. **Calm analysis confirmation**
3. **One primary opportunity** (or strategic direction)
4. **Short “What happens next” explanation**
5. **Most relevant featured categories** (not all 13 equally)
6. **Remaining expandable categories**
7. **Continue to Workspace** action

The customer must understand the result before exploring technical detail.

---

## 5. Visual direction for this phase (LOCKED)

### Preserve

- Calm **light** workspace canvas
- Soft white cards
- Premium navy / ink text
- Controlled blue accents (nav, selected moments)
- Spacing, typography rhythm, and card softness from the approved dashboard visual DNA

### Do not do in Phase 2/3 without screenshot approval

- Convert the whole Growth Plan or Workspace to a dark navy SaaS dashboard
- Invent a generic dark theme with glow-heavy chrome
- Make a major theme change “because RankAura also has dark brand assets”

### Selective dark navy (allowed)

- Navigation / brand lockup accents
- Selected feature moments
- Premium highlights where they already fit the light system

**Priority:** correct structure, clarity, emotional impact. Theme evolution is a later review.

---

## 6. Category system (LOCKED — all 13 must exist)

| # | Category id | Display name |
|---|-------------|--------------|
| 1 | `website_health` | Website Health |
| 2 | `keyword_strategy` | Keyword Strategy |
| 3 | `competitor_intelligence` | Competitor Intelligence |
| 4 | `content_strategy` | Content Strategy |
| 5 | `reddit_community` | Reddit & Community Research |
| 6 | `local_seo` | Local SEO |
| 7 | `authority_building` | Authority Building |
| 8 | `digital_pr` | Digital PR |
| 9 | `social_media` | Social Media |
| 10 | `reviews_reputation` | Reviews & Reputation |
| 11 | `analytics_tracking` | Analytics & Tracking |
| 12 | `ai_monitoring` | AI Monitoring |
| 13 | `business_intelligence` | Business Intelligence |

**Reddit & Community Research is first-class.** It must not be omitted, demoted to a footnote, or merged into another category.

### Every category must answer four questions

1. **What did we discover?**
2. **What have we completed?**
3. **What are we doing next?**
4. **Is any customer action required?** (show only when true)

### Category data model

```ts
type CategoryStatus =
  | "complete"
  | "in_progress"
  | "planned"
  | "monitoring"
  | "waiting_for_approval";

interface GrowthCategory {
  id: string; // one of the 13 locked ids
  name: string;
  /** 0–100; higher = more relevant to this business */
  relevanceScore: number;
  /** Sort key among peers; lower = earlier. Derived from relevance + business rules */
  displayPriority: number;
  /** false = not currently applicable; still in model, reduced visual weight */
  applicable: boolean;
  /** true = shown in featured band above the fold */
  featured: boolean;
  status: CategoryStatus;
  opportunityCount?: number;
  discovered: string;
  completed: string;
  next: string;
  customerActionRequired: boolean;
  customerActionLabel?: string; // e.g. "Approve draft" / "Connect Google Business Profile"
  customerActionHint?: string;
}
```

### Relevance and ordering rules

1. All 13 categories **exist** in the model for every business.
2. Do **not** present every category as equally important.
3. Featured band: typically **3–5** most relevant applicable categories.
4. Remaining applicable categories appear below, expandable, ordered by `displayPriority`.
5. Non-applicable categories may appear last in a quieter “Also available” / collapsed group — **never permanently hide core capabilities**, but do not give them equal visual weight.
6. Ordering must consider: business type, site state family, market, and analysis findings.

### Example orderings (illustrative mock guidance)

**Local service business (existing site):**

1. Website Health  
2. Local SEO  
3. Reviews & Reputation  
4. Keyword Strategy  
5. Content Strategy  
→ then remaining applicable categories  

**National ecommerce / software (existing site):**

1. Website Health  
2. Keyword Strategy  
3. Competitor Intelligence  
4. Content Strategy  
5. Authority Building  
→ then remaining applicable categories  

**Brand-new site (Launch Plan):**

Featured set should emphasise foundation work (Website Health / Launch readiness, Keyword Strategy, Content Strategy, Analytics & Tracking, Local SEO if local) and de-emphasise deep competitive warfare until a site exists.

---

## 7. Category definitions (product meaning)

Each definition is customer-facing intent, not SEO jargon.

| Category | What RankAura owns |
|----------|--------------------|
| Website Health | Technical and experience foundations that help the site earn trust and visibility |
| Keyword Strategy | What the business should be found for; priority phrases and intent clusters |
| Competitor Intelligence | Who else customers compare you to; gaps and opportunities |
| Content Strategy | What to publish and why it helps growth |
| Reddit & Community Research | Real customer language and demand signals from communities |
| Local SEO | Visibility where geography matters (maps, local queries, local trust) |
| Authority Building | Earned mentions, citations, and trust signals over time |
| Digital PR | Outreach-worthy angles and placement opportunities |
| Social Media | Supportive social presence that reinforces growth goals (not vanity posting) |
| Reviews & Reputation | Review acquisition, response posture, reputation risk |
| Analytics & Tracking | Measurement that proves growth work is landing |
| AI Monitoring | Ongoing watch for changes, risks, and opportunities |
| Business Intelligence | Plain-language understanding of the business, market, and priorities |

---

## 8. Screen sections (detailed)

### 8.1 Header

| Element | Spec |
|---------|------|
| Title | **Growth Plan** or **Launch Plan** |
| Optional eyebrow | Business name (calm, secondary) |
| Optional support | One short line that this is Aura’s plan after learning about the business — not a scorecard |
| Visual | Light canvas; no dark full-bleed takeover |

### 8.2 Calm analysis confirmation

Purpose: reassure that analysis finished and Aura understands the business.

Must include a short, plain summary covering (as available):

- Business understanding
- Website understanding (or “site not live yet” for Launch Plan)
- Market / competitors (high level)
- Opportunity posture (without a wall of metrics)

**Forbidden:** SEO score widgets, traffic charts, keyword tables, gamified levels.

### 8.3 Primary opportunity (one)

| Element | Spec |
|---------|------|
| Count | **Exactly one** primary opportunity or strategic direction |
| Content | Clear outcome in ordinary language |
| Optional CTA | Single action if customer input is needed; otherwise “Aura will handle this” framing |
| Tone | Calm confidence — not urgency theatre |

Examples (mock direction):

- Existing: “Your strongest near-term growth lever is fixing how local customers find and trust you.”
- New: “Your first job is a clear foundation site that can be found for the right searches.”

### 8.4 What happens next

Short explanation (2–4 sentences or 3 calm bullets max):

- What Aura will do automatically
- What the customer might need to approve later
- That the Workspace is where ongoing progress lives

No roadmap dump. No 13-item checklist here.

### 8.5 Featured categories

- 3–5 cards/rows for highest-relevance applicable categories
- Slightly stronger visual weight than the list below
- Collapsed by default; expand reveals the four answers
- Status chip visible when collapsed

### 8.6 Remaining categories

- Expandable list/accordion
- Ordered by relevance
- Quieter treatment than featured
- Non-applicable items last / lowest emphasis

### 8.7 Continue to Workspace

| Element | Spec |
|---------|------|
| Primary CTA | **Continue to Workspace** (exact label preferred; alternatives only with approval) |
| Behaviour | Advances into Main Workspace |
| Placement | End of page hierarchy; sticky optional on mobile if needed for reachability — do not compete with primary opportunity |

---

## 9. Collapsed vs expanded category states

### Collapsed (default)

Shows:

- Category name
- Status
- Optional opportunity count (if useful and calm)
- Expand affordance

Does **not** dump the four answers until opened.

### Expanded

Shows, in this order:

1. What we discovered  
2. What we’ve completed  
3. What we’re doing next  
4. Your action (only if `customerActionRequired`)

One category expanded at a time is preferred for calmness (accordion). Multi-expand allowed only if it stays readable on mobile.

---

## 10. Status language (LOCKED)

| Status key | Customer label |
|------------|----------------|
| `complete` | Complete |
| `in_progress` | In Progress |
| `planned` | Planned |
| `monitoring` | Monitoring |
| `waiting_for_approval` | Waiting for Approval |

No additional status vocabulary without approval.

---

## 11. Action and product language

### Preferred

- Opportunity  
- Recommended next step  
- Worth your attention  
- Work completed  
- Planned next  
- Waiting for approval  
- Growth Plan / Launch Plan  
- Workspace  

### Banned on this surface

- Mission / Priority Mission / Today’s Mission / Review Mission  
- Quest / Level / XP / streak gamification  
- AI employee / supervise your team productivity framing  
- SEO jargon as primary labels (SERP, backlink velocity, etc.) unless behind plain language  

---

## 12. Existing-site state (Growth Plan)

### Intent

Customer has a live site. Aura has analysed it and presents a growth direction.

### Mock narrative requirements (Phase 3)

Use a realistic ordinary business (e.g. local trade or established B2B). Include:

- Believable discoveries (not empty placeholders)
- Mix of statuses across categories
- One clear primary opportunity
- At least one category `waiting_for_approval` or with customer action
- Featured set that reflects business type (not alphabetical 13)

### Tone differences vs Launch Plan

- Speaks to **improvement and leverage** on an existing presence
- Website Health can reference current issues found
- Competitor Intelligence can be more concrete

---

## 13. Brand-new-site state (Launch Plan)

### Intent

Customer is early. Aura presents a launch foundation, not a mature optimisation console.

### Mock narrative requirements (Phase 3)

- Title: **Launch Plan**
- Primary opportunity about foundation / first visibility
- Several categories `planned` rather than `in_progress`
- Local SEO featured if local; otherwise keyword + content + analytics foundations
- Avoid pretending deep competitor warfare is already underway

### Tone

- Reassuring, sequential, foundation-first
- Still premium — not a wizard checklist aesthetic

---

## 14. Query-parameter review states

| URL | Purpose |
|-----|---------|
| `/growth-plan?site=existing` | Review Growth Plan mock |
| `/growth-plan?site=new` | Review Launch Plan mock |

Optional future params (not required in Phase 3 UI):

- `?expand=website_health` — open one category for screenshot
- `?partial=1` — partial analysis state

Invalid / missing `site` → default to `existing` for review builds, or derive from onboarding context in production.

---

## 15. Empty, loading, and partial-analysis states

| State | Behaviour |
|-------|-----------|
| **Loading** | Calm skeleton or soft progress under header; no fake completed categories |
| **Empty** | Should be rare after analysis; if no data, show calm “Still preparing your plan” + retry/back path — never a blank wall of empty cards |
| **Partial analysis** | Show confirmed sections; mark incomplete areas as still working; do not invent discoveries; featured set may shrink |
| **Error** | Plain apology + retry; preserve onboarding data |

Partial state must still preserve page hierarchy (header → confirmation → opportunity when known → what happens next → categories available so far).

---

## 16. Responsive behaviour

### Desktop

- Single reading column or soft two-zone layout (summary stack then categories)
- Featured categories may use a gentle grid (not a dense dashboard tile wall)
- Sidebar chrome: only if already entering Workspace shell; Growth Plan may be full-width calm page **or** light shell — Phase 3 should prefer clarity over forcing the old Mission dashboard chrome

### Mobile

- Same section order as desktop
- Featured categories stack vertically
- Accordions for category detail
- Primary CTA reachable without hunting
- No horizontal metric strips

### Hierarchy rule

Mobile must not reorder sections into “categories first.” Understanding comes before exploration.

---

## 17. Accessibility requirements

1. Heading hierarchy: page title `h1`; section headings logical `h2`/`h3`.
2. Status not conveyed by colour alone (text label required).
3. Expand/collapse controls are real buttons with `aria-expanded`.
4. Focus order follows visual order.
5. Contrast meets WCAG AA on light canvas.
6. CTA is keyboard reachable; no hover-only actions.
7. Reduced motion: respect `prefers-reduced-motion` for expand transitions.

---

## 18. Realistic mock-data requirements (Phase 3)

Provide two complete mock packages:

| Package | `site` | Business flavour |
|---------|--------|------------------|
| A | `existing` | Established local or regional business with a live site |
| B | `new` | Brand-new business preparing to launch |

Each package must include:

- `SiteContext`
- Header strings
- Analysis confirmation copy
- Exactly one primary opportunity
- What-happens-next copy
- All 13 categories with relevance, priority, applicable, featured, status, four answers
- At least 3–5 `featured: true`
- Varied statuses (not all Planned)
- Optional opportunity counts on a few categories only
- Workspace handoff target (route stub ok)

Prefer extending the single data-provider swap pattern already used in `rankaura-web/services/dashboard/`.

---

## 19. Handoff into the Workspace

| From | To | Trigger |
|------|----|---------|
| Growth Plan / Launch Plan | Main Workspace | **Continue to Workspace** |

### Handoff rules

1. Customer arrives with context: business identity, site family, plan already seen.
2. Workspace must **not** re-run the Growth Plan as a wall of equal category cards on first paint.
3. Workspace IA is specified later (post Growth Plan approval); Growth Plan remains the strategic overview.
4. Until Workspace rebuild is approved, Continue may land on a temporary Workspace stub **only if** Jonathan approves that interim — default expectation is Workspace rebuild follows Growth Plan approval in a later phase.
5. Onboarding Analysis completion must route to Growth Plan / Launch Plan, **not** `/` Mission dashboard.

---

## 20. Relationship to old dashboard

| Old element | Status |
|-------------|--------|
| Priority Mission / Today’s Mission / Review Mission | **Superseded** — do not rebuild into Growth Plan |
| AI Team supervision framing | **Superseded** |
| Analysis → Dashboard direct route | **Superseded** |
| Light canvas, soft cards, typography, blue accents | **Visual reference retained** |

See `docs/SCREEN_LOCK_STATUS.md` for lock register updates.

---

## 21. Phase boundaries

### Phase 2 (this document) — DONE when approved

- Specification and documentation only
- No production routes, components, or theme conversion

### Phase 3 (after approval) — preview only

- Implement Growth Plan / Launch Plan with mock data
- Dev switches: `?site=existing` / `?site=new`
- Screenshot desktop + mobile (existing, new, collapsed category, expanded category)
- Stop again for approval before Workspace rebuild

### Explicitly out of Phase 2

- Modify production routes  
- Rebuild dashboard components  
- Implement category cards in code  
- Change onboarding code  
- Build the Growth Plan page  
- Replace the visual theme  

---

## 22. Approval checklist (Jonathan)

- [ ] Flow lock: Analysis → Growth/Launch Plan → Workspace  
- [ ] Site-state model extensible; UI only `existing` / `new`  
- [ ] Light visual system preserved for first implementation  
- [ ] 13 categories locked; relevance ordering required  
- [ ] Page hierarchy sections 1–7 accepted  
- [ ] Status + banned language accepted  
- [ ] Ready for Phase 3 mock implementation  

---

**End of Phase 2 Growth Plan specification.**
