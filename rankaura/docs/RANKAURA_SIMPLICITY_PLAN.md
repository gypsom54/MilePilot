# RankAura Simplicity Plan

**Status:** Strategic architecture reset — roadmap only, no implementation yet  
**Date:** July 2026  
**Authority:** RankAura Product Constitution  
**North star:** The customer logs in for less than five minutes and leaves feeling *everything is under control.*

---

## Executive summary

RankAura’s constitution defines an **AI Growth Manager for small businesses** — not an SEO platform, not a content tool, not another dashboard. The customer provides a website, business name, and short description. Aura does everything else. The customer occasionally approves important work.

**Current product drift is severe in Mission Mode** (the active review experience). Mission Control is closer to the constitution but still carries unnecessary process visibility, duplicate information, and SEO-adjacent metrics.

This plan identifies every violation, ranks remediation by customer impact, and sequences a calm simplification program. **No feature development until Phase 0 (copy and constitution alignment) is complete.**

---

## Constitution checklist (applied to all work)

Before any future feature ships, it must pass:

| Question | Must be YES |
|----------|-------------|
| Does this reduce work for the customer? | ✓ |
| Does this reduce stress? | ✓ |
| Does this increase confidence? | ✓ |
| Does it answer exactly one screen question? | ✓ |
| Does it hide technical SEO unless explicitly requested? | ✓ |
| Does it show outcomes, not processes? | ✓ |

---

## Screen inventory

| Route | Screen | Constitution question | Current answer quality |
|-------|--------|----------------------|------------------------|
| `/` | Mission Control (dashboard) | *Is everything okay?* | **Partial** — reassuring brief, but too many widgets |
| `/missions/[id]` | Mission Mode | *What needs my approval?* | **Poor** — reads like an AI ops terminal |
| — | Onboarding (“Start Growing”) | *How do I begin?* | **Missing** — not built |
| — | Reports | *Is my business growing?* | **Missing** — not built |
| — | Notifications | *What did Aura improve today?* | **Missing** — types only |

**Dormant code (not routed, but polluting mocks/tests):**

- Legacy `DashboardShell` + `mockData.ts` (SEO-adjacent autopilot copy)
- Sprint 015 scroll briefing (`mission-workspace/*` — department workflow, SEO scout cards)
- Mission Review modal (`mission-review/*` — simpler than Mission Mode, unused)

---

## Part 1 — Constitution violations by screen

### 1. Mission Control (`/`)

**Files:** `components/dashboard/MissionControl.tsx`, `components/mission-control/*`, `services/activity/activityEngine.ts`, `lib/mock-dashboard.ts`

#### What works (keep)

- Single primary CTA: **Review Mission**
- Morning Brief tone: improvements overnight, hours saved
- Mission reason in plain English (*“customers look for storage guidance before trusting a supplier”*)
- Calm visual system (light background, soft cards)

#### Violations

| Violation | Evidence | Constitution principle |
|-----------|----------|------------------------|
| **Duplicate mission information** | Priority mission in `MorningBrief` + full `MissionCard` below | One primary action, no overwhelm |
| **Process visibility** | `Growth Team Status` — 6 employees with progress bars and tasks | AI works quietly; customer sees outcomes |
| **SEO-adjacent metrics** | `Visibility trend`, `+14% growth`, `Validating search demand signals` | Hide technical SEO; sell peace of mind |
| **Live churn** | `Timeline Preview` auto-updates every engine tick | Calm; reduce cognitive load |
| **Metric decoding** | `Business Snapshot` — 5 tiles (growth, leads, visibility, hours, pending) | One screen = one question |
| **False affordances** | Sidebar: AI Team, Growth, Content, Website, Settings → `#` | No unnecessary decisions |
| **Employee framing** | “Your AI employees working right now” | Customer hires Aura, not a department org chart |

#### Cognitive load score: **Medium-high** (target: low)

