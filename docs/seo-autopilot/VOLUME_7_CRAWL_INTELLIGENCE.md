# Engineering Bible — Volume 7

# Crawl Intelligence Engine

> Preserve sourced, timestamped and immutable website observations without judging or optimising them.

---

## Locked architectural law

```text
Observation records what was seen.
Knowledge explains what it means.
Recommendations decide what to do.
```

Crawl Intelligence belongs to the **Observation Layer**.

---

## Mission

Crawl Intelligence records what was collected about a website at a point in time.

It does **not** decide what those observations mean and does **not** decide what to do next.

Website Intelligence owns structural/semantic meaning. Later engines may score or recommend. Crawl Intelligence only observes.

---

## Engine boundary

### Owns

- Crawl jobs and crawl scopes
- Crawl sources and adapter contracts
- Fixture and injected test adapters
- URL discovery, fetch attempts, HTTP responses, redirect chains
- Document, HTML metadata, heading, link, image, resource observations
- Canonical declarations, robots directives/files, sitemap observations
- Structured-data, language, text-content structural observations
- Timing observations, content fingerprints, crawl failures
- Immutable crawl snapshots and factual snapshot comparison
- Provenance, timestamps, idempotent imports

### Must not

- score SEO / judge indexability / judge accessibility
- score performance / assess content quality
- recommend changes / prioritise issues
- generate content / edit websites
- implement dashboards / invoke Ask SEO AutoPilot
- overwrite Website Intelligence meaning
- implement production network crawling

`recommend()` must return `ENGINE_DOES_NOT_RECOMMEND` for SEO fixes, metadata optimisation, broken-link prioritisation, performance fixes, internal linking, content rewriting and strategic recommendations.

---

## Adapter policy

### Implement

- `CrawlAdapter` contract
- Fixture adapter
- Injected test adapter
- Streaming observation support
- Scope validation around all adapter output

### Do not implement

- Live HTTP collection
- Browser rendering / Playwright / Chromium
- Live sitemap or robots fetches
- Distributed queues, proxy rotation, anti-bot circumvention
- Authenticated crawling

---

## Data rules

1. Every observation requires a source and timestamp.
2. Preserve original and normalised URLs.
3. Fetch attempts remain separate from responses.
4. Failed collection is not equivalent to absent data.
5. Retries remain historically visible.
6. Raw observations are immutable.
7. Derived knowledge must reference observation IDs.
8. Observations never silently overwrite canonical Website Intelligence knowledge.
9. Repeated imports must be idempotent.
10. Separate timestamped collections remain distinct.
11. Production and staging scopes remain separate.
12. Sensitive headers and private data must be redacted.
13. Snapshots are immutable.
14. Snapshot comparison reports only factual changes.

---

## Security / redaction

Never store:

- Authorization headers
- Cookie or Set-Cookie values
- passwords
- API keys
- session tokens
- form submission values
- unrestricted confidential response bodies

Redact before persistence and before event publication.

---

## Domain model

```text
CrawlJob (tenant-scoped)
│
├── Scope (hosts, protocols, path rules, environment)
├── Source / Adapter kind (fixture | injected)
├── websiteId? / propertyId? (read-only Website Intelligence refs)
├── Observations[] (immutable)
├── Snapshots[] (immutable)
└── Comparisons[] (factual only)
```

### Observation kinds

- `url_discovery`
- `fetch_attempt`
- `http_response`
- `redirect_chain`
- `document`
- `html_metadata`
- `heading`
- `link`
- `image` (alt: `present` | `empty` | `absent`)
- `resource`
- `canonical_declaration`
- `robots_directive`
- `robots_file`
- `sitemap`
- `structured_data`
- `language`
- `text_content_structural`
- `timing`
- `content_fingerprint`
- `crawl_failure`

Every observation includes: `id`, `kind`, `sourceId`, `observedAt`, `originalUrl`, `normalisedUrl`, `scopeEnvironment`, `payload`, `idempotencyKey`.

Failed collection uses `crawl_failure` — never represented as silent absence.

---

## Knowledge Graph

### Entity types

- CrawlJob
- CrawlScope
- CrawlSource
- CrawlObservation
- CrawlSnapshot
- SnapshotComparison

### Relationships

| Relationship | From → To |
| --- | --- |
| `HAS_SCOPE` | CrawlJob → CrawlScope |
| `HAS_SOURCE` | CrawlJob → CrawlSource |
| `HAS_OBSERVATION` | CrawlJob → CrawlObservation |
| `REFERENCES_WEBSITE` | CrawlJob → (external WI ref properties) |
| `HAS_SNAPSHOT` | CrawlJob → CrawlSnapshot |
| `COMPARES` | SnapshotComparison → CrawlSnapshot |
| `OBSERVATION_OF_URL` | CrawlObservation → (URL properties) |

Graph writes retain provenance and timestamps, are idempotent, do not overwrite Website Intelligence entities, and retain historical observations.

---

## Events

| Event | When |
| --- | --- |
| `CrawlJobCreated` | Job created |
| `CrawlJobStarted` | Job started |
| `CrawlJobCompleted` | Job completed |
| `CrawlJobFailed` | Job failed |
| `CrawlScopeValidated` | Scope validated |
| `CrawlObservationRecorded` | Observation recorded |
| `CrawlFetchAttempted` | Fetch attempt recorded |
| `CrawlResponseObserved` | HTTP response observed |
| `CrawlRedirectObserved` | Redirect chain observed |
| `CrawlFailureObserved` | Failure observed |
| `CrawlSnapshotCreated` | Immutable snapshot created |
| `CrawlSnapshotCompared` | Factual comparison created |
| `PageCrawled` | Compatibility alias when a document observation is recorded |

Events include correlation IDs and observation/source references. Never embed sensitive bodies/headers.

---

## API

| Method | Path |
| --- | --- |
| `GET` | `/crawl-intelligence/manifest` |
| `POST` | `/crawl-intelligence/jobs` |
| `GET` | `/crawl-intelligence/jobs` |
| `GET` | `/crawl-intelligence/jobs/:jobId` |
| `POST` | `/crawl-intelligence/jobs/:jobId/start` |
| `POST` | `/crawl-intelligence/jobs/:jobId/observations` |
| `POST` | `/crawl-intelligence/jobs/:jobId/import` |
| `POST` | `/crawl-intelligence/jobs/:jobId/snapshots` |
| `GET` | `/crawl-intelligence/jobs/:jobId/snapshots/:snapshotId` |
| `POST` | `/crawl-intelligence/jobs/:jobId/snapshots/compare` |
| `GET` | `/crawl-intelligence/jobs/:jobId/versions` |

`tenantId` required for tenant-scoped operations.

---

## Outputs

- Crawl jobs with scopes and sources
- Immutable observation streams
- Immutable snapshots
- Factual snapshot comparisons

**No judgements. No recommendations. Observation only.**

---

## Sprint 4 success criteria

1. Complete observation contracts usable via API
2. Source, time and provenance retained
3. Snapshots immutable; comparisons factual
4. Adapters limited to fixture/injected
5. Redaction enforced
6. Website Intelligence never overwritten
7. `recommend()` refuses judgement
8. TypeScript builds; all tests pass
9. No excluded functionality added
