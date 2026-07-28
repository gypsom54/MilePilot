# Engineering Bible — Volume 5

# Market Intelligence Engine

> External market understanding through structured, sourced and versioned evidence.

---

## Mission

The Market Intelligence Engine owns **external market observations**.

It builds a structured, sourced, versioned representation of the market surrounding a business so later engines can reason about demand, competitors, gaps and trends.

It does **not** own business identity facts, final strategy, opportunity prioritisation, crawling, SEO scoring, rankings, content, Ask orchestration or dashboards.

---

## Locked principle

Market Intelligence observes the market. It never silently overwrites Business Discovery truth, and it never produces strategic recommendations. Opportunity Intelligence and Ask SEO AutoPilot own decisions that prioritise or recommend action.

---

## Engine boundary

### Owns

- Market definitions and scope
- Market categories (candidate → confirmed)
- Customer problems and desired outcomes
- Demand signals and demand-theme clustering contracts
- Competitor candidates (discover → confirm / dismiss)
- Market offer observations
- Candidate market gaps with evidence requirements
- Trend and seasonality representations
- Source, provenance, confidence and freshness models

### Must not

- change canonical Business Discovery facts
- make final strategic recommendations
- prioritise opportunities
- crawl websites
- perform SEO scoring
- track rankings
- generate content
- implement Ask SEO AutoPilot
- build dashboards
- connect to external data providers

`recommend()` must explicitly refuse strategy or optimisation requests.

---

## Data rules

1. Every observation requires a source.
2. Preserve observation date, scope, provenance, confidence and limitations.
3. Separate candidate observations from confirmed canonical market entities.
4. Confirmation must be explicit for canonical categories or market-definition changes.
5. Market evidence must not silently overwrite Business Discovery data.
6. Geographic scope must be preserved.
7. Trends require observations from separate points in time.
8. Gaps require supporting evidence.
9. Pricing and competitor offers are dated observations, not guaranteed facts.
10. Repeated imports must be idempotent.
11. Stale and expired evidence remains historical but contributes less to current confidence.

---

## Domain model

```text
Market (tenant-scoped)
│
├── Definition & Scope
├── Categories (candidate | confirmed)
├── Customer Problems
├── Desired Outcomes
├── Demand Signals
├── Demand Themes
├── Questions
├── Competitor Candidates (candidate | confirmed | dismissed)
├── Organisations
├── Products / Services (observed)
├── Offer Observations
├── Locations
├── Market Gaps (candidate | validated)
├── Trends
├── Seasonality Patterns
└── Market Sources
```

### Market definition

- `tenantId` (required — isolation boundary)
- `businessId` (optional read-only reference to Business Discovery; never mutated here)
- Name
- Description
- Industry scope
- Geographic scope (`local` | `regional` | `national` | `international`)
- Location labels (optional, scope-preserving)
- Version, created/updated timestamps

### Evidence metadata (every observation)

- `sourceId`
- `observedAt`
- Geographic `scope`
- Provenance
- Confidence (0–1)
- Limitations[]
- `expiresAt` (optional)
- Freshness: `fresh` | `stale` | `expired`

### Market category

- Name, description
- Status: `candidate` | `confirmed`
- Evidence metadata
- Confirmation requires explicit action

### Customer problem / desired outcome

- Statement
- Related category ids (optional)
- Evidence metadata

### Demand signal

- Signal text / topic
- Intensity (optional numeric)
- Evidence metadata
- Idempotency key derived from tenant + source + observedAt + natural key

### Demand theme

- Name
- Clustered demand signal ids
- Related question ids
- Evidence metadata

### Competitor candidate

- Name
- Website (optional)
- Organisation id (optional)
- Status: `candidate` | `confirmed` | `dismissed`
- Evidence metadata
- Dismissed candidates remain dismissed

### Offer observation

- Organisation / product / service references
- Price observation (optional, dated — not a guaranteed fact)
- Offer summary
- Location id (optional)
- Evidence metadata

### Market gap

- Statement
- Supporting evidence ids (**required**)
- Status: `candidate` | `validated`
- Evidence metadata
- Unsupported gaps are rejected

### Trend

- Name
- Direction / notes
- Observation points (≥2, distinct `observedAt` values required)
- Evidence metadata

### Seasonality pattern

- Name
- Pattern description
- Observation points
- Evidence metadata

### Market source

- Label
- Kind (`fixture` | `user` | `import` | `adapter`)
- URI / reference (optional)
- Collected at

---

## Knowledge Graph mappings

### Entity types

- Market
- MarketCategory
- CustomerProblem
- DesiredOutcome
- DemandTheme
- Question
- CompetitorCandidate
- Organisation
- Product
- Service
- OfferObservation
- Location
- MarketGap
- Trend
- SeasonalityPattern
- MarketSource

### Relationships

