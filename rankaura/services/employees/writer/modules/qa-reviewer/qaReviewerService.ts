import { createReviewerModule } from "@/services/employees/writer/modules/shared/reviewerFactory";
import { QA_REVIEWER_CONFIG } from "@/services/employees/writer/modules/qa-reviewer/config";

export const qaReviewerModule = createReviewerModule({
  ...QA_REVIEWER_CONFIG,
  defaultScore: 94,
  defaultPassed: true,
  defaultNotes: "All quality checks passed — ready for approval",
});
