import { cn } from "@/utils/cn";

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
  animated?: boolean;
  maxWidth?: string;
}

export function ProgressBar({
  value,
  className,
  barClassName,
  animated = true,
  maxWidth,
}: ProgressBarProps) {
  return (
    <div
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-[var(--color-border-subtle)]",
        maxWidth,
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-[var(--color-aura)]",
          animated && "animate-progress-fill",
          barClassName,
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
