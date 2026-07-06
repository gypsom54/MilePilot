import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { TeamMemberActivity } from "@/types/dashboard";

interface AiTeamActivityProps {
  activities: TeamMemberActivity[];
}

const statusLabels = {
  working: "Working",
  idle: "Standing by",
  complete: "Done",
} as const;

const statusVariants = {
  working: "aura" as const,
  idle: "muted" as const,
  complete: "success" as const,
};

/**
 * AI Team Activity feed.
 * Future: Scout, Writer, Optimiser, Architect, Publisher, Analyst → AuraCore
 */
export function AiTeamActivity({ activities }: AiTeamActivityProps) {
  return (
    <Card>
      <SectionHeader
        title="AI team activity"
        description="What your team has been up to"
      />
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-4 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {activity.name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">{activity.role}</p>
              <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
                {activity.summary}
              </p>
            </div>
            <Badge variant={statusVariants[activity.status]} className="shrink-0">
              {statusLabels[activity.status]}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
