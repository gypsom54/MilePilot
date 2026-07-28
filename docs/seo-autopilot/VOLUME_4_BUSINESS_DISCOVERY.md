# Engineering Bible — Volume 4

# Business Discovery Engine

> “Every great recommendation starts with understanding the business.”

---

## Positioning

Most SEO software asks for website, keywords, and country — then starts crawling.

SEO AutoPilot first answers:

> “Who is this business, what are they trying to achieve, and what makes them different?”

Only then does optimisation begin.

---

## Mission

The Business Discovery Engine exists to build the platform’s understanding of a business.

It does **not**:

- optimise
- analyse SEO
- write content

It builds the **canonical Business Profile** that every other engine relies upon.

If this engine is wrong, every downstream recommendation becomes weaker.

---

## Core principle

The engine owns **business understanding**, not business data entry.

It should infer, validate and enrich information where possible, while always allowing the user to confirm or correct it.

Nothing is silently accepted. Everything is confirmed before becoming canonical knowledge.

---

## Domain model

The Business Discovery Domain is centred on a **Business Entity**.

Every business has a single canonical identity.

```text
Business
│
├── Identity
├── Brand
├── Products
├── Services
├── Locations
├── Audience
├── Goals
├── Expertise
├── Team
├── Trust
├── Digital Assets
├── Competitors
├── Questions
├── Constraints
└── Preferences
```

This is not just a form. It is a living business model.

### Identity (required fields)

- Legal name
- Trading name
- Website
- Primary domain
- Business description
- Industry
- Business stage
- Company type
- Year established (optional)
- Primary contact
- Time zone
- Primary language

Every field has:

- Source
- Confidence
- Last verified
- Change history

### Brand

- Brand tone
- Brand values
- Unique selling proposition
- Positioning
- Premium / value / specialist
- Writing style
- Preferred terminology
- Things the business never says
- Compliance restrictions

### Products & Services

Each item becomes an entity with:

- Name
- Description
- Category
- Parent category
- Related topics
- Commercial priority
- Geographic availability
- Lifecycle status
- Supporting evidence
- Associated knowledge assets

### Audience Intelligence

- Primary audience
- Secondary audience
- Industries served
- Customer problems
- Customer goals
- Buying triggers
- Objections
- Decision-makers
- Preferred communication style

### Geographic Model

A business may operate locally, regionally, nationally, or internationally.

Each location includes:

- Service area
- Physical premises
- Remote availability
- Languages
- Market priority

### Business Goals

Goals are structured entities (not free text), each with:

- Priority
- Time horizon
- Success metric
- Owner
- Progress state

Examples: generate more leads, increase online sales, improve local visibility, become recognised in AI answers, expand into a new city, launch a new service, build topical authority, increase repeat customers.

### Expertise Map

Capture what the business **knows**, not only what it sells. Expertise areas become the foundation for Answer Opportunity Intelligence.

### Trust Profile

Verifiable entities: certifications, awards, memberships, years of experience, published research, case studies, testimonials, reviews, partnerships, qualifications.

### Digital Assets

Inventory of website, Google Business Profile, social profiles, YouTube, LinkedIn, GitHub (where relevant), documentation, knowledge bases, email newsletters, podcasts, publications.

### Competitor Seeds

Not full competitor analysis. Records:

- Known competitors supplied by the user
- Competitors discovered during onboarding
- Confidence that they are relevant

### Customer Question Bank

Initial nodes for the Answer Graph:

- Frequently asked questions
- Sales questions
- Support questions
- Common objections
- Industry misconceptions

### Constraints

Boundaries every downstream engine must respect: regulated industry, legal restrictions, geographic limitations, tone requirements, approval workflows, restricted terminology, product disclaimers.

### Preferences

Long-term preferences: preferred report frequency, desired automation level, AI detail level, writing style, approval thresholds.

---

## Entity enrichment

The engine enriches the profile over time and proposes suggestions.

Nothing is silently accepted. User confirmation is required before suggestions become canonical knowledge.

---

## Event model

The engine publishes events, not actions.

- `BusinessCreated`
- `BusinessUpdated`
- `ServiceAdded`
- `AudienceChanged`
- `GoalAdded`
- `GoalCompleted`
- `CompetitorSeedAdded`
- `ConstraintUpdated`
- `BrandProfileUpdated`

---

## Outputs

- Canonical Business Profile
- Brand Profile
- Audience Profile
- Goal Registry
- Expertise Map
- Trust Profile
- Digital Asset Registry
- Initial Competitor Seeds
- Customer Question Bank
- Constraint Registry
- Preference Registry

**No optimisation recommendations. Only understanding.**

---

## Success criteria (Sprint 1)

A Sprint 1 implementation is complete when:

1. The platform can accurately represent a business.
2. Every entity is stored in the Knowledge Graph.
3. Every change is versioned.
4. Every field has provenance.
5. Every downstream engine can consume the Business Profile without additional onboarding logic.
6. No SEO analysis has been implemented.

---

## Locked principle

The Business Discovery Engine is the canonical source of business understanding. It owns identity, goals, expertise, audiences, trust, constraints and preferences. Every other Intelligence Engine must consume this understanding rather than collecting its own version of the truth.

---

## Sprint 1 scope

### Implement

- Business Discovery Engine
- Business Discovery database schema
- Knowledge Graph entity mappings
- Business Discovery API
- Validation layer
- Event publication
- Capability Manifest
- Unit, integration and contract tests
- Documentation

### Explicitly excluded

- Website crawling
- SEO scoring
- Keyword research
- Content generation
- AI orchestration
- Dashboards
- Opportunity calculations
