"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MissionStatusBadge } from "@/components/mission-workspace/MissionStatusBadge";
import { MetricBadge } from "@/components/mission-workspace/MetricBadge";
import type { Mission } from "@/types/mission";

interface MissionHeaderProps {
  mission: Mission;
  onApprove: () => void;
  onRequestChanges: () => void;
  loading?: boolean;
}

export function MissionHeader({
  mission,
  onApprove,
  onRequestChanges,
  loading = false,
}: MissionHeaderProps) {
  const isActionable =
    mission.workspaceStatus === "ready_for_approval" ||
    mission.workspaceStatus === "in_review" ||
    mission.workspaceStatus === "pending";

  return (
    <header className="animate-fade-in rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)]">
      <Link
        href="/"
        className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-aura)]"
      >
        ← Mission Control
      </Link>

      <p className="mt-6 text-sm font-medium text-[var(--color-text-muted)]">Mission Workspace</p>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            {mission.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{mission.missionTypeLabel}</p>
        </div>
        <MissionStatusBadge label={mission.workspaceStatusLabel} status={mission.workspaceStatus} />
      </div>

      {mission.approvalMessage && mission.workspaceStatus === "approved" && (
        <p className="mt-4 animate-fade-in rounded-xl border border-[var(--color-emerald-muted)] bg-[var(--color-emerald-muted)]/30 px-4 py-3 text-sm font-medium text-emerald-800">
          Mission Approved — {mission.approvalMessage}
        </p>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricBadge label="Priority" value={mission.priorityLabel} variant="accent" />
        <MetricBadge label="Confidence" value={`${mission.confidence}%`} />
        <MetricBadge label="Review time" value={`${mission.reviewTimeMinutes} min`} />
        <MetricBadge label="Status" value={mission.workspaceStatusLabel} variant="success" />
      </div>

      {isActionable && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button className="min-w-[180px] px-8 py-4 text-base" onClick={onApprove} disabled={loading}>
            Approve Mission
          </Button>
          <Button variant="secondary" onClick={onRequestChanges} disabled={loading}>
            Request Changes
          </Button>
        </div>
      )}
    </header>
  );
}