The customer must scan: brief → mission card → 6 employee rows → 5 metrics → live timeline. That is **four information systems** for a screen that should answer: *Is everything okay?*

---

### 2. Mission Mode (`/missions/[id]`) — **critical drift**

**Files:** `components/mission-mode/*`, `lib/mock-mission-mode.ts`, `hooks/useMissionModeEngine.ts`

This is the active “Review Mission” destination. It was built as an immersive “AI Business OS.” The constitution says the opposite: **calm, minimal, outcomes only.**

#### Violations

| Violation | Evidence | Severity |
|-----------|----------|----------|
| **Literal SEO section** | Document section titled `"SEO"` with meta description, primary keyword, suggested URL | **P0 blocker** |
| **SEO/process jargon in live copy** | `"Tuning meta signals..."`, `"Keywords aligned"`, `"Reviewing SERP landscape..."`, `"high-intent keyword cluster"`, `"Optimiser improved meta description"` | **P0 blocker** |
| **Ranking language** | Aura insight: *"I think this guide could rank quickly."* | **P0 blocker** |
| **Seven-employee factory** | Mission Pipeline: Scout, Writer, Architect, Guardian, Optimiser, Analyst, Publisher | Process, not outcome |
| **Live terminal feed** | `Live AI Feed` — new event every ~3 seconds | Noise, not reassurance |
| **Fourth information channel** | Floating Aura assistant while pipeline + document + feed already run | Overwhelm |
| **Technical document structure** | Sections: Research, Outline, SEO, Internal Links — production brief, not approval | Wrong mental model |
| **Internal metrics exposed** | `94% confidence`, `97/100` Guardian score, `420 monthly searches` | Customer doesn’t need SEO toolkit metrics |
| **Cinematic deployment theater** | Scout → Writer → Guardian → Architect → Publisher checklist | Shows processes, not *“your guide is live”* |
| **Broken action** | `Request Changes` button not wired | Creates anxiety, erodes trust |
| **Visual loudness** | Dark gradients, particles, pulsing indicators — contradicts `AURA.md` (“avoid gradients”, “subtle only”) | Premium ≠ busy |
| **Brand implication** | “RankAura” + “rank quickly” reinforces SEO product, not growth manager | Positioning |

#### Cognitive load score: **Very high** (target: low)

The customer is asked to understand: 7 employees, ASCII progress bars, 8 document sections including SEO, a scrolling feed, typing Aura, confidence %, and deployment choreography — to answer: *What needs my approval?*

**The only decision that should exist:** *Is this good for my business?* → Approve or ask for changes.

---

### 3. Dormant Mission Workspace (Sprint 015 — not rendered)

**Files:** `components/mission-workspace/*`, `lib/mock-mission.ts`

`MissionWorkspacePage` only mounts `MissionMode`. The scroll briefing UI is orphaned but still in the repo and tests.

#### Violations if re-enabled

- `ScoutInsightCard`: Monthly searches, competition, intent, suggested angle
- `ArchitectChecklist`: H1/H2/H3 heading hierarchy
- `DepartmentWorkflow`: Per-department confidence scores
- `ArchitecturePlan`: “Suggested internal links”
- `BusinessImpactGrid`: 5 KPI tiles
- Writer outputs: *“Meta description prepared”*

**Recommendation:** Do not maintain two mission UIs. Archive or delete the scroll briefing layout after Mission Mode is replaced.

---

### 4. Legacy dashboard (not routed)

**Files:** `components/dashboard/DashboardShell.tsx`, `services/dashboard/mockData.ts`

Contains copy that directly violates the constitution:

- *"Reviewing today's rankings..."*
- *"Estimated organic visibility is improving."*
- *"Monitoring Google"*
- *"Optimising your website"*
- *"Strengthening internal links..."*

**Recommendation:** Archive or delete. Do not resurrect without copy rewrite.

---

### 5. Mission Review modal (not routed)

**Files:** `components/dashboard/mission-review/*`, `lib/mission-review.ts`

