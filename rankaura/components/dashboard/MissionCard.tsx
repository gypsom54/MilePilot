import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { getMissionCardConfirmationCopy } from "@/components/dashboard/mission-review/missionCardCopy";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { DashboardMission } from "@/types/dashboard";

interface MissionCardProps {
  mission: DashboardMission;
  onReview: () => void;
}

const impactLabels = {
  high: "High impact",
  medium: "Medium impact",
  low: "Low impact",
} as const;

export function MissionCard({ mission, onReview }: MissionCardProps) {
  const isActionable = mission.status === "pending";

  return (
    <Card delay={60} className="border-[var(--color-aura)]/20 bg-[var(--color-surface)]">
      <SectionHeader
        title="Today's Mission"
        description="The one thing that matters most today"
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
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

      {isActionable && (
        <div className="mt-8">
          <Button className="min-w-[200px] px-8 py-4 text-base" onClick={onReview}>
            {mission.ctaLabel}
          </Button>
        </div>
      )}

      {mission.status === "approved" && (
        <p className="mt-6 text-sm font-medium text-[var(--color-emerald)]">
          {getMissionCardConfirmationCopy(mission)}
        </p>
      )}
    </Card>
  );
}
