# SEO AutoPilot — Platform Architecture Audit

**Audit date:** 2026-07-28  
**Baseline:** `main` @ post–Sprint 5 (Knowledge Graph Engine / Volume 8)  
**Scope:** Architecture verification only — **no Sprint 7 implementation**  
**Authority:** Product Bible + Engineering Bible Volumes 3–8 + codebase

---

## 1. Executive verdict

| Area | Verdict |
| --- | --- |
| Package / TypeScript dependency DAG | **Healthy** — no cycles; correct layering |
| Engine ↔ engine coupling | **Healthy** — no service→service imports |
| Observation / knowledge / recommendation law | **Mostly held** in domain engines; dual KG path is the main violation risk |
| Multi-tenant consistency | **Weak** — Business Discovery lacks tenant isolation |
| Knowledge Graph ownership (Volume 8) | **Partial** — canonical engine exists; domain engines still upsert projections |
| Shared infrastructure maturity | **Immature** — duplicated API/event/URL helpers across engines |
| Test architecture | **Solid for Sprints 1–5**; empty perf/regression; no platform boundary suite |
| Naming / folder consistency | **Debt** on `crawl` and `knowledge-graph-engine` |

**Overall:** The platform is coherent enough to continue, but **must not** start Ask, Opportunity, or further domain engines without resolving the **dual Knowledge Graph**, **Business Discovery tenancy**, and **shared API/event plumbing** debt called out below.

---

## 2. Inventory

### 2.1 Implemented engines (5)

| Registry name | Package | Folder | API prefix | Volume |
| --- | --- | --- | --- | --- |
| `business-discovery` | `@seo-autopilot/business-discovery` | `services/business-discovery` | `/business-discovery` | 4 |
| `market-intelligence` | `@seo-autopilot/market-intelligence` | `services/market-intelligence` | `/market-intelligence` | 5 |
| `website-intelligence` | `@seo-autopilot/website-intelligence` | `services/website-intelligence` | `/website-intelligence` | 6 |
| `crawl-intelligence` | `@seo-autopilot/crawl` | `services/crawl` | `/crawl-intelligence` | 7 |
| `knowledge-graph` | `@seo-autopilot/knowledge-graph-engine` | `services/knowledge-graph-engine` | `/knowledge-graph` | 8 |

Composition root: `apps/api/src/index.ts` (`createPlatformRuntime` / `handleApiRequest`).

### 2.2 Scaffolds only (7)

`ask-autopilot`, `authority`, `community`, `competitor`, `opportunity`, `performance`, `reviews` — `ENGINE_NOT_IMPLEMENTED` stubs; no domain, API, manifest, or composition.

### 2.3 Shared packages

| Package | Role |
| --- | --- |
| `@seo-autopilot/shared` | Events, bus, logging, config, `EngineResult`, field provenance |
| `@seo-autopilot/engine-sdk` | `IntelligenceEngine`, registry, capability types |
| `@seo-autopilot/knowledge-graph` | Projection SDK + domain mappings + **canonical** store/identity/query |
| `@seo-autopilot/database` | In-memory stores for BD / MI / WI / crawl |
| `@seo-autopilot/ai` | Prompt framework (tests + unused stub deps) |
| `@seo-autopilot/auth`, `@seo-autopilot/ui` | Scaffolds unused by engines |

---

## 3. Engine boundaries and ownership

### 3.1 Locked law (Volumes 3–8)

```text
Observation records what was seen.
Knowledge explains what it means.
Recommendations decide what to do.
```

| Engine | Layer | Owns | Must not |
| --- | --- | --- | --- |
| Business Discovery | Knowledge (business) | Canonical business understanding | SEO analyse, content, optimisation |
| Market Intelligence | Observation/knowledge (market) | External market observations | Mutate BD truth; strategy; live crawl |
| Website Intelligence | Knowledge (website structure) | Structural/semantic website model | Crawl/fetch; SEO scoring; overwrite BD/MI |
| Crawl Intelligence | Observation | Sourced immutable crawl observations | Judgement; SEO scoring; overwrite WI; live network crawl |
| Knowledge Graph | Semantic memory | Canonical entities/relationships, evidence, merges | Domain SEO/crawl/business/market logic; auto-merges; recommendations |

### 3.2 Boundary verification

