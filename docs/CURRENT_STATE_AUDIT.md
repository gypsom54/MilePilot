# Current State Audit — SEO AutoPilot Delivery Planning

**Date:** 2026-07-30  
**Mode:** Read-only repository inspection (no application code changed during audit)  
**Scope:** Entire `MilePilot` repository as found on `main`, including MilePilot product, SEO AutoPilot monorepo layer, and untracked experiments  

**Related existing documents (do not duplicate):**

- `docs/seo-autopilot/PLATFORM_ARCHITECTURE_AUDIT.md` — Engineering Bible baseline architecture checkpoint
- `docs/seo-autopilot/VOLUME_*.md` — engine authority
- `docs/seo-autopilot/ASK_SEO_AUTOPILOT.md` — Ask implementation lock
- MilePilot locks under `docs/MP-*`, `docs/CRITICAL_FILES.md`

---

## 1. Product name and branding (confirmed by code)

| Name | Where it appears | Role |
| --- | --- | --- |
| **MilePilot** | Root `package.json` (`"name": "milepilot"`), `README.md`, `frontend/`, `website/`, Expo shell, backend email | **Production product** in this repository |
| **Ask MilePilot** | `frontend/js/ask-milepilot-*.js`, MilePilot nav | Production Ask surface for mileage product |
| **SEO AutoPilot** | `SEO_AUTOPILOT_README.md`, `docs/seo-autopilot/`, `@seo-autopilot/*` packages, `apps/web` | **Engine/platform product** under active Engineering Bible delivery — **Sprint D1 customer shell + Learning Centre now in `apps/web`** |
| **Ask SEO AutoPilot** | Volume 3 + `services/ask-autopilot` scaffold | Spec locked — **must not implement** until authorised |
| **RankAura** | Untracked `rankaura-web/.next` HTML titles (“RankAura — Your AI Growth Engine”, “Ask RankAura”) | Experimental / abandoned-looking **build remnant**, not source-controlled |

**Inconsistency (document only — do not resolve yet):** Three product identities coexist (MilePilot, SEO AutoPilot, RankAura). Customer-planning language in this delivery pack refers to **SEO AutoPilot**; the git root and shipped PWA remain **MilePilot**.

---

## 2. Stack inventory

| Item | Finding | Confidence |
| --- | --- | --- |
| Package managers | Root uses **npm** scripts for MilePilot; SEO AutoPilot workspace uses **pnpm** (`pnpm-workspace.yaml`) | Confirmed by code |
| MilePilot native | Expo `~56.0.12`, React `19.2.3`, React Native `0.85.3` | Confirmed by `package.json` |
| MilePilot customer UI | Vanilla HTML/JS/CSS PWA in `frontend/` (not React SPA); version `8.43.69` | Confirmed by code |
| MilePilot styling | Inline CSS + `frontend/css/mp-design-system.css`, dark blue brand tokens | Confirmed by code |
| MilePilot routing | Single-page `showScreen(id)` — no React Router / Next | Confirmed by code |
| Backend | Express (`backend/`), report/email APIs | Confirmed by code |
| SEO AutoPilot | TypeScript monorepo: `apps/`, `packages/`, `services/`, `tests/seo-autopilot/` | Confirmed by code |
| SEO AutoPilot web | `apps/web` — **React + Vite + TypeScript** customer shell (Sprint D1): Home, Learning Centre, FAQ routes | Confirmed by code (updated 2026-07-30 Sprint D1) |
| SEO AutoPilot UI/auth | `packages/ui`, `packages/auth` — scaffold-only | Confirmed by code |
| RankAura | Next.js **15.x** build under untracked `rankaura-web/` — **no `package.json` / source** | Confirmed by filesystem; experimental |
| ESLint config | No root/frontend eslint scripts found | Confirmed by search |
| SEO typecheck | `pnpm run build:seo-autopilot` (`tsc -b`) | Confirmed by code |

---

## 3. Existing pages / layouts / components

### MilePilot (`frontend/`) — production

Screens include: welcome/onboarding sequence, home (Command Centre), Ask, Business, Tracking, Reports, History, Settings, debug screens.

