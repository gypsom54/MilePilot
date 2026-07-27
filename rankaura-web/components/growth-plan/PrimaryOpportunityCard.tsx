import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { PrimaryOpportunity } from "@/types/growthPlan";

interface PrimaryOpportunityCardProps {
  opportunity: PrimaryOpportunity;
}

export function PrimaryOpportunityCard({
  opportunity,
}: PrimaryOpportunityCardProps) {
  return (
    <SurfaceCard
      aria-labelledby="primary-opportunity-heading"
      className="sm:p-8"
    >
      <p className="text-[11px] font-semibold tracking-[0.14em] text-ra-accent">
        WHERE WE&apos;LL START
      </p>
      <h2
        id="primary-opportunity-heading"
        className="mt-3 text-xl font-semibold tracking-tight text-ra-ink sm:text-2xl"
      >
        {opportunity.title}
      </h2>
      <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-ra-muted">
        {opportunity.support}
      </p>
      <div className="mt-6">
        <ButtonPrimary type="button">{opportunity.actionLabel}</ButtonPrimary>
      </div>
    </SurfaceCard>
  );
}
