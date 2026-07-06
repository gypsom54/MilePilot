import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "aura" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
  success: "bg-[var(--color-emerald-muted)] text-emerald-700",
  aura: "bg-[var(--color-aura-glow)] text-[var(--color-aura)]",
  muted: "bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
