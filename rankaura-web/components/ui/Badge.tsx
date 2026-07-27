import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type BadgeVariant =
  | "approval"
  | "prepared"
  | "completed"
  | "monitoring"
  | "connected"
  | "waiting"
  | "info";

const variantClassName: Record<BadgeVariant, string> = {
  approval:
    "border-[#f0d9a8] bg-ra-warning-soft text-ra-warning",
  prepared: "border-[#c5d4f5] bg-ra-info-soft text-ra-info",
  completed: "border-[#b7e6d2] bg-ra-success-soft text-ra-success",
  monitoring: "border-ra-border bg-ra-neutral-soft text-ra-neutral",
  connected: "border-[#b7e6d2] bg-ra-success-soft text-ra-success",
  waiting: "border-[#f0d9a8] bg-ra-warning-soft text-ra-warning",
  info: "border-[#c5d4f5] bg-ra-info-soft text-ra-info",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/** Map free-form status labels to badge variants. */
export function badgeVariantFromLabel(label: string): BadgeVariant {
  const value = label.toLowerCase();
  if (value.includes("approval") || value.includes("waiting")) return "approval";
  if (value.includes("prepared") || value.includes("recommendation"))
    return "prepared";
  if (value.includes("completed") || value.includes("complete") || value.includes("done"))
    return "completed";
  if (value.includes("monitor")) return "monitoring";
  if (value.includes("connected")) return "connected";
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
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium",
        variantClassName[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