Constitutionally **closer to the target** than Mission Mode:

- “Why this matters”
- “Expected business impact”
- “What happens if you approve”
- Single approve flow

**Recommendation:** Use this content model as the template for the simplified approve screen — not the Mission Mode three-panel layout.

---

### 6. Missing screens (constitution-defined, not built)

| Screen | Constitution question | Gap |
|--------|----------------------|-----|
| Onboarding | *How do I start growing?* | No website / name / description flow |
| Reports | *Is my business growing?* | No business-update reports |
| Notifications | *What did Aura improve today?* | Types exist; no UI |

These are **future** — but the constitution says they must read like business updates, never SEO audits.

---

## Part 2 — Complete list of technical / SEO language in user-facing UI

### Must never appear (constitution “DO NOT SAY” equivalents found in codebase)

| String | Location |
|--------|----------|
| Section title **"SEO"** | `lib/mock-mission-mode.ts` → `MissionDocument.tsx` |
| `"Meta description: 158 characters"` | `lib/mock-mission-mode.ts` |
| `"Primary: research storage conditions"` | `lib/mock-mission-mode.ts` |
| `"Tuning meta signals..."` | `lib/mock-mission-mode.ts` |
| `"Keywords aligned"` | `lib/mock-mission-mode.ts` |
| `"Aligning keyword targets..."` | `lib/mock-mission-mode.ts` |
| `"Optimising snippet preview..."` | `lib/mock-mission-mode.ts` |
| `"Reviewing SERP landscape..."` | `lib/mock-mission-mode.ts` |
| `"Mapping search demand..."` | `lib/mock-mission-mode.ts` |
| `"Scout confirmed high-intent keyword cluster"` | `lib/mock-mission-mode.ts` |
| `"Optimiser improved meta description"` | `lib/mock-mission-mode.ts` |
| `"I think this guide could rank quickly."` | `lib/mock-mission-mode.ts` → `AuraAssistant.tsx` |
| `"Validating search demand signals"` | `services/activity/activityEngine.ts` |
| `"Preparing page metadata"` | `services/activity/activityEngine.ts` |
| `"Monthly searches"` / `"Intent"` / `"Competition"` | `ScoutInsightCard.tsx`, `types/mission.ts` |
| `"H1: Page title"` / `"H2: FAQ"` | `lib/mock-mission.ts`, `ArchitectChecklist.tsx` |
| `"Internal links"` / `"Internal linking"` (user-facing) | Multiple mission-workspace components |
| `"Meta description prepared"` | `lib/mock-mission.ts` |
| `"Heading structure reviewed"` | `lib/mock-mission.ts` |
| `"Reviewing today's rankings..."` | `services/dashboard/mockData.ts` |
| `"Estimated organic visibility"` | `services/dashboard/mockData.ts` |
| `"Monitoring Google"` | `services/dashboard/mockData.ts` |

### Borderline — replace with plain English

| Current | Preferred |
|---------|-----------|
| Visibility trend | More customers finding you |
| Estimated leads | Expected enquiries |
| 94% confidence | Aura is confident this will help |
| Mission Pipeline | (remove label — or “Progress”) |
| Live AI Feed | (remove — or “Recent updates” behind disclosure) |
| Growth Team Status | Your business is being looked after |
| Optimiser (employee name) | Hide behind Aura |
| Mission Mode | Review (no “mode” jargon) |
| Deploying Mission | Publishing your update |

---

## Part 3 — Cognitive load inventory

### Unnecessary decisions

| Location | Decision implied | Should be |
|----------|------------------|-----------|
| Mission Mode header | Approve vs Request Changes (one broken) | Approve or “Ask Aura to change something” |
| Approval panel (dormant) | Approve / Changes / Save For Later | Approve or one feedback path |
| Sidebar nav | 6 destinations (5 dead) | Dashboard only until routes exist |
| Mission document | Read 8 sections including SEO | Skim preview + outcome summary |
| Business Snapshot | Interpret 5 metrics | One reassurance line |

