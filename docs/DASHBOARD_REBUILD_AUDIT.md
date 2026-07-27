# RankAura Dashboard Rebuild — Phase 1 Audit

**Status:** AUDIT ONLY — no production code modified  
**Date:** 2026-07-27  
**Owner:** Jonathan  
**Trigger:** Growth Plan + Workspace information-architecture rebuild brief  

---

## 1. Purpose

Inspect the current RankAura surface before any rebuild coding.  
Identify what to **retain visually**, what to **remove**, what to **repurpose**, what is **missing**, what **data/routing** changes are required, and where current locks conflict with the new product direction.

---

## 2. Sources inspected

| Source | Path | Finding |
|--------|------|---------|
| UI Bible | `docs/UI_BIBLE.md` | Onboarding + current dashboard locked from prior screenshot set; flow ends Analysis → Dashboard |
| Screen lock register | `docs/SCREEN_LOCK_STATUS.md` | Dashboard marked **APPROVED — VISUALLY LOCKED**; Growth Plan / Launch Plan listed as “not present in current approved screenshot set” |
| Product guardrails | `docs/PRODUCT_GUARDRAILS.md` | AI Growth Manager positioning; screenshots authority until replaced; single-feature workflow |
| Design system | `rankaura/docs/DESIGN_SYSTEM.md` | Light/white grounds, ink `#080f1a`, muted grey, soft blue nav wash |
| UX philosophy | `rankaura/docs/UX_PHILOSOPHY.md` | Flow ends at Dashboard; uses Mission language |
| Onboarding flow | `components/onboarding/OnboardingFlow.tsx` | Welcome → Website → Business name → Description → Analysis → `router.push("/")` |
| Analysis UI | `components/onboarding/OnboardingAnalysis.tsx` | “Aura goes to work” / “Setting up {business}” + green ticks |
| Dashboard impl | `rankaura-web/components/dashboard/*` | Sidebar + Evening Brief + Today’s Mission; light canvas |
| Mock data | `rankaura-web/services/dashboard/mockDashboardProvider.ts` | Northern Materials Co.; Mission-centric copy |
| Data layer swap | `rankaura-web/services/dashboard/index.ts` | Single `activeProvider` — good pattern to extend |
| UI reference | `docs/ui-reference/` | `06-dashboard.png` present; onboarding binaries still placeholders |
| HTML prototype | `rankaura/` | Non-authority; ignore for rebuild |

---

## 3. Current product flow (as implemented)

```text
Welcome
  → Website URL
  → Business name
  → Business description
  → Analysis / Setup (green ticks)
  → Dashboard `/`   ← PROBLEM: skips Growth Plan / Launch Plan
```

**Required flow (Jonathan brief):**

```text
Welcome
  → Website URL
  → Business name
  → Business description
  → Business and website analysis
  → Growth Plan OR Launch Plan   ← MUST INSERT
  → Main Workspace
```

---

## 4. Current dashboard inventory

### Implemented components

| Component | Role today | Rebuild decision |
|-----------|------------|------------------|
| `DashboardHome.tsx` | Page shell: sidebar + main stack | **Repurpose shell pattern**; replace IA content |
| `DashboardSidebar.tsx` | Company identity + nav (Dashboard, AI Team, Growth, Content, Website, Settings) | **Retain visual pattern** (identity + minimal nav); **relabel/restructure nav** for Workspace / Growth Plan |
| `EveningBriefCard.tsx` | Greeting, stats line, Priority Mission, Review Mission | **Remove Mission framing**; extract greeting + progress summary patterns |
| `TodaysMissionCard.tsx` | Today’s Mission card | **Remove** (Mission language banned) |
| `types/dashboard.ts` | Dashboard domain types | **Replace/extend** with Growth Plan + Workspace types |
| `mockDashboardProvider.ts` | Deterministic Northern Materials mock | **Repurpose as seed** for Growth Plan mock + Workspace mock; keep single-provider swap |
| `services/dashboard/index.ts` | Provider swap point | **Retain pattern**; likely rename/expand to `services/growth` + `services/workspace` or one `services/rankaura` facade |

### Missing (required by brief)

| Missing piece | Notes |
|---------------|--------|
| Growth Plan / Launch Plan route + page | e.g. `/growth-plan` |
| Existing-site vs brand-new-site state model | Query switch proposed: `?site=existing` / `?site=new` |
| 13 locked category cards (expandable) | Including Reddit & Community Research |
| Analysis summary block (non-scorecard) | Business / website / competitors / market / opportunities |
| Primary Opportunity module | One opportunity + one action |
| Status system (Complete / In Progress / Planned / Monitoring / Waiting for Approval) | Not present |
| Workspace homepage IA | Progress summary (≤3), Worth your attention, New opportunities (≤3), Recent work, collapsed categories |
| Site-state detection / mock flag | No `siteType: 'existing' \| 'new'` today |
| Onboarding → Growth Plan redirect | Currently Analysis → `/` |

