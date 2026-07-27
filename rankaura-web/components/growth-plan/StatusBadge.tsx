import type { CategoryStatus } from "@/types/growthPlan";
import { CATEGORY_STATUS_LABELS } from "@/types/growthPlan";
import { cn } from "@/utils/cn";

interface StatusBadgeProps {
  status: CategoryStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = CATEGORY_STATUS_LABELS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        status === "complete" && "bg-[#e8f8f1] text-[#1f8a62]",
        status === "in_progress" && "bg-[#eef3ff] text-[#3b6fd4]",
        status === "planned" && "bg-[#f4f6f8] text-[#6b7280]",
        status === "monitoring" && "bg-[#f3f0ff] text-[#5b5f97]",
        status === "waiting_for_approval" && "bg-[#fff6e8] text-[#a16207]",
      )}
    >
      {label}
    </span>
  );
}