### Unnecessary information channels (Mission Mode)

1. Left pipeline (7 employees)
2. Centre document (8 sections)
3. Right live feed (auto-scroll)
4. Floating Aura assistant
5. Header status badges
6. Deployment overlay (5 steps)

**Target:** 1–2 channels maximum on the approve screen.

### Duplicate information (Mission Control)

| Duplicated content | Locations |
|--------------------|-----------|
| Today’s priority mission | `MorningBrief` + `MissionCard` |
| Team activity | `DepartmentActivityPanel` + `ActivityTimeline` |
| Progress reassurance | Brief improvements count + snapshot growth % |

### Animation / motion overload (Mission Mode)

- Animated gradients and particles (`MissionModeBackground.tsx`, `globals.css`)
- Pulsing status indicators (pipeline, feed dot)
- Feed entry animations every tick
- Aura typing animation
- Deployment cinematic sequence

**Constitution:** Micro-motion is fine when it reassures. Motion that demands attention violates calm.

---

## Part 4 — Features to simplify

| Feature | Current state | Simplified target |
|---------|---------------|-------------------|
| **Morning Brief** | Hero + priority mission box | Single card: greeting + one sentence + CTA |
| **Today's Mission card** | Full duplicate below brief | Merge into brief OR remove |
| **Growth Team Status** | 6 rows × progress | One line: *“Aura prepared 1 thing for you today”* |
| **Business Snapshot** | 5 metric tiles | One status: *“Growing steadily · ~14 enquiries/month expected”* |
| **Timeline Preview** | Live scrolling log | Latest 1–2 outcome sentences, static |
| **Mission Mode layout** | 3 panels + Aura | Single approve screen |
| **Mission document** | 8 sections incl. SEO | Customer preview + 2-sentence “why” |
| **Aura assistant** | Always-on typing widget | 1–2 sentences inline, no floating widget |
| **Deployment** | 5-employee checklist | *“Approved — your guide will go live soon”* |
| **Confidence %** | Shown in header | Move to Aura voice or hide |
| **Department names** | Scout, Writer, Architect… | Never shown by default; Aura speaks as “I” |

---

## Part 5 — Features to remove

| Feature | Path | Reason |
|---------|------|--------|
| **SEO document section** | `lib/mock-mission-mode.ts`, `types/mission-mode.ts` | Direct constitution violation |
| **Live AI Feed panel** | `LiveAIFeed.tsx` | Process noise |
| **Mission Pipeline (7 employees)** | `MissionPipeline.tsx` | Factory view, not growth manager |
| **Mission Mode background particles** | `MissionModeBackground.tsx` | Visual overwhelm |
| **Cinematic deployment employee checklist** | `MissionModeDeployment.tsx` | Process theater |
| **Orphan Mission Workspace scroll UI** | `components/mission-workspace/*` (except thin shell) | Two parallel mission UIs |
| **Legacy DashboardShell** | `components/dashboard/DashboardShell.tsx` | SEO copy, superseded |
| **Legacy mockData dashboard** | `services/dashboard/mockData.ts` | Rankings, organic visibility |
| **Dead sidebar links** | `config/navigation.ts` | False affordances |
| **ScoutInsightCard metrics UI** | `ScoutInsightCard.tsx` | Monthly searches, intent labels |
| **Architect H1/H2 checklist UI** | `ArchitectChecklist.tsx` | Web dev jargon |
| **BusinessImpactGrid (5 tiles)** | `BusinessImpactGrid.tsx` | Metric decoding |
| **Department Workflow cards** | `DepartmentWorkflow.tsx` | Process visibility |
| **Mission Mode engine tick** (user-facing) | `useMissionModeEngine` feed/pipeline updates | Simulated busyness increases anxiety |

**Keep in backend/services (hidden):** Writer `seo-reviewer` module, Scout models, Optimiser employee — internal architecture only, never surfaced.

---