| Check | Result | Severity |
| --- | --- | --- |
| All implemented engines refuse `recommend()` with `ENGINE_DOES_NOT_RECOMMEND` | Pass | — |
| No service imports another engine package | Pass | — |
| Domain engines communicate via Event Bus + composition root, not direct calls | Pass (publish-only today) | info |
| MI/WI/Crawl assert external facts untouched | Pass | — |
| Volume 8: only KG creates/changes **canonical** entities | **Fail in practice** — domain sync still upserts projection graph | **high** |
| BD tenant isolation matches other engines | **Fail** — no `tenantId` on BD store/API list | **blocker** |

### 3.3 Ownership leak detail — dual Knowledge Graph

```text
apps/api createPlatformRuntime()
  ├─ businessDiscovery.graph  ──InMemoryKnowledgeGraph──┐
  ├─ marketIntelligence(graph)  upsert via sync.ts      │  projection plane
  ├─ websiteIntelligence(graph) upsert via sync.ts      │
  ├─ crawlIntelligence(graph)   upsert via sync.ts      │
  └─ knowledgeGraph.store ──InMemoryCanonicalKnowledgeStore──  canonical plane
```

- Volume 8 documents migration of domain syncs to propose-only as **deferred**.
- There is **no bridge** from projection nodes → canonical proposals.
- Risk: Ask / future engines may read the wrong plane and bypass evidence, identity, and merge rules.

**Required before Ask (Volume 3):** choose one semantic memory plane, or define an explicit projection→canonical ingest owned by the Knowledge Graph Engine.

---

## 4. Event flow

### 4.1 Catalog health

| Group | Count | Published by |
| --- | --- | --- |
| Business Discovery | 10 | BD service |
| Market Intelligence | 19 | MI service |
| Website Intelligence | 24 | WI service |
| Crawl Intelligence | 12 + `PageCrawled` alias | Crawl service |
| Knowledge Graph | 12 | KG engine |
| Platform stubs | 5 | **never published** |

### 4.2 Consistency findings

| Finding | Severity |
| --- | --- |
| Publish helpers share shape: `name`, `payload`, `occurredAt`, `source`, optional `correlationId` | info |
| Stable `source` strings per engine | pass |
| BD never passes `correlationId` into publishes | **high** |
| MI/WI/Crawl/KG include correlation + tenant references more consistently | pass |
| No production subscribers — bus is publish-only (tests subscribe) | medium |
| Stub engines declare overlapping `AIRecommendationGenerated` | low |
| `PageCrawled` retained as crawl compatibility alias | info |
| Docs (`EVENTS.md`) show bus import from `engine-sdk` while canonical home is `shared` | low |

### 4.3 Event flow diagram (current)

```text
[Engine Service] --publish--> [InMemoryEventBus]
                                    │
                                    ├── (no cross-engine subscribers in production)
                                    └── tests subscribeAll for contract assertions
```

---

## 5. Knowledge Graph interactions

| Path | Mechanism | Compliant with Volume 8? |
| --- | --- | --- |
| Domain save → `*Repository` → `sync*ToKnowledgeGraph` → `upsertEntity` | Direct projection mutate | **No** (deferred exception) |
| KG API → `proposeEntity` / `proposeRelationship` | Evidence-gated canonical write | **Yes** |
| KG merge proposals | Confirm required | **Yes** |
| Cross-engine canonical mutation | Refused | **Yes** (canonical plane only) |

Additional issues:

- `KnowledgeGraphSdk` interface omits `upsertEntity` / `createRelationship`, but sync adapters call them on `InMemoryKnowledgeGraph` (**SDK contract drift** — medium).
- Domain entity-type constants live in `@seo-autopilot/knowledge-graph` mappings — acceptable as shared vocab, but reinforces projection-centric access.

---

## 6. Dependency direction

```text
apps/api
  → services/{business-discovery, market-intelligence, website-intelligence, crawl, knowledge-graph-engine}
  → packages/{engine-sdk, shared}

services/{bd,mi,wi,crawl}
  → packages/{database, engine-sdk, knowledge-graph, shared}

services/knowledge-graph-engine
  → packages/{engine-sdk, knowledge-graph, shared}

packages/{engine-sdk, knowledge-graph, ai}
  → packages/shared

packages/{shared, database, auth, ui}
  → (leaf)
```

| Check | Result | Severity |
| --- | --- | --- |
| Circular package.json deps | None | — |
| Circular tsconfig project references | None | — |
| Circular source imports across `@seo-autopilot/*` | None | — |
| Service → service deps | None | — |
| Package → service / app deps | None | — |
| Soft coupling: API shares BD projection graph instance into MI/WI/Crawl | Present | medium |
| Stub engines depend on unused `@seo-autopilot/ai` | Present | low |

**Circular dependency detection: PASS.**

---