### Onboarding components (context)

| Piece | Status | Rebuild impact |
|-------|--------|----------------|
| Welcome / Website / Business name / Description (in `OnboardingFlow`) | Present; supporting Shell/Fields/Welcome files still incomplete in this workspace | **Preserve** screenshot-backed onboarding screens |
| `OnboardingAnalysis` | Present; wording locked from component | **Preserve** analysis screen; only change **exit routing** after approval |
| Growth Plan Summary / Launch CTA screens | Previously “not in screenshot set” | Brief now **requires** Growth/Launch Plan as primary post-analysis page |

---

## 5. Retain vs remove vs repurpose

### Retain visually (design DNA)

Keep the strongest RankAura qualities already present:

- Calm, spacious composition
- Soft card radii and light elevation
- Clear typography hierarchy
- Minimal primary actions (one CTA focus)
- Sidebar company identity treatment
- Controlled electric-blue active accent
- Generous whitespace / low visual noise
- Sans typeface already in use (do not invent a new brand font)

### Remove or replace (information architecture / copy)

| Current | Why | Replacement direction |
|---------|-----|------------------------|
| Priority Mission | Mission / gamification language | Primary Opportunity / Worth your attention |
| Today’s Mission | Mission language | Recent work / Recommended next step |
| Review Mission CTA | Mission language | Review & Fix / View Strategy / Approve / View Plan |
| Direct Analysis → Dashboard | Skips the most important page | Analysis → Growth/Launch Plan → Workspace |
| AI Team nav as “supervise workers” framing | Customer should not manage AI employees | Soften to Growth / Workspace categories; avoid employee grid |
| Dense future analytics widgets (not built yet, but risk) | Brief forbids wall of metrics | Cap summaries at three calm figures |

### Repurpose

| Existing asset | How to reuse |
|----------------|--------------|
| Sidebar layout | Workspace chrome; fewer, clearer destinations |
| Card shell styles | Growth Plan header, primary opportunity, category cards |
| Provider swap (`setDashboardDataProvider`) | Extend to Growth Plan + Workspace providers |
| Northern Materials mock story | Seed **existing-site** Growth Plan narrative |
| Second mock profile needed | Brand-new site / Launch Plan state |
| Onboarding analysis completion callback | Point to `/growth-plan` instead of `/` |

---

## 6. Design-system tension (must resolve in Phase 2)

| Topic | Current locked docs / impl | New rebuild brief |
|-------|----------------------------|-------------------|
| Surface | Light grey canvas + white cards | “Premium **dark navy** interface” + soft blue glow |
| Dashboard IA | Evening Brief / Missions (locked) | Explicitly wrong; replace with Growth Plan + Workspace |
| Post-analysis route | `/` dashboard | Growth/Launch Plan first |

**Audit conclusion:** Jonathan’s brief is **explicit written authority** to rebuild dashboard **information architecture** and introduce Growth/Launch Plan.  

Phase 2 must state clearly:

1. Which visual tokens remain (spacing, type, card softness, blue accent).  
2. Whether the shell moves to **dark navy** (brief) or stays **light** (current screenshots) until new screenshots are approved.  
3. That `SCREEN_LOCK_STATUS` Dashboard row will move from “Visually Locked” to **UNLOCKED FOR IA REBUILD** / superseded after new screenshots are approved.

Agents must **not** invent a generic SaaS look while resolving this.

---

## 7. Language audit (current → required)

| Banned / avoid | Appears today? | Required alternatives |
|----------------|----------------|------------------------|
| Mission / Priority Mission / Today’s Mission | Yes | Opportunity, Recommended next step, Worth your attention |
| Review Mission | Yes | Review & Fix, View Strategy, View Plan, Approve |
| Quest / Level / AI employee productivity | No (good) | Keep absent |
| Dense SEO jargon in customer UI | Partially in mock websiteHealth copy risk | Plain-English discovery / completed / next |

---

## 8. Routing changes required

| Change | From | To |
|--------|------|----|
| Post-analysis destination | `router.push("/")` in `OnboardingFlow.goToDashboard` | `router.push("/growth-plan")` (or `/growth-plan?site=…`) |
| Growth Plan route | Missing | `/growth-plan` with `?site=existing` \| `?site=new` |
| Main Workspace | `/` as Mission dashboard | `/` becomes simplified Workspace after Growth Plan viewed |
| Optional deep links | Missing | Category expand state via hash/query later (not Phase 3) |

**Gate:** Do not rebuild Workspace UI until Growth Plan screenshots are approved (per brief Phase 3→4).

---

