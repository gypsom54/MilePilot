# Engineering Bible — Baseline Architecture Review

# Platform Architecture Audit (Post–Sprint 5 Checkpoint)

> **Status:** Baseline checkpoint — merged into the Engineering Bible.  
> **Decision:** The architecture is mature enough to move forward.  
> **Do not** spend a sprint refactoring the platform.  
> **Do** add new intelligence engines that respect architectural law.  
> **Revisit** this checkpoint after several additional engines are implemented — to verify continued compliance, not to redesign.

---

## Authority and purpose

| Field | Value |
| --- | --- |
| Audit date | 2026-07-28 |
| Baseline | Post–Sprint 5 (Volumes 3–8 implemented through Knowledge Graph Engine) |
| Authority | Product Bible + Engineering Bible Volumes 3–8 + codebase |
| Review type | Production readiness / foundation checkpoint |
| Mode | Verification of approved architecture — not a redesign brief |

This document is the **baseline architecture review** for SEO AutoPilot. It records that Sprints 1–5 produced a foundation that complies with the Engineering Bible closely enough to continue.

It is **not** a backlog to rebuild the platform. Future work should:

1. Implement new Intelligence Engines from approved Bible volumes.
2. Respect ownership, observation/knowledge/recommendation separation, events, and Knowledge Graph rules.
3. Re-read this checkpoint when several more engines exist, to confirm laws still hold.

---

## Board decision (locked)

```text
Merge this audit into the Engineering Bible as the baseline architecture review.

Do not spend another sprint refactoring the platform.
The architecture is mature enough to move forward.

From here onward, effort goes into adding new intelligence,
not reworking the foundation.

Keep this audit as a checkpoint document.
Revisit after a few more engines are implemented.
Use it to verify that future work continues to respect
architectural laws — not to repeatedly redesign the platform.
```

**Sprint 7+ posture:** proceed with new intelligence (once volumes are approved). Ask SEO AutoPilot remains locked until Volume 3 is authorised.

---

## Executive verdict

| Area | Verdict |
| --- | --- |
| Package / TypeScript dependency DAG | **Healthy** — no cycles; correct layering |
| Engine ↔ engine coupling | **Healthy** — no service→service imports |
| Observation / knowledge / recommendation law | **Held** for implemented engines |
| Knowledge Graph (Volume 8) | **Compliant** — canonical plane owned by KG; projection sync is **approved deferred debt** (Vol 8 Compatibility) |
| Business Discovery tenancy | **Consistency note** — Volume 4 does not require `tenantId`; later volumes do for their domains |
| Shared plumbing duplication | **Expected maintainability debt** — not a reason to pause new engines |
| Test architecture | **Solid for Sprints 1–5** (86 tests passing at audit time) |
| Naming / folder consistency | **Acceptable debt** (`crawl` / `knowledge-graph-engine` naming) |

| Metric | Result |
| --- | --- |
| Overall architecture score | **82 / 100** |
| Maturity | Foundation-complete for Observation + domain Knowledge + canonical Graph memory |
| Circular dependencies | **None** |
| Sprint 7 readiness (once volume approved) | **READY WITH CONDITIONS** — no significant foundation refactoring required |
| Ask SEO AutoPilot | **NOT READY** — Volume 3 implementation lock remains |

---

## Locked architectural law (reminder)

```text
Observation records what was seen.
Knowledge explains what it means.
Recommendations decide what to do.
```

Engines may publish events and propose canonical facts.  
They must not import other engines, overwrite foreign canonical knowledge, or invent Decision-layer behaviour via `recommend()`.

---

## Inventory at checkpoint

### Implemented engines (5)

| Registry name | Package | Folder | API prefix | Volume |
| --- | --- | --- | --- | --- |
| `business-discovery` | `@seo-autopilot/business-discovery` | `services/business-discovery` | `/business-discovery` | 4 |
| `market-intelligence` | `@seo-autopilot/market-intelligence` | `services/market-intelligence` | `/market-intelligence` | 5 |
| `website-intelligence` | `@seo-autopilot/website-intelligence` | `services/website-intelligence` | `/website-intelligence` | 6 |
| `crawl-intelligence` | `@seo-autopilot/crawl` | `services/crawl` | `/crawl-intelligence` | 7 |
| `knowledge-graph` | `@seo-autopilot/knowledge-graph-engine` | `services/knowledge-graph-engine` | `/knowledge-graph` | 8 |

Composition root: `apps/api/src/index.ts`.

### Scaffolds (not in scope to “fix” before new engines)

`ask-autopilot`, `authority`, `community`, `competitor`, `opportunity`, `performance`, `reviews`.

---

## Checkpoint findings (Bible-classified)

### PASS — continue