| Relationship | From → To |
| --- | --- |
| `HAS_CATEGORY` | Market → MarketCategory |
| `HAS_PROBLEM` | Market → CustomerProblem |
| `HAS_OUTCOME` | Market → DesiredOutcome |
| `HAS_DEMAND_THEME` | Market → DemandTheme |
| `CLUSTERS_SIGNAL` | DemandTheme → DemandSignal (as properties/refs) |
| `RELATES_TO_QUESTION` | DemandTheme → Question |
| `HAS_QUESTION` | Market → Question |
| `HAS_COMPETITOR_CANDIDATE` | Market → CompetitorCandidate |
| `REFERS_TO_ORGANISATION` | CompetitorCandidate → Organisation |
| `HAS_ORGANISATION` | Market → Organisation |
| `OFFERS_PRODUCT` | Organisation → Product |
| `OFFERS_SERVICE` | Organisation → Service |
| `HAS_OFFER_OBSERVATION` | Market → OfferObservation |
| `OBSERVES_PRODUCT` | OfferObservation → Product |
| `OBSERVES_SERVICE` | OfferObservation → Service |
| `AT_LOCATION` | OfferObservation → Location |
| `HAS_LOCATION` | Market → Location |
| `HAS_GAP` | Market → MarketGap |
| `SUPPORTED_BY_SOURCE` | MarketGap → MarketSource |
| `HAS_TREND` | Market → Trend |
| `HAS_SEASONALITY` | Market → SeasonalityPattern |
| `HAS_SOURCE` | Market → MarketSource |

All graph writes retain provenance and are idempotent (stable ids).

---

## Events

| Event | When |
| --- | --- |
| `MarketDefined` | Market created |
| `MarketScopeUpdated` | Scope/definition change (explicit) |
| `MarketCategoryCandidateCreated` | Category candidate added |
| `MarketCategoryConfirmed` | Category confirmed |
| `DemandSignalObserved` | Demand signal recorded |
| `DemandThemeCreated` | Demand theme created |
| `CustomerProblemObserved` | Customer problem recorded |
| `CompetitorCandidateDiscovered` | Competitor candidate added |
| `CompetitorCandidateConfirmed` | Competitor confirmed |
| `CompetitorCandidateDismissed` | Competitor dismissed |
| `OfferObserved` | Offer observation recorded |
| `MarketGapDetected` | Gap candidate created (with evidence) |
| `MarketGapValidated` | Gap validated |
| `MarketTrendObserved` | Trend recorded |
| `SeasonalityPatternObserved` | Seasonality recorded |
| `MarketEvidenceExpired` | Evidence marked expired |
| `MarketResearchCompleted` | Research run completed |
| `MarketResearchPartiallyCompleted` | Research run partial |
| `MarketResearchFailed` | Research run failed |

Events use the shared Event Bus contract and correlation ids.

---

## API

Handlers delegate to application services. No market reasoning in handlers.

| Method | Path |
| --- | --- |
| `GET` | `/market-intelligence/manifest` |
| `POST` | `/market-intelligence/markets` |
| `GET` | `/market-intelligence/markets` |
| `GET` | `/market-intelligence/markets/:marketId` |
| `PATCH` | `/market-intelligence/markets/:marketId/scope` |
| `POST` | `/market-intelligence/markets/:marketId/categories` |
| `POST` | `/market-intelligence/markets/:marketId/categories/:categoryId/confirm` |
| `POST` | `/market-intelligence/markets/:marketId/problems` |
| `POST` | `/market-intelligence/markets/:marketId/outcomes` |
| `POST` | `/market-intelligence/markets/:marketId/demand-signals` |
| `POST` | `/market-intelligence/markets/:marketId/demand-themes` |
| `POST` | `/market-intelligence/markets/:marketId/questions` |
| `POST` | `/market-intelligence/markets/:marketId/competitors` |
| `POST` | `/market-intelligence/markets/:marketId/competitors/:candidateId/confirm` |
| `POST` | `/market-intelligence/markets/:marketId/competitors/:candidateId/dismiss` |
| `POST` | `/market-intelligence/markets/:marketId/offers` |
| `POST` | `/market-intelligence/markets/:marketId/gaps` |
| `POST` | `/market-intelligence/markets/:marketId/gaps/:gapId/validate` |
| `POST` | `/market-intelligence/markets/:marketId/trends` |
| `POST` | `/market-intelligence/markets/:marketId/seasonality` |
| `POST` | `/market-intelligence/markets/:marketId/sources` |
| `POST` | `/market-intelligence/markets/:marketId/evidence/import` |
| `POST` | `/market-intelligence/markets/:marketId/evidence/expire` |
| `POST` | `/market-intelligence/markets/:marketId/research/complete` |
| `POST` | `/market-intelligence/markets/:marketId/research/partial` |
| `POST` | `/market-intelligence/markets/:marketId/research/fail` |
| `GET` | `/market-intelligence/markets/:marketId/versions` |

List/get markets require `tenantId` query/header context on list; create requires `tenantId` in body.

---

## External data

Do **not** implement live collection, scraping, search-provider integrations, AI monitoring or keyword APIs.

Use fixtures or injected adapters only where tests require evidence input.

---

## Outputs

- Market Profile (versioned)
- Category registry (candidate/confirmed)
- Problem / outcome registry
- Demand signal + theme contracts
- Competitor candidate registry
- Offer observation registry
- Gap registry (evidence-backed)
- Trend / seasonality registry
- Source registry

**No strategic recommendations. Only market understanding.**

---

## Sprint 2 success criteria

1. Complete domain usable through contracts and API
2. Evidence remains sourced and versioned
3. Candidate vs confirmed separation enforced
4. KG sync idempotent with provenance
5. Events published with correlation ids
6. Capability Manifest published
7. Tests prove boundary, idempotency, expiry, tenant isolation, gap/trend rules
8. TypeScript builds cleanly
9. No excluded functionality added