## 9. Data structures — reuse vs new

### Reusable ideas

- `BusinessIdentity` (`name`, `industry`, `ownerFirstName`, `ownerInitial`)
- Single provider interface pattern
- Deterministic mock (no randomness)

### New structures needed (Phase 2 spec)

```text
SiteState: 'existing' | 'new'

GrowthPlan:
  siteState
  title (Growth Plan | Launch Plan)
  supportCopy
  analysisSummary[]
  primaryOpportunity { title, support, actionLabel, actionId }
  categories[] {
    id, name, summary, status, count?
    discovered[], completed[], next[], yourAction?
    primaryAction { label, id }
  }

WorkspaceHome:
  greeting
  supportSentence
  progressSummary[≤3]
  worthYourAttention
  newOpportunities[≤3]
  recentWorkCompleted[]
  categories (collapsed refs)
```

### Locked categories (all required)

1. Website Health  
2. Keyword Strategy  
3. Competitor Intelligence  
4. Content Strategy  
5. Reddit & Community Research *(first-class; must not omit)*  
6. Local SEO  
7. Authority Building  
8. Digital PR  
9. Social Media  
10. Reviews & Reputation  
11. Analytics & Tracking  
12. AI Monitoring  
13. Business Intelligence  

Statuses allowed only: **Complete · In Progress · Planned · Monitoring · Waiting for Approval**

---

## 10. Existing-site vs brand-new-site

| | Existing website | Brand-new website |
|--|------------------|-------------------|
| Title | Your Growth Plan is Ready | Your Launch Plan is Ready |
| Tone | Discoveries + fixes + completed work | Positive build-from-scratch roadmap |
| Avoid | — | False errors / warnings / broken-site framing |
| Primary action examples | Review & Fix, Fix Now, Approve | View Strategy, View Launch Plan |
| Mock switch | `/growth-plan?site=existing` | `/growth-plan?site=new` |

Current codebase has **no** `siteState` concept.

---

## 11. Risk register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Conflicting visual locks (light locked dashboard vs dark navy brief) | High | Resolve in Phase 2 spec with Jonathan; approve new screenshots before locking |
| Scope creep into full Workspace before Growth Plan approval | High | Hard stop after Phase 4 screenshots |
| Reintroducing Mission / AI-employee supervision UI | High | Language checklist in GROWTH_PLAN_SPEC |
| Technical SEO jargon in category bodies | Medium | Spec requires Discover/Completed/Next/Your Action only |
| Duplicate component systems (`rankaura/` HTML vs `rankaura-web`) | Medium | Continue ignoring HTML prototype |
| Incomplete onboarding support files in this workspace | Medium | Preserve flow code; restore missing Shell/Welcome/Fields as needed without redesign |

---

## 12. Recommended Phase 2 deliverables (no code yet)

1. `docs/GROWTH_PLAN_SPEC.md` covering:
   - Existing vs new site states  
   - Category structure (all 13)  
   - Card collapsed/expanded states  
   - Status + action language  
   - Responsive behaviour  
   - Mock-data requirements + query switch  
2. Update `docs/UI_BIBLE.md` for Growth Plan + revised post-analysis flow  
3. Update `docs/SCREEN_LOCK_STATUS.md`:
   - Unlock / supersede Mission dashboard IA  
   - Add Growth Plan as **IN SPEC — PENDING BUILD**  
   - Keep onboarding analysis visually locked  
4. Update `docs/PRODUCT_GUARDRAILS.md` only if needed to reflect Growth Plan as mandatory post-analysis step  
5. Explicit note on **dark navy vs light shell** decision  

---

## 13. Phase 3 scope preview (after Phase 2 approval only)

- Build Growth Plan / Launch Plan screen first  
- Realistic structured mock data for both states  
- Dev switch: `/growth-plan?site=existing` and `/growth-plan?site=new`  
- **Do not** rebuild main Workspace until Growth Plan screenshots are approved  

---

## 14. Explicit non-actions for this phase

- No production code edits  
- No dashboard component rewrites  
- No routing changes yet  
- No Growth Plan UI implementation yet  

---

## 15. Audit verdict

| Question | Answer |
|----------|--------|
| Is current dashboard IA correct for RankAura? | **No** — Mission-centric; skips Growth Plan |
| Can visual DNA be retained while rebuilding IA? | **Yes** — spacing, cards, type, blue accent, calm hierarchy |
| Must Growth Plan become post-analysis destination? | **Yes** |
| Are all 13 categories present today? | **No** — none as expandable Growth Plan system |
| Is Reddit & Community Research present? | **No** — must be added as first-class category |
| Ready for Phase 2 specification? | **Yes** |

**Stop.** Await approval to begin **PHASE 2 — GROWTH_PLAN_SPEC.md** and lock-document updates.
