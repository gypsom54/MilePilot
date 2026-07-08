import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { DashboardTeamMember } from "@/types/dashboard";

interface AIEmployeeCardProps {
  employee: DashboardTeamMember;
}

export function AIEmployeeCard({ employee }: AIEmployeeCardProps) {
  return (
    <div className="flex gap-3">
      <StatusIndicator status={employee.status} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          {employee.name}
        </p>
        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{employee.task}</p>
        {employee.progress !== undefined && employee.status === "working" && (
          <ProgressBar
            value={employee.progress}
            className="mt-2.5"
            maxWidth="max-w-[140px]"
          />
        )}
      </div>
    </div>
  );
}
