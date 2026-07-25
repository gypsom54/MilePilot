import { createReviewerModule } from "@/services/employees/writer/modules/shared/reviewerFactory";
import { SEO_REVIEWER_CONFIG } from "@/services/employees/writer/modules/seo-reviewer/config";

export { SEO_REVIEWER_CONFIG };

export const seoReviewerModule = createReviewerModule({
  ...SEO_REVIEWER_CONFIG,
  defaultScore: 88,
  defaultPassed: true,
  defaultNotes: "Page structure supports clear customer discovery",
});