## 7. Shared package usage and duplication

### 7.1 Should move to shared infrastructure

| Duplicated concern | Locations | Recommendation |
| --- | --- | --- |
| `ApiRequest` / `ApiResponse` | `apps/api` + 5 engine handlers | Shared HTTP boundary types in `engine-sdk` or `shared` |
| `fromResult` status mapping | 5× handlers (400 vs 422 drift) | Single `engineResultToHttpResponse` helper |
| `publish*Event` wrappers | 5× `events/publish.ts` | Generic `publishPlatformEvent(bus, source, …)` in `shared` |
| `corr()` / tenantId extraction | Most handlers | Shared API request helpers |
| `normaliseUrl` | crawl + website-intelligence | Shared URL util (observation-safe) |
| Composition boilerplate | 5× near-identical runtimes | Optional `createEngineRuntime` factory (later) |

### 7.2 Correctly engine-local today

- Crawl redaction (`domain/redaction.ts`)
- Crawl adapters / scope validation
- BD enrichment suggestion flow
- KG canonical merge / identity / evidence rules (in package + engine)

### 7.3 Package doc drift

- `ARCHITECTURE.md` still describes `database` as placeholder — it has real schemas (**low**).
- `DATABASE_PACKAGE_STATUS` still `crawl-intelligence-sprint4` after Sprint 5 (**low**).

---

## 8. Repository and persistence boundaries

| Engine | Store | Repository | Persistence shape |
| --- | --- | --- | --- |
| BD | `InMemoryBusinessDiscoveryStore` | yes | JSON profile + versions; **no tenantId** |
| MI | `InMemoryMarketIntelligenceStore` | yes | tenant-scoped JSON + versions |
| WI | `InMemoryWebsiteIntelligenceStore` | yes | tenant-scoped JSON + versions |
| Crawl | `InMemoryCrawlIntelligenceStore` | yes | tenant-scoped JSON + versions |
| KG | `InMemoryCanonicalKnowledgeStore` | no separate repo | typed canonical entities in KG package |

| Finding | Severity |
| --- | --- |
| BD `BUSINESS_DISCOVERY_TABLES` lists many logical tables; store only implements businesses + versions (document model) | medium |
| KG canonical store not under `packages/database` | info (acceptable for Sprint 5; align later) |
| All stores in-memory only — durable DB deferred | info |

---

## 9. API consistency

| Concern | Status | Severity |
| --- | --- | --- |
| Path style `/{engine}/…` + `/manifest` | Consistent | — |
| Handlers thin vs service | Mostly; crawl embeds adapter construction + `/start` stub message | medium |
| `tenantId` required | MI/WI/Crawl/KG yes; **BD no** | **blocker** |
| `ApiRequest` shape | BD lacks `query`; others vary | medium |
| HTTP error mapping | BD/MI use 422 default; WI/Crawl/KG use 400 | medium |
| Correlation ID from body | MI/WI/Crawl/KG yes; BD no | high (with events) |

---

## 10. Domain event consistency

| Rule | Status |
| --- | --- |
| Canonical names in `PlatformEventName` | Pass |
| Engine `events` arrays align with publishers | Pass for implemented engines |
| Correlation IDs on multi-step workflows | Fail for BD |
| Sensitive payloads excluded from crawl events | Pass (redaction before persist/publish) |
| Unused platform stub events | Present — reserve or remove before Ask |

---

## 11. Capability Manifest consistency

Shared schema (`CapabilityManifest` in `engine-sdk`) used by all five implemented engines: pass.

| Drift | Severity |
| --- | --- |
| Verb conventions differ (`build_*` / `observe_*` / `propose_*` / policy-like crawl capabilities) | medium |
| BD `consumes` omits `tenant_context` | high (with tenancy gap) |
| Crawl lists policy guarantees as capabilities (`redact_sensitive_headers`) | low |
| Shared confidence/risk/approval defaults | pass |

Ask (Volume 3) discovery will be harder until capability naming is normalised and BD includes tenant context.

---

## 12. Naming consistency

| Identity | Issue | Severity |
| --- | --- | --- |
| Folder/package `crawl` vs registry/API/manifest `crawl-intelligence` | Import path ≠ engine identity | **high** |
| Folder/package `knowledge-graph-engine` vs registry/API `knowledge-graph` vs package `@seo-autopilot/knowledge-graph` (SDK) | Easy to confuse service vs SDK | **high** |
| `registerKnowledgeGraphEngine` vs `registerCrawlIntelligence` naming | Suffix inconsistency | low |