## Part 6 — Refactoring roadmap

### Phase 0 — Constitution freeze (1 sprint, no new features)

**Goal:** Stop the bleeding. Align docs, mocks, and copy with constitution.

| # | Action | Files |
|---|--------|-------|
| 0.1 | Add constitution reference to `AURA.md` — resolve conflict with ADR-028 (immersive OS vs calm) | `docs/AURA.md`, `docs/DECISIONS.md` |
| 0.2 | Purge all SEO/SERP/keyword/meta strings from user-facing mocks | `lib/mock-mission-mode.ts`, `activityEngine.ts` |
| 0.3 | Mark Mission Mode as **deprecated UX** in `PROJECT_STATUS.md` | `docs/PROJECT_STATUS.md` |
| 0.4 | Freeze feature development until Phase 1 design sign-off | Team process |

**Exit criteria:** Zero constitution-violating strings in any mock that feeds UI.

---

### Phase 1 — Mission approve screen rewrite (highest priority)

**Goal:** Answer *“What needs my approval?”* in under 60 seconds.

| # | Action |
|---|--------|
| 1.1 | Replace `MissionMode` three-panel layout with **single calm approve screen** |
| 1.2 | Content model from Mission Review modal: why → preview → expected outcome → approve |
| 1.3 | Aura speaks in first person: *“I prepared this because…”* — not department names |
| 1.4 | Customer-facing preview only (draft body) — no Research/SEO/Internal Links sections |
| 1.5 | Two actions: **Approve** and **Ask for changes** (both wired) |
| 1.6 | Approval confirmation: business outcome (*“More customers will find answers about storage”*) — not employee deployment |
| 1.7 | Remove: pipeline, live feed, floating Aura, particles, cinematic deployment |
| 1.8 | Entrance from dashboard: simple fade — not “Mission Mode” branding |

**Target layout:**

```
┌─────────────────────────────────────────────┐
│  ← Back          Ready for you              │
│                                             │
│  [Aura brief — 2 sentences, first person]   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Customer preview (document)        │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  What this means for your business          │
│  · More enquiries from people researching   │
│    storage before they buy                  │
│                                             │
│  [ Approve ]    [ Ask for changes ]         │
└─────────────────────────────────────────────┘
```

**Exit criteria:** User can approve without seeing employee names, SEO terms, or live feeds.

---

### Phase 2 — Mission Control simplification

**Goal:** Answer *“Is everything okay?”* in one glance. **Do not add widgets.**

| # | Action |
|---|--------|
| 2.1 | Merge `MorningBrief` + `MissionCard` into one hero |
| 2.2 | Replace `Growth Team Status` with single reassurance line |
| 2.3 | Replace `Business Snapshot` 5-tile grid with one growth status sentence |
| 2.4 | Replace live `Timeline Preview` with latest win (static, max 2 items) |
| 2.5 | Rewrite `activityEngine` activity strings — outcomes only |
| 2.6 | Remove or disable dead sidebar links |
| 2.7 | Stop live engine tick on dashboard (or slow to near-static) |

**Exit criteria:** Dashboard shows greeting + status + one mission + one CTA. No employee progress bars.

---

### Phase 3 — Codebase hygiene

**Goal:** One mission UI, one dashboard, no zombie components.

| # | Action |
|---|--------|
| 3.1 | Archive `components/mission-mode/*` after Phase 1 replacement |
| 3.2 | Archive orphan `mission-workspace/*` briefing components |
| 3.3 | Delete or archive `DashboardShell`, `mockData.ts` legacy |
| 3.4 | Consolidate mission mocks: one source of truth in `lib/mock-mission.ts` |
| 3.5 | Update tests to assert constitution compliance (no banned strings) |
| 3.6 | Add `lint:copy` or test guard for SEO jargon in `components/` and `lib/` |

---

### Phase 4 — Missing constitution screens (after simplification)

**Goal:** Complete the three-question product loop.

