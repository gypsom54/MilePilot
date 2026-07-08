import { Badge } from "@/components/ui/Badge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import type { DashboardMission } from "@/types/dashboard";

const impactLabels = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

interface MissionReviewProps {
  mission: DashboardMission;
}

/**
 * Mission Review content — reusable sections for modal or dedicated views.
 */
export function MissionReview({ mission }: MissionReviewProps) {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">Mission Review</p>
        <h2
          id="mission-review-title"
          className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-text-primary)]"
        >
          {mission.title}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="aura">{impactLabels[mission.impact]} impact</Badge>
          <ConfidenceBadge confidence={mission.confidence} />
          <span className="text-sm text-[var(--color-text-muted)]">
            {mission.timeRequiredMinutes} minutes to review
          </span>
        </div>
      </header>

      <section>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Why this matters
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {mission.reason}
        </p>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Expected business impact
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {mission.expectedOutcome}
        </p>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Departments involved
        </h3>
        <ul className="mt-3 space-y-3">
          {mission.departments.map((dept) => (
            <li
              key={dept.id}
              className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background)] px-4 py-3"
            >
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {dept.name}
              </p>
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                {dept.contribution}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          What happens if you approve
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {mission.onApproveSummary}
        </p>
      </section>
    </div>
  );
}
