import { cn } from "@/utils/cn";

interface ConfidenceBadgeProps {
  confidence: number;
  className?: string;
}

export function ConfidenceBadge({ confidence, className }: ConfidenceBadgeProps) {
  const variant =
    confidence >= 90 ? "high" : confidence >= 75 ? "medium" : "low";

  const variantStyles = {
    high: "bg-[var(--color-aura-glow)] text-[var(--color-aura)]",
    medium: "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
    low: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {confidence}% confidence
    </span>
  );
}
