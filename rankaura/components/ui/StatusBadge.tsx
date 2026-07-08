import { cn } from "@/utils/cn";
import type { EmployeeActivityStatus } from "@/types/dashboard";
import type { BusinessHealthStatus } from "@/types/dashboard";

type StatusBadgeKind = EmployeeActivityStatus | BusinessHealthStatus | "approved" | "deferred";

interface StatusBadgeProps {
  status: StatusBadgeKind;
  className?: string;
}

const statusLabels: Record<StatusBadgeKind, string> = {
  working: "Working",
  idle: "Standing by",
  complete: "Complete",
  healthy: "Healthy",
  attention: "Needs attention",
  critical: "Critical",
  approved: "Approved",
  deferred: "Deferred",
};

const statusStyles: Record<StatusBadgeKind, string> = {
  working: "bg-[var(--color-emerald-muted)] text-emerald-700",
  idle: "bg-amber-50 text-amber-700",
  complete: "bg-[var(--color-emerald-muted)] text-emerald-700",
  healthy: "bg-[var(--color-emerald-muted)] text-emerald-700",
  attention: "bg-amber-50 text-amber-700",
  critical: "bg-red-50 text-red-700",
  approved: "bg-[var(--color-emerald-muted)] text-emerald-700",
  deferred: "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
