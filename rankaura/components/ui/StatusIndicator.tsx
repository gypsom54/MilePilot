import type { EmployeeActivityStatus } from "@/types/dashboard";
import { cn } from "@/utils/cn";

interface StatusIndicatorProps {
  status: EmployeeActivityStatus;
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
        status === "working" && "bg-[var(--color-emerald)] animate-pulse-soft",
        status === "idle" && "bg-[var(--color-amber)]",
        status === "complete" && "bg-[var(--color-emerald)]",
        className,
      )}
      aria-hidden
    />
  );
}
