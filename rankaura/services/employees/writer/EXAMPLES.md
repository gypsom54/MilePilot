# Writer Department Examples

## Receive a brief (AuraCore)

```typescript
import { writerDepartmentOrchestrator } from "@/services/employees/writer";

const draft = await writerDepartmentOrchestrator.receiveBrief({
  businessId: "biz_rankaura_demo",
  title: "Emergency Boiler Repair",
  contentType: "service",
  brief: "Create a helpful service page for emergency boiler repair.",
});
```

## Run full production

```typescript
const result = await writerDepartmentOrchestrator.runProduction(draft.id);
// draft.status: "drafted"
// result.businessImpact: estimated visitor/lead increase
// result.versionHistory: audit trail
```

## Run review pipeline

```typescript
const reviewed = await writerDepartmentOrchestrator.runReview(draft.id);
// reviewed.contentQuality.overallScore: aggregated reviewer scores
// reviewed.draft.status: "approved" if all reviewers pass
```

## IAIEmployee facade (AuraCore standard interface)

```typescript
import { writerService } from "@/services/employees/writer";

const summary = await writerService.summarise({
  businessId: "biz_rankaura_demo",
  requestedBy: "auracore",
});
```

## Generate department report

```typescript
const report = await writerDepartmentOrchestrator.generateReport("biz_rankaura_demo");
```
