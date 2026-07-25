import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DashboardOpportunity } from "@/types/dashboard";

interface OpportunityCardProps {
  opportunity: DashboardOpportunity;
}

const priorityLabels = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
} as const;

const priorityVariants = {
  high: "aura" as const,
  medium: "default" as const,
  low: "muted" as const,
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)] p-6 transition-colors duration-200 hover:border-[var(--color-border)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold text-[var(--color-text-primary)]">
          {opportunity.title}
        </p>
        <Badge variant={priorityVariants[opportunity.priority]} className="shrink-0">
          {priorityLabels[opportunity.priority]}
        </Badge>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {opportunity.description}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-[var(--color-border-subtle)] pt-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Estimated Visitors
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {opportunity.estimatedVisitors}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Potential Leads
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {opportunity.potentialLeads}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Confidence
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {opportunity.confidence}%
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Button variant="secondary" className="w-full sm:w-auto">
          Review Opportunity
        </Button>
      </div>
    </div>
  );
}
