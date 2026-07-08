import { cn } from "@/utils/cn";
import type { DepartmentWorkflowStatus, MissionWorkspaceStatus } from "@/types/mission";

type StatusPillVariant = MissionWorkspaceStatus | DepartmentWorkflowStatus;

interface StatusPillProps {
  label: string;
  variant?: StatusPillVariant;
  className?: string;
}

const variantStyles: Record<string, string> = {
  in_review: "bg-[var(--color-aura-glow)] text-[var(--color-aura)]",
  approved: "bg-[var(--color-emerald-muted)] text-emerald-700",
  pending: "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
  revision_requested: "bg-amber-50 text-amber-700",
  saved_for_later: "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
  completed: "bg-[var(--color-emerald-muted)] text-emerald-700",
  draft_ready: "bg-[var(--color-aura-glow)] text-[var(--color-aura)]",
  passed: "bg-[var(--color-emerald-muted)] text-emerald-700",
  waiting_approval: "bg-amber-50 text-amber-700",
  in_progress: "bg-[var(--color-aura-glow)] text-[var(--color-aura)]",
};

export function StatusPill({ label, variant, className }: StatusPillProps) {
  const style = variant ? variantStyles[variant] : variantStyles.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
