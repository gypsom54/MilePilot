import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MissionStatusBadge } from "@/components/mission-workspace/MissionStatusBadge";
import type { Mission } from "@/types/mission";

interface MissionHeaderProps {
  mission: Mission;
  onApprove?: () => void;
  onRequestChanges?: () => void;
  loading?: boolean;
  showActions?: boolean;
}

export function MissionHeader({
  mission,
  onApprove,
  onRequestChanges,
  loading = false,
  showActions = true,
}: MissionHeaderProps) {
  return (
    <header className="animate-fade-in border-b border-[var(--color-border-subtle)] pb-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
        Mission Workspace
      </p>

      <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl sm:leading-[1.1]">
        {mission.title}
      </h1>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <MissionStatusBadge label={mission.workspaceStatusLabel} status={mission.workspaceStatus} />
        <span className="rounded-full bg-[var(--color-aura-glow)] px-3 py-1 text-xs font-semibold text-[var(--color-aura)]">
          {mission.priorityLabel}
        </span>
        <span className="text-sm text-[var(--color-text-secondary)]">
          {mission.confidence}% confidence
        </span>
        <span className="text-sm text-[var(--color-text-muted)]">
          {mission.reviewTimeMinutes} min review
        </span>
      </div>

      <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
        Prepared by{" "}
        <span className="font-medium text-[var(--color-text-primary)]">
          {mission.preparedByDepartments.join(", ")}
        </span>
      </p>

      {showActions && (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {onApprove && (
            <Button className="px-8 py-4 text-base" onClick={onApprove} disabled={loading}>
              Approve Mission
            </Button>
          )}
          {onRequestChanges && (
            <Button
              variant="secondary"
              className="px-8 py-4 text-base"
              onClick={onRequestChanges}
              disabled={loading}
            >
              Request Changes
            </Button>
          )}
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-transparent px-6 py-4 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-aura)]"
          >
            Back to Mission Control
          </Link>
        </div>
      )}
    </header>
  );
}
