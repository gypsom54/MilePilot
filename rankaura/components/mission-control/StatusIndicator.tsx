import { cn } from "@/utils/cn";
import type { DepartmentActivityState } from "@/types/activity";

interface StatusIndicatorProps {
  state: DepartmentActivityState;
  isActive?: boolean;
  color?: string;
  className?: string;
}

export function StatusIndicator({
  state,
  isActive = false,
  color,
  className,
}: StatusIndicatorProps) {
  const showPulse = isActive || state === "researching" || state === "writing" || state === "reviewing";

  return (
    <span
      className={cn(
        "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-500",
        showPulse && "animate-pulse-soft",
        state === "idle" && "bg-[var(--color-amber)]",
        state === "waiting" && "bg-[var(--color-amber)]",
        state === "complete" && "bg-[var(--color-emerald)]",
        (state === "researching" || state === "writing" || state === "reviewing") &&
          "bg-[var(--color-emerald)]",
        className,
      )}
      style={color && showPulse ? { backgroundColor: color } : undefined}
      aria-hidden
    />
  );
}
