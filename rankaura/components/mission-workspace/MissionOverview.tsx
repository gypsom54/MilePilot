import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Mission } from "@/types/mission";

interface MissionOverviewProps {
  mission: Mission;
}

const impactLabels = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export function MissionOverview({ mission }: MissionOverviewProps) {
  return (
    <Card>
      <SectionHeader title="Mission Overview" description="What your Growth Team prepared for you" />

      <dl className="space-y-5">
        <div>
          <dt className="text-sm font-medium text-[var(--color-text-muted)]">Title</dt>
          <dd className="mt-1 text-base font-semibold text-[var(--color-text-primary)]">
            {mission.title}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-[var(--color-text-muted)]">Description</dt>
          <dd className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {mission.description}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-[var(--color-text-muted)]">
            Why Aura created this mission
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {mission.whyCreated}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-[var(--color-text-muted)]">
            Expected business outcome
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {mission.expectedOutcome}
          </dd>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background)] px-4 py-3">
            <dt className="text-xs text-[var(--color-text-muted)]">Estimated visibility increase</dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
              {mission.impact.visibilityIncrease}
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background)] px-4 py-3">
            <dt className="text-xs text-[var(--color-text-muted)]">Estimated lead increase</dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
              {mission.impact.leadIncrease}
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background)] px-4 py-3">
            <dt className="text-xs text-[var(--color-text-muted)]">Business impact</dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
              {impactLabels[mission.impact.businessImpact]}
            </dd>
          </div>
        </div>
      </dl>
    </Card>
  );
}
