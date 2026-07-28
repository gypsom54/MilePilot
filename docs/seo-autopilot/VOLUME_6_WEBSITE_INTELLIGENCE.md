# Engineering Bible — Volume 6

# Website Intelligence Engine

> Represent a business website structurally and semantically before crawling or optimisation begins.

---

## Mission

The Website Intelligence Engine owns the **structural and semantic model** of a business website.

It records websites, properties, pages, hierarchy, navigation, sections, templates, conversion actions, forms, trust elements, assets, publication states and snapshots — with provenance, confidence and versioning.

It does **not** crawl, render, connect to CMS platforms, analyse SEO, score pages, evaluate performance, generate content, recommend internal links, prioritise opportunities, build dashboards or implement Ask SEO AutoPilot.

---

## Locked principle

Website Intelligence models what the website **is**. Later engines may crawl, score or optimise. This engine never silently invents optimisation advice and never overwrites Business Discovery or Market Intelligence facts.

---

## Engine boundary

### Owns

- Website and Website Property entities
- Page entities
- URL normalisation and deduplication
- Page type and purpose classifications (candidate → confirmed)
- Site hierarchy
- Navigation structures
- Page sections
- Page templates
- Business entity mappings (read-only references)
- Market entity mappings (read-only references)
- Topic and question associations
- Conversion actions
- Forms
- Trust elements
- Website assets
- Publication states
- Website snapshots
- Import jobs (fixtures / injected observations only)

### Must not

- crawl or fetch websites
- render pages
- connect to CMS platforms
- analyse SEO / score pages / evaluate performance
- generate content
- recommend internal links
- prioritise opportunities
- implement dashboards
- implement Ask SEO AutoPilot

`recommend()` must refuse all optimisation, rewriting, scoring and strategy requests.

---

## Data rules

1. Every observation must retain source and date.
2. Candidate classifications must not silently become canonical.
3. Production and staging properties must remain distinct.
4. URL normalisation must be deterministic.
5. Canonical page relationships must not create loops.
6. Business Discovery and Market Intelligence entities must never be silently duplicated or overwritten.
7. Deleted, redirected and archived pages remain in historical knowledge.
8. Repeated imports and graph synchronisation must be idempotent.
9. Cross-tenant relationships must be rejected.

---

## Domain model

```text
Website (tenant-scoped)
│
├── businessId? (read-only Business Discovery reference)
├── Properties
│   ├── production | staging | other (distinct)
│   └── baseUrl
├── Pages
│   ├── normalisedUrl (dedupe key within property)
│   ├── type / purpose (candidate | confirmed)
│   ├── publicationState
│   ├── parentPageId? (hierarchy, no loops)
│   ├── sections
│   ├── templateId?
│   ├── businessEntityRefs[]
│   ├── marketEntityRefs[]
│   ├── topicIds[]
│   ├── questionIds[]
│   ├── conversionActions
│   ├── forms
│   ├── trustElements
│   └── assets
├── Navigations
├── Templates
├── Snapshots
└── ImportJobs
```

### Website

- `tenantId` (required)
- `businessId` (optional read-only BD reference)
- Name / primary domain label
- Version, created/updated timestamps

### Website Property

- Environment: `production` | `staging` | `other`
- `baseUrl`
- Distinct from other environments — never merged by normalisation alone

### Page

- `propertyId`
- `rawUrl`
- `normalisedUrl`
- Title (optional observation)
- Page type: candidate/confirmed classification
- Page purpose: candidate/confirmed classification
- `publicationState`: `draft` | `published` | `redirected` | `archived` | `deleted`
- `parentPageId` (optional; loop-free)
- Evidence metadata (source, observedAt, provenance, confidence, limitations)
- Historical states retained when publication state changes

### URL normalisation (deterministic)

1. Parse absolute HTTP(S) URL
2. Lowercase scheme and host
3. Remove default ports (`:80`, `:443`)
4. Remove URL fragment
5. Normalise path: collapse duplicate slashes; remove trailing slash except root `/`
6. Sort query parameters lexicographically by key then value
7. Do **not** strip subdomains (staging vs production hosts remain distinct)

Deduplicate pages within a property by `normalisedUrl`.

### Classifications

Page type and purpose start as `candidate` and become canonical only on explicit confirmation.

### Hierarchy

`parentPageId` must reference a page in the same website and property. Circular relationships are rejected.

### Navigation / sections / templates

Structural observations only — no SEO scoring.

### Entity mappings

- `businessEntityRefs`: `{ businessId, entityPath }` read-only — never create/overwrite BD entities
- `marketEntityRefs`: `{ marketId, entityType, entityId }` read-only — never create/overwrite MI entities
- Cross-tenant refs rejected

### Snapshots & import jobs

Snapshots capture a versioned structural view. Import jobs accept fixtures/injected observations only (no live fetch).

---

## Knowledge Graph mappings

### Entity types

