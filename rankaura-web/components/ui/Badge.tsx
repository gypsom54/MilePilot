import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type BadgeVariant =
  | "approval"
  | "prepared"
  | "completed"
  | "monitoring"
  | "connected"
  | "waiting"
  | "info"
  | "planned";

const variantClassName: Record<BadgeVariant, string> = {
  approval:
    "border-ra-warning-border bg-ra-warning-soft text-ra-warning",
  prepared: "border-ra-info-border bg-ra-info-soft text-ra-info",
  completed: "border-ra-success-border bg-ra-success-soft text-ra-success",
  monitoring: "border-ra-border-strong bg-ra-neutral-soft text-ra-neutral",
  connected: "border-ra-success-border bg-ra-success-soft text-ra-success",
  waiting: "border-ra-warning-border bg-ra-warning-soft text-ra-warning",
  info: "border-ra-info-border bg-ra-info-soft text-ra-info",
  planned: "border-ra-border-strong bg-ra-neutral-soft text-ra-neutral",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/** Map free-form status labels to badge variants. */
export function badgeVariantFromLabel(label: string): BadgeVariant {
  const value = label.toLowerCase();
  if (value.includes("ready for approval") || value.includes("awaiting"))
    return "approval";
  if (value.includes("waiting")) return "waiting";
  if (value.includes("prepared") || value.includes("recommendation"))
    return "prepared";
  if (
    value.includes("completed") ||
    value.includes("complete") ||
    value.includes("done") ||
    value.includes("research completed")
  )
    return "completed";
  if (value.includes("monitor")) return "monitoring";
  if (value.includes("connected")) return "connected";
  if (value.includes("planned") || value.includes("coming next"))
    return "planned";
  if (value.includes("research")) return "completed";
  return "info";
}

export function Badge({
  children,
  variant = "info",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium leading-none",
        variantClassName[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
