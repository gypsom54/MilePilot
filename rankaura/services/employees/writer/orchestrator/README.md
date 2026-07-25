# Writer Department Orchestrator

The **only** entry point for AuraCore and all Writer Department modules.

## Communication rules

```
AuraCore ──► Orchestrator ──► Planner
                 │
                 ├──► Strategist
                 ├──► Copywriter
                 ├──► Editor
                 ├──► SEO Reviewer
                 ├──► Brand Reviewer
                 ├──► Readability Reviewer
                 └──► QA Reviewer

✗ No module talks to another module directly
✗ AuraCore never calls modules directly
```

## Methods

| Method | Purpose |
| ------ | ------- |
| `receiveBrief()` | Accept new content brief from AuraCore |
| `runProduction()` | Planner → Strategist → Copywriter → Editor |
| `runReview()` | Sequential review pipeline |
| `getDraft()` | Retrieve current draft state |
| `getVersionHistory()` | Audit trail for a draft |
| `generateReport()` | Daily Writer Department report |
