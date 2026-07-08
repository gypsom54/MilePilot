import { createReviewerModule } from "@/services/employees/writer/modules/shared/reviewerFactory";
import { BRAND_REVIEWER_CONFIG } from "@/services/employees/writer/modules/brand-reviewer/config";

export const brandReviewerModule = createReviewerModule({
  ...BRAND_REVIEWER_CONFIG,
  defaultScore: 92,
  defaultPassed: true,
  defaultNotes: "Tone is calm, confident, and on-brand",
});