Reusable-ish modules under `frontend/js/` (Ask MilePilot, business workspace, tracking, reports, design system).

### SEO AutoPilot customer UI

**Sprint D1 delivered** in `apps/web`: calm AppShell, Home (`/`), Learning Centre (`/learn`), FAQ articles (`/learn/:slug`).  
**Sprint D3 delivered:** Website Discovery (`/discover`, `/discover/summary`) and Workspace shell (`/workspace`).  
**Sprint D4 delivered:** Personal Workspace daily briefing on `/workspace`.  
**Sprint D5 delivered:** Ask SEO AutoPilot mock conversational UI on `/ask`.  
**Sprint D6 delivered:** Opportunity Engine mock prioritisation on `/opportunities` (+ detail routes), wired into Workspace opportunities section. No auth, Google connections, or SEO scores. `packages/ui` remains scaffold-only.

### RankAura (untracked build)

Compiled routes appear to include `/`, `/onboarding`, `/workspace`, `/growth-plan`, `/design-system`. **Not preservable as source** without recovering the missing application source.

---

## 4. Onboarding / dashboard / Ask

| Capability | MilePilot | SEO AutoPilot | RankAura (untracked) |
| --- | --- | --- | --- |
| Onboarding | Full multi-step flow | Not present | Built pages only |
| Dashboard / workspace | Command Centre + Business workspace | Not present | Built pages only |
| Ask interface | Ask MilePilot (production) | Ask SEO AutoPilot **locked** (scaffold only) | Ask RankAura in build HTML |

---

## 5. API / persistence / auth / integrations

| Area | Status |
| --- | --- |
| SEO AutoPilot API | In-process composition API in `apps/api` (`handleApiRequest`) — **not** a public HTTP server |
| Engine APIs | BD / MI / WI / Crawl / KG handlers (in-memory) |
| Database | In-memory stores in `@seo-autopilot/database` + KG canonical store — **no durable DB** |
| Auth | SEO `packages/auth` scaffold; MilePilot localStorage identity; no OAuth login found |
| Google Search Console / Analytics / Business Profile / Ads | **No live OAuth or API integration** for SEO AutoPilot found |
| Google Maps key | Present for MilePilot native maps (`GOOGLE_MAPS_API_KEY` in Expo config) — unrelated to SEO GSC/GA |
| Analytics (gtag etc.) | Not found in MilePilot frontend |

---

## 6. Environment variables (names only)

Documented / referenced (no secrets recorded here):

- MilePilot backend: `RESEND_API_KEY`, `EMAIL_FROM`, `FEEDBACK_TO`, `PORT`
- Expo: `WEB_APP_URL`, `EAS_PROJECT_ID`, `GOOGLE_MAPS_API_KEY`
- Deploy docs: `CLOUDFLARE_API_TOKEN`
- Monitoring plan only: `SENTRY_DSN`, `ADMIN_API_KEY`
- No `.env.example` for SEO AutoPilot Google connectors (because they do not exist)

---

## 7. Test / build / lint results (this audit run)

| Command | Result | Confidence |
| --- | --- | --- |
| `pnpm run build:seo-autopilot` | **PASS** (clean) | Confirmed by tests |
| `pnpm run test:seo-autopilot` | **PASS** — 86/86 | Confirmed by tests |
| `npm run test:production-boot-syntax` | **PASS** — 6/6 | Confirmed by tests |
| Full `npm run test:vital` | Not re-run in this audit (long MilePilot suite); scripts exist | Unknown this run |
| Lint | No dedicated lint script/config found for SEO AutoPilot or frontend | Confirmed by code |
| Production customer build for SEO AutoPilot UI | **N/A** — no UI app | Confirmed by code |

---

## 8. What currently works

**Confirmed by code + tests**

- SEO AutoPilot Intelligence Engines (Sprints 1–5): Business Discovery, Market Intelligence, Website Intelligence, Crawl Intelligence, Knowledge Graph Engine
- Event bus, engine registry, in-memory persistence, capability manifests
- Architecture baseline checkpoint accepted (no foundation refactor sprint)
- MilePilot production PWA boot syntax + extensive MilePilot vital test suite (scripts present)
- Ask MilePilot in MilePilot product