- Website
- WebsiteProperty
- Page
- Navigation
- PageSection
- PageTemplate
- ConversionAction
- Form
- TrustElement
- WebsiteAsset
- WebsiteSnapshot
- TopicRef
- QuestionRef

### Relationships

| Relationship | From → To |
| --- | --- |
| `HAS_PROPERTY` | Website → WebsiteProperty |
| `HAS_PAGE` | WebsiteProperty → Page |
| `PARENT_OF` | Page → Page |
| `HAS_NAVIGATION` | Website → Navigation |
| `NAV_INCLUDES_PAGE` | Navigation → Page |
| `HAS_SECTION` | Page → PageSection |
| `USES_TEMPLATE` | Page → PageTemplate |
| `HAS_TEMPLATE` | Website → PageTemplate |
| `MAPS_BUSINESS_ENTITY` | Page → (external BD ref as properties) |
| `MAPS_MARKET_ENTITY` | Page → (external MI ref as properties) |
| `ASSOCIATED_TOPIC` | Page → TopicRef |
| `ASSOCIATED_QUESTION` | Page → QuestionRef |
| `HAS_CONVERSION_ACTION` | Page → ConversionAction |
| `HAS_FORM` | Page → Form |
| `HAS_TRUST_ELEMENT` | Page → TrustElement |
| `HAS_ASSET` | Page → WebsiteAsset |
| `HAS_SNAPSHOT` | Website → WebsiteSnapshot |

All graph writes retain provenance and are idempotent (stable ids).

---

## Events

| Event | When |
| --- | --- |
| `WebsiteDefined` | Website created |
| `WebsitePropertyAdded` | Property added |
| `PageObserved` | Page created/updated from observation |
| `PageTypeCandidateCreated` | Page type candidate set |
| `PageTypeConfirmed` | Page type confirmed |
| `PagePurposeCandidateCreated` | Page purpose candidate set |
| `PagePurposeConfirmed` | Page purpose confirmed |
| `PageHierarchyUpdated` | Parent relationship changed |
| `NavigationStructureUpdated` | Navigation updated |
| `PageSectionObserved` | Section observed |
| `PageTemplateAssociated` | Template associated |
| `BusinessEntityMapped` | Business entity ref mapped |
| `MarketEntityMapped` | Market entity ref mapped |
| `TopicAssociated` | Topic associated |
| `QuestionAssociated` | Question associated |
| `ConversionActionObserved` | Conversion action observed |
| `FormObserved` | Form observed |
| `TrustElementObserved` | Trust element observed |
| `WebsiteAssetObserved` | Asset observed |
| `PagePublicationStateChanged` | Publication state changed |
| `WebsiteSnapshotCreated` | Snapshot created |
| `WebsiteImportStarted` | Import job started |
| `WebsiteImportCompleted` | Import job completed |
| `WebsiteImportFailed` | Import job failed |

Events use the shared Event Bus contract and correlation ids.

---

## API

| Method | Path |
| --- | --- |
| `GET` | `/website-intelligence/manifest` |
| `POST` | `/website-intelligence/websites` |
| `GET` | `/website-intelligence/websites` |
| `GET` | `/website-intelligence/websites/:websiteId` |
| `POST` | `/website-intelligence/websites/:websiteId/properties` |
| `POST` | `/website-intelligence/websites/:websiteId/pages` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/type/confirm` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/purpose/confirm` |
| `PATCH` | `/website-intelligence/websites/:websiteId/pages/:pageId/hierarchy` |
| `POST` | `/website-intelligence/websites/:websiteId/navigations` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/sections` |
| `POST` | `/website-intelligence/websites/:websiteId/templates` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/template` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/business-mappings` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/market-mappings` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/topics` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/questions` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/conversion-actions` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/forms` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/trust-elements` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/assets` |
| `POST` | `/website-intelligence/websites/:websiteId/pages/:pageId/publication-state` |
| `POST` | `/website-intelligence/websites/:websiteId/snapshots` |
| `POST` | `/website-intelligence/websites/:websiteId/imports` |
| `GET` | `/website-intelligence/websites/:websiteId/versions` |

`tenantId` required on create and on tenant-scoped reads/mutations.

---

## External data

Do **not** implement crawling, fetching, rendering or CMS connections.

Use fixtures or injected observation adapters only.

---

## Outputs

- Website Profile (versioned)
- Properties (production/staging distinct)
- Page registry with normalised URLs
- Hierarchy / navigation / sections / templates
- Read-only BD/MI mappings
- Snapshots and import job records

**No optimisation recommendations. Only structural/semantic understanding.**

---

## Sprint 3 success criteria

1. Complete domain usable through contracts and API
2. URL normalisation deterministic; dedupe within property
3. Staging and production remain distinct
4. Circular hierarchy rejected
5. Candidate classifications require confirmation
6. Imports and graph sync idempotent
7. BD/MI facts not overwritten
8. Removed/redirected/archived pages remain historically represented
9. Tenant boundaries enforced
10. `recommend()` refuses optimisation
11. TypeScript builds cleanly; tests pass
12. No excluded functionality added
