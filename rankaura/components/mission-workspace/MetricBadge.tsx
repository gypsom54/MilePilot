import { cn } from "@/utils/cn";

interface MetricBadgeProps {
  label: string;
  value: string | number;
  variant?: "default" | "accent" | "success";
  className?: string;
}

const variants = {
  default: "border-[var(--color-border-subtle)] bg-[var(--color-background)]",
  accent: "border-[var(--color-aura)]/20 bg-[var(--color-aura-glow)]",
  success: "border-[var(--color-emerald-muted)] bg-[var(--color-emerald-muted)]/30",
};

export function MetricBadge({ label, value, variant = "default", className }: MetricBadgeProps) {
  return (
    <div className={cn("rounded-xl border px-4 py-3 transition-shadow duration-200 hover:shadow-[var(--shadow-sm)]", variants[variant], className)}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}
