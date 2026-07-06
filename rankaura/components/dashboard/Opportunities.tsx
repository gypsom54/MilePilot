import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Opportunity } from "@/types/dashboard";

interface OpportunitiesProps {
  opportunities: Opportunity[];
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

/**
 * Opportunities — actionable growth suggestions with impact estimates.
 * Future: Scout → AuraCore
 */
export function Opportunities({ opportunities }: OpportunitiesProps) {
  return (
    <Card delay={200}>
      <SectionHeader
        title="Opportunities"
        description="Ways to help more customers find you"
      />
      <ul className="space-y-5">
        {opportunities.map((opp) => (
          <li
            key={opp.id}
            className="rounded-xl border border-[var(--color-border-subtle)] p-6 transition-colors duration-200 hover:border-[var(--color-border)]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-base font-semibold text-[var(--color-text-primary)]">
                {opp.title}
              </p>
              <Badge variant={priorityVariants[opp.priority]} className="shrink-0">
                {priorityLabels[opp.priority]}
              </Badge>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {opp.description}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-[var(--color-border-subtle)] pt-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Estimated Visitors
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                  {opp.estimatedVisitors}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Potential Leads
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                  {opp.potentialLeads}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Confidence
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                  {opp.confidence}%
                </p>
              </div>
            </div>

            <div className="mt-5">
              <Button variant="secondary" className="w-full sm:w-auto">
                Review Opportunity
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
