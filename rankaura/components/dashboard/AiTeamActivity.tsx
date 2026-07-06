import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import type { TeamMemberActivity } from "@/types/dashboard";

interface AiTeamActivityProps {
  activities: TeamMemberActivity[];
}

function StatusIndicator({ status }: { status: TeamMemberActivity["status"] }) {
  return (
    <span
      className={cn(
        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
        status === "working" && "bg-[var(--color-emerald)] animate-pulse-soft",
        status === "idle" && "bg-[var(--color-amber)]",
        status === "complete" && "bg-[var(--color-emerald)]",
      )}
      aria-hidden
    />
  );
}

/**
 * Your AI Team — alive employee feed.
 * Future: Scout, Writer, Optimiser, Architect, Publisher, Analyst → AuraCore
 */
export function AiTeamActivity({ activities }: AiTeamActivityProps) {
  return (
    <Card delay={80}>
      <SectionHeader
        title="Your AI Team"
        description="Working for you right now"
      />
      <ul className="space-y-5">
        {activities.map((activity) => (
          <li key={activity.id} className="flex gap-3">
            <StatusIndicator status={activity.status} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {activity.name}
              </p>
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                {activity.task}
              </p>
              {activity.progress !== undefined && activity.status === "working" && (
                <div className="mt-2.5 h-1 w-full max-w-[140px] overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-aura)] animate-progress-fill"
                    style={{ width: `${activity.progress}%` }}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