| Topic | Evidence |
| --- | --- |
| Engine boundaries | Exclusive ownership; prohibited capabilities absent; `recommend()` → `ENGINE_DOES_NOT_RECOMMEND` |
| No circular deps | Package / tsconfig / import DAG clean |
| No engine→engine imports | Event Bus + composition root only |
| Progressive intelligence | Candidates, confirmation, provenance, crawl failure ≠ absence |
| Canonical KG rules | Evidence required; merges need confirmation; cross-engine mutation refused |
| Vol 8 Compatibility | Domain projection upserts explicitly allowed until propose-only migration |

### WARNING — track; do not block new intelligence

| Topic | Classification |
| --- | --- |
| Dual Knowledge Graph planes (projection + canonical) | **Approved deferred debt** (Volume 8 Compatibility) — document which plane new engines may read |
| BD lacks `tenantId` | Consistency with Vol 5–8 platforms; **not** a Volume 4 mandate |
| Duplicated API/event/`normaliseUrl` helpers | Maintainability; extract opportunistically when touching those surfaces |
| Naming: `crawl` vs `crawl-intelligence`; KG engine vs SDK package | Discoverability debt |
| Publish-only event bus / BD correlation gaps | Improve when adding multi-engine workflows |
| Empty performance/regression suites | Fill when load/regression needs arise |

### FAIL — none demonstrated against Volumes 4–8

No unapproved Bible violation requiring a foundation refactor sprint.

---

## Ownership map (Single Owner — checkpoint)

| Concept | Owner |
| --- | --- |
| Business | Business Discovery |
| Market | Market Intelligence |
| Website / Page structure | Website Intelligence |
| Crawl Observation | Crawl Intelligence |
| Canonical Entity / Relationship / Alias / Evidence | Knowledge Graph Engine |
| Assessment / Inference / Opportunity / Ask | **Not yet specified** — assign in future volumes before coding |

---

## Dependency direction (checkpoint)

```text
Observation (Crawl)
        ↓
Knowledge (BD, MI, WI) + Canonical Memory (KG Engine)
        ↓  (future volumes)
Assessment → Inference → Decision → Interaction (Ask)
```

Present package direction:

```text
apps/api → services/* → packages/{database?, knowledge-graph, engine-sdk, shared}
packages/{engine-sdk, knowledge-graph, ai} → shared
```

---

## Knowledge Graph note (do not misread as FAIL)

Volume 8 states:

> Existing engine sync adapters that write domain projection nodes via `InMemoryKnowledgeGraph` remain for domain observation/projection continuity. Canonical semantic memory is owned exclusively by this engine's canonical store and APIs.  
> Migrating all domain syncs onto propose-only write paths is deferred infrastructure.

**Implication for future engines:** Prefer the **canonical** plane for evidence-backed graph truth. Treat projection upserts as continuity, not as a reason to halt Sprint 7+.

---

## Conditions when adding the next engine

1. Approve a Bible volume before implementation.  
2. Respect exclusive ownership and event-only cross-engine communication.  
3. Refuse Decision-layer work in Observation/Knowledge engines (`recommend()`).  
4. If multi-tenant: align with existing tenant patterns (and BD if that engine is consumed across tenants).  
5. Do not implement Ask until Volume 3 is unlocked.  
6. Do **not** open a “foundation refactor” sprint unless a future checkpoint proves a genuine Bible violation.

---

## Architecture health score (baseline)

| Dimension | Score |
| --- | --- |
| Engine separation | 92 |
| Knowledge ownership | 88 |
| Knowledge Graph | 78 |
| Dependency direction | 90 |
| Event architecture | 82 |
| API architecture | 80 |
| Repository architecture | 86 |
| Testing | 78 |
| Security | 80 |
| Scalability | 70 |
| Maintainability | 74 |
| Extensibility | 86 |
| **Overall** | **82** |

---

## Revisit protocol

| When | What to do |
| --- | --- |
| After ~2–3 additional engines | Re-run a checkpoint against this document |
| Ask unlock | Re-check dual-plane KG + orchestration laws |
| Any suspected Bible violation | Stop and cite Volume text — do not silently redesign |

**Checkpoint questions (future):**

1. Does each new engine still refuse out-of-boundary work?  
2. Are there new circular dependencies or service→service imports?  
3. Does any engine overwrite another’s canonical knowledge?  
4. Are Volume 8 Compatibility debts still deferred by design, or must propose-only migration begin?  
5. Does the platform still score as “proceed with intelligence, not foundation rewrite”?

---

## Final verdict (baseline)

**SEO AutoPilot is architecturally ready to add new intelligence without a foundation refactoring sprint.**

Effort from here onward belongs to **new Intelligence Engines** under approved Bible volumes. This audit remains the Engineering Bible’s **baseline checkpoint** for verifying that future work continues to respect architectural law.
