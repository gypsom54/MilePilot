import Link from "next/link";
import { StatusPill } from "@/components/mission-workspace/StatusPill";
import type { Mission } from "@/types/mission";

interface MissionHeaderProps {
  mission: Mission;
}

const impactLabels = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export function MissionHeader({ mission }: MissionHeaderProps) {
  return (
    <header className="animate-fade-in">
      <Link
        href="/"
        className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-aura)]"
      >
        ← Mission Control
      </Link>

      <p className="mt-6 text-sm font-medium text-[var(--color-text-muted)]">Mission Workspace</p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-sm text-[var(--color-text-secondary)]">Mission Status</span>
        <StatusPill label={mission.workspaceStatusLabel} variant={mission.workspaceStatus} />
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        {mission.title}
      </h1>

      {mission.approvalMessage && mission.workspaceStatus === "approved" && (
        <p className="mt-4 rounded-xl border border-[var(--color-emerald-muted)] bg-[var(--color-emerald-muted)]/30 px-4 py-3 text-sm font-medium text-emerald-800">
          Mission Approved — {mission.approvalMessage}
        </p>
      )}

      <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Estimated completion</dt>
          <dd className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {mission.estimatedCompletion}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Business impact</dt>
          <dd className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {impactLabels[mission.impact.businessImpact]}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Confidence</dt>
          <dd className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {mission.impact.confidence}%
          </dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Estimated management time</dt>
          <dd className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {mission.impact.managementTimeMinutes} minutes
          </dd>
        </div>
      </dl>
    </header>
  );
}