| # | Screen | Constitution question | Notes |
|---|--------|----------------------|-------|
| 4.1 | Onboarding | Start Growing — website, name, description | 3 fields + one button |
| 4.2 | Reports | Is my business growing? | Business update format, not audit |
| 4.3 | Notifications | What did Aura improve today? | Stress-reducing, outcome copy |

**Do not start Phase 4 until Phases 1–2 are complete.**

---

### Phase 5 — Positioning and naming (strategic)

| # | Question | Options |
|---|----------|---------|
| 5.1 | Product name “RankAura” implies ranking | Consider sub-brand “Aura” customer-facing |
| 5.2 | Employee names in UI | Aura only; employees internal |
| 5.3 | “Mission” vs “Update” vs “Approval” | Test with non-SEO business owners |

---

## Part 7 — Priority matrix

| Priority | Theme | Customer impact | Effort |
|----------|-------|-----------------|--------|
| **P0** | Remove SEO jargon from all UI mocks | Confidence ↑↑ | Low |
| **P0** | Replace Mission Mode with calm approve screen | Stress ↓↓ | Medium |
| **P1** | Simplify Mission Control widgets | Calm ↑ | Medium |
| **P1** | Wire all customer actions or remove buttons | Trust ↑ | Low |
| **P2** | Archive duplicate/legacy UI | Maintainability | Medium |
| **P2** | Constitution copy lint in CI | Prevent regression | Low |
| **P3** | Onboarding flow | Growth ↑ | High |
| **P3** | Reports + notifications | Retention ↑ | High |

---

## Part 8 — Success metrics

| Metric | Current (estimated) | Target |
|--------|---------------------|--------|
| Time to approve a mission | 3–10 min (read pipeline, doc, feed) | < 2 min |
| User-facing information channels on approve screen | 6 | 1–2 |
| SEO jargon strings in active UI mocks | 20+ | 0 |
| Employee names shown during approve | 7 | 0 |
| Dashboard widgets requiring interpretation | 5+ | 1 status line |
| Customer decisions on approve screen | Understand factory + approve | Approve or change |

---

## Part 9 — What we are NOT doing

- Building more dashboard widgets
- Building Mission Mode v2 (particles, feeds, pipelines)
- Exposing Writer SEO reviewer, Scout metrics, or Architect hierarchy to customers
- Adding technical charts, keyword tools, or audit PDFs
- Maintaining two parallel mission UIs
- Any feature that fails the constitution checklist

---

## Part 10 — Immediate next step

**When implementation resumes:**

1. Read this plan and `AURA.md` together
2. Execute **Phase 0** (mock copy purge + doc alignment)
3. Design sign-off on Phase 1 wireframe (single approve screen)
4. Implement Phase 1 only — no parallel feature work

**Until then: no code.**

---

## Appendix A — File reference for auditors

| Area | Paths |
|------|-------|
| Mission Control | `components/dashboard/MissionControl.tsx`, `components/mission-control/*` |
| Mission Mode (replace) | `components/mission-mode/*` |
| Orphan workspace | `components/mission-workspace/*` |
| Mocks | `lib/mock-dashboard.ts`, `lib/mock-mission.ts`, `lib/mock-mission-mode.ts` |
| Activity engine | `services/activity/activityEngine.ts` |
| Constitution | `docs/AURA.md`, this document |
| Navigation | `config/navigation.ts` |
| Legacy | `components/dashboard/DashboardShell.tsx`, `services/dashboard/mockData.ts` |

---

## Appendix B — Constitution-aligned copy examples

**Notifications (future):**
> Great news. I've improved your homepage today.

**Reports (future):**
> This month more people found your business online. I published one new guide and fixed two pages that were confusing visitors.

**Approve screen (target):**
> I prepared this guide because customers often ask how to store materials safely. If you approve, I'll publish it to your website.

**Dashboard status (target):**
> Everything is on track. One thing needs your attention — about 2 minutes.

---

*End of RankAura Simplicity Plan.*