**Incomplete for SEO AutoPilot customer product**

- Customer web app / layouts / design system
- Ask SEO AutoPilot orchestration (locked)
- Auth, multi-tenant durable persistence
- Google connections
- Business Health UI, Opportunity Queue UI, Weekly/Monthly customer letters, Growth Timeline UI
- Learning Centre / FAQ product surface

**Broken / risky**

- Untracked `rankaura-web/` without source — cannot be treated as the product foundation
- Dual branding risk if RankAura artifacts are mistaken for SEO AutoPilot
- SEO AutoPilot API is library-style, not a deployed HTTP product API

**Experimental**

- `rankaura-web/`
- Multiple MilePilot zip upload mirrors at repo root
- SEO AutoPilot stub engines (authority, reviews, opportunity, ask-autopilot, etc.)

---

## 9. What should be preserved

- MilePilot production paths (`frontend/`, `backend/`, tracking/report contracts) — **do not touch** unless a MilePilot sprint says so
- SEO AutoPilot engine packages and Bible volumes
- `docs/seo-autopilot/PLATFORM_ARCHITECTURE_AUDIT.md` checkpoint posture
- Ask SEO AutoPilot **implementation lock** until explicitly unlocked
- Working MilePilot Ask (separate product surface)

## 10. What should not be touched yet

- MilePilot tracking / reports / tax engine / locked UI
- Ask SEO AutoPilot orchestration implementation
- Google Ads campaign management
- Bulk rename of MilePilot ↔ SEO AutoPilot ↔ RankAura
- Durable database migration (no Database Bible sprint approved here)
- RankAura revival without recovered source + branding decision

---

## 11. Immediate delivery risks

1. **No SEO AutoPilot customer UI** — planning assumes a product front door that does not exist in-repo.  
2. **Ask is the planned front door but is Engineering-locked** — MVP cannot honestly centre on Ask until Volume 3 is authorised.  
3. **Google connections have zero infrastructure** — blocked for early sprints.  
4. **Name collision** (MilePilot / SEO AutoPilot / RankAura) can cause wrong-surface edits.  
5. **In-memory only** — demos reset; not multi-user production.  

---

## 12. Documented product direction vs codebase mismatch

| Planning expectation | Repository reality |
| --- | --- |
| Ask SEO AutoPilot as primary interface | Spec locked; scaffold only |
| Calm customer workspace / Home | Not present for SEO AutoPilot |
| Onboarding + Business Growth Profile UI | BD engine exists; **no UI** |
| Business Health / Opportunity Queue | Opportunity engine stub only; no UI |
| Weekly / monthly customer updates | Not present |
| Learning Centre / FAQ | Not present as product pages |
| Google GSC / GA / GBP / Ads | Not implemented |
| Trusted adviser tone in UI | No SEO AutoPilot UI to carry tone |

**Conclusion:** The Engineering Bible + engines are ahead of the customer product shell. Delivery must start by establishing a real customer surface on top of existing engines — without inventing Ask or Google.

---

## 13. Evidence classification summary

| Class | Examples |
| --- | --- |
| Confirmed by code | Stack versions, scaffolds, engine APIs, Ask lock docs, branding strings |
| Confirmed by tests | SEO AutoPilot 86/86; MilePilot production-boot syntax |
| Inferred but not verified | Full MilePilot `test:vital` green on this machine this run; RankAura source history |
| Unknown | Intended long-term home of SEO AutoPilot UI; whether RankAura source exists elsewhere; production hosting plan for SEO AutoPilot web |

---

## 14. Missing information that blocks some planning

1. Approved UX / visual Bible for SEO AutoPilot (packages/ui explicitly waits for this).  
2. Decision: framework and location for SEO AutoPilot customer app.  
3. Decision: when Volume 3 Ask may be unlocked.  
4. Google Cloud project / OAuth consent / API scopes availability.  
5. Durable persistence strategy for multi-customer MVP.
