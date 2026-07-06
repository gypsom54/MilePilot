import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Opportunity } from "@/types/dashboard";

interface OpportunitiesProps {
  opportunities: Opportunity[];
}

const priorityVariants = {
  high: "aura" as const,
  medium: "default" as const,
  low: "muted" as const,
};

/**
 * Opportunities — actionable growth suggestions.
 * Future: Scout → AuraCore
 */
export function Opportunities({ opportunities }: OpportunitiesProps) {
  return (
    <Card>
      <SectionHeader
        title="Opportunities"
        description="Ways to help more customers find you"
      />
      <ul className="space-y-4">
        {opportunities.map((opp) => (
          <li
            key={opp.id}
            className="rounded-lg border border-[var(--color-border-subtle)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {opp.title}
              </p>
              <Badge variant={priorityVariants[opp.priority]} className="shrink-0 capitalize">
                {opp.priority}
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
              {opp.description}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