**Recommended rename direction (future sprint, not this audit):**

- Package/folder → `@seo-autopilot/crawl-intelligence` / `services/crawl-intelligence`
- Keep SDK as `@seo-autopilot/knowledge-graph`; consider engine package `@seo-autopilot/knowledge-graph` only if SDK moves to `@seo-autopilot/knowledge-graph-sdk` — or keep current split but document it as law in ARCHITECTURE.md

---

## 13. Folder structure consistency

**Domain engines (BD/MI/WI/Crawl) — aligned:**

```text
src/{api,domain,events,knowledge-graph,repository,validation}
    capability-manifest.ts, composition.ts, engine.ts, service.ts, index.ts
```

**Divergences:**

| Item | Severity |
| --- | --- |
| KG engine lacks `domain/` / `repository/` / `validation/` (logic in service + package canonical modules) | medium |
| BD has `enrichment/`; Crawl has `adapters/` | low (domain-appropriate) |
| Crawl `validation/scope.ts` vs peers `validate.ts` | low |
| Scaffolds are flat `src/index.ts` only | info |

---

## 14. Test architecture

### 14.1 Inventory (post–Sprint 5)

| Suite | Count (approx) | Notes |
| --- | --- | --- |
| Unit | 11 files | Validation, URL, redaction, identity, bus, logger, KG SDK |
| Integration | 13 files | API + flow per engine; MI/crawl repository; prompts |
| Contract | 6 files | Per implemented engine + BD-centric generic contract |
| Performance | empty | `.gitkeep` only |
| Regression | empty | `.gitkeep` only |

### 14.2 Gaps

| Gap | Severity |
| --- | --- |
| No platform architecture-boundary tests (forbid service→service imports; enforce propose-only KG policy; tenancy) | medium |
| Generic `intelligence-engine.contract` only registers BD | medium |
| WI missing dedicated repository integration test | medium |
| Stub engines have no contract coverage | high (before enabling them) |
| Performance / regression suites empty despite TESTING.md | info |

---

## 15. Severity rollup

### Blocker

1. **Business Discovery has no tenant isolation** while all later engines require `tenantId`.

### High

2. **Dual Knowledge Graph** (projection upserts vs canonical propose) with no bridge — Volume 8 ownership incomplete.  
3. **Naming debt:** `crawl` ≠ `crawl-intelligence`; `knowledge-graph-engine` ≠ `knowledge-graph` SDK.  
4. **BD correlation IDs missing** on event publishes.

### Medium

5. Soft shared projection-graph wiring in `apps/api`.  
6. SDK interface missing methods used by sync adapters.  
7. Duplicated API/event/URL helpers and HTTP status-map drift.  
8. BD phantom table list vs document store.  
9. Capability verb / `consumes` inconsistency.  
10. Crawl adapter orchestration in API handlers.  
11. Missing platform boundary tests; WI repository test; generic contract coverage.

### Low / info

12. Unused stub `ai` deps; unused auth/ui; empty perf/regression; doc placeholder drift; register* naming; policy-as-capability crawl entries.

---

## 16. Recommended remediation order (not Sprint 7)

Do **not** implement Sprint 7 until these are sequenced:

1. **Tenancy for Business Discovery** (blocker).  
2. **Knowledge Graph consolidation plan** — either:
   - migrate domain syncs to KG propose APIs, or  
   - formally redefine projection graph as non-canonical with a sync worker into canonical memory.  
3. **Shared HTTP/event helpers** + unify error mapping and `ApiRequest`.  
4. **Naming alignment** for crawl and KG packages (compat shims ok).  
5. **Platform architecture-boundary test suite**.  
6. **Capability Manifest style guide** for Ask readiness.  
7. Only then: next domain volume / Sprint 7+.

---

## 17. What this audit deliberately does not do

- Does not implement Sprint 7 or any new engine.  
- Does not rename packages in this change set.  
- Does not migrate projection writes to propose-only (requires an approved remediation sprint).  
- Does not enable Ask SEO AutoPilot (Volume 3 remains locked).

---

## 18. Evidence commands

```bash
pnpm run build:seo-autopilot
pnpm run test:seo-autopilot
# Dependency inspection: services/*/package.json, apps/api/package.json
# Engine surface: services/*/src/{engine,composition,api/handlers,capability-manifest}.ts
# KG dual path: apps/api/src/index.ts + services/*/src/knowledge-graph/sync.ts
#                vs services/knowledge-graph-engine/src/service.ts
```

---

## 19. Rollback

This audit is documentation-only. Revert/close the audit branch/PR to remove it.
