import type { CategoryStatus } from "@/types/growthPlan";
import { CATEGORY_STATUS_LABELS } from "@/types/growthPlan";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

interface StatusBadgeProps {
  status: CategoryStatus;
}

const STATUS_VARIANT: Record<CategoryStatus, BadgeVariant> = {
  complete: "completed",
  in_progress: "prepared",
  planned: "monitoring",
  monitoring: "monitoring",
  waiting_for_approval: "approval",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {CATEGORY_STATUS_LABELS[status]}
    </Badge>
  );
}
