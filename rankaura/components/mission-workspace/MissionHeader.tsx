import Link from "next/link";
import { MissionStatusBadge } from "@/components/mission-workspace/MissionStatusBadge";
import type { Mission } from "@/types/mission";

interface MissionHeaderProps {
  mission: Mission;
}

export function MissionHeader({ mission }: MissionHeaderProps) {
  return (
    <header className="animate-fade-in pb-4">
      <Link
        href="/"
        className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-aura)]"
      >
        ← Mission Control
      </Link>

      <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Mission Workspace
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <MissionStatusBadge label={mission.workspaceStatusLabel} status={mission.workspaceStatus} />
        <span className="text-sm text-[var(--color-text-muted)]">
          {mission.reviewTimeMinutes} min review
        </span>
      </div>

      <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl sm:leading-tight">
        {mission.title}
      </h1>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Business impact
          </p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            {mission.priorityLabel}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Confidence
          </p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            {mission.confidence}%
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Est. leads
          </p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            {mission.briefingImpact.potentialLeads}/month
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Prepared by
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--color-text-primary)]">
            {mission.preparedByDepartments.join(" · ")}
          </p>
        </div>
      </div>
    </header>
  );
}
