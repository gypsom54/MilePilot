import { cn } from "@/utils/cn";
import type { MissionWorkspaceStatus } from "@/types/mission";

interface MissionStatusBadgeProps {
  label: string;
  status: MissionWorkspaceStatus;
  className?: string;
}

const statusStyles: Record<string, string> = {
  ready_for_approval: "bg-[var(--color-aura-glow)] text-[var(--color-aura)]",
  in_review: "bg-[var(--color-aura-glow)] text-[var(--color-aura)]",
  approved: "bg-[var(--color-emerald-muted)] text-emerald-700",
  revision_requested: "bg-amber-50 text-amber-700",
  saved_for_later: "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
  archived: "bg-[var(--color-border-subtle)] text-[var(--color-text-muted)]",
  pending: "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
};

export function MissionStatusBadge({ label, status, className }: MissionStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status] ?? statusStyles.pending,
        className,
      )}
    >
      {label}
    </span>
  );
}
