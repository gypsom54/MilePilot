# Scout Models

Domain models used within the Scout research employee.

## Models

| Model | File | Purpose |
| ----- | ---- | ------- |
| `SearchIntent` | `search-intent.ts` | What customers are looking for |
| `ScoutOpportunity` | `opportunity.ts` | Actionable growth opportunity from research |

## Design rules

- Plain business language — no SEO terminology
- Maps to domain `Opportunity` in `types/models/opportunity.ts` via AuraCore in Phase 2
- All fields populated from mock data in Phase 1
