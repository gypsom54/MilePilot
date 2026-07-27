import { FEATURED_VARIANT_LABELS } from "@/types/workspace";
import type { BiggestOpportunity } from "@/types/workspace";
import { RecommendationCard } from "@/components/ui/RecommendationCard";

interface BiggestOpportunityCardProps {
  opportunity: BiggestOpportunity;
}

export function BiggestOpportunityCard({
  opportunity,
}: BiggestOpportunityCardProps) {
  return (
    <RecommendationCard
      eyebrow={FEATURED_VARIANT_LABELS[opportunity.variant]}
      title={opportunity.title}
      support={opportunity.support}
      actionLabel={opportunity.actionLabel}
      href={opportunity.href}
      headingId="biggest-opportunity-heading"
    />
  );
}
