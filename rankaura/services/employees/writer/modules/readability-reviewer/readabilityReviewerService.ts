import { createReviewerModule } from "@/services/employees/writer/modules/shared/reviewerFactory";
import { READABILITY_REVIEWER_CONFIG } from "@/services/employees/writer/modules/readability-reviewer/config";

export const readabilityReviewerModule = createReviewerModule({
  ...READABILITY_REVIEWER_CONFIG,
  defaultScore: 90,
  defaultPassed: true,
  defaultNotes: "Plain English, short sentences, easy to scan",
});
