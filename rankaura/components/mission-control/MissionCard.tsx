import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { DashboardMission } from "@/types/dashboard";

interface MissionCardProps {
  mission: DashboardMission;
}

const impactLabels = {
  high: "High impact",
  medium: "Medium impact",
  low: "Low impact",
} as const;

/**
 * Single high-priority mission display — informational only.
 * Primary CTA lives in MorningBrief.
 */
export function MissionCard({ mission }: MissionCardProps) {
  return (
    <Card
      delay={60}
      className="border-[var(--color-aura)]/20 bg-[var(--color-surface)] transition-all duration-300"
    >
      <SectionHeader
        title="Today's Mission"
        description="The one thing that matters most today"
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)] transition-colors duration-300">
            {mission.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {mission.reason}
          </p>
        </div>
        {mission.status !== "pending" && (
          <StatusBadge status={mission.status === "approved" ? "approved" : "deferred"} />
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Badge variant="aura">{impactLabels[mission.impact]}</Badge>
        <ConfidenceBadge confidence={mission.confidence} />
        <span className="text-sm text-[var(--color-text-muted)]">
          {mission.timeRequiredMinutes} min to review
        </span>
      </div>
    </Card>
  );
}
