import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusIndicator } from "@/components/mission-control/StatusIndicator";
import { cn } from "@/utils/cn";
import type { DepartmentActivity } from "@/types/activity";

interface DepartmentActivityProps {
  departments: DepartmentActivity[];
}

function ActivityProgress({ value, color, isActive }: { value: number; color: string; isActive: boolean }) {
  return (
    <div className="mt-3 h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          isActive && "animate-progress-fill",
        )}
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function DepartmentActivityPanel({ departments }: DepartmentActivityProps) {
  return (
    <Card delay={120} className="transition-shadow duration-300">
      <SectionHeader
        title="Growth Team Status"
        description="Your AI employees working right now"
      />
      <ul className="space-y-5">
        {departments.map((dept) => (
          <li
            key={dept.id}
            className={cn(
              "flex gap-3 rounded-lg px-2 py-2 transition-all duration-500",
              dept.isActive && "bg-[var(--color-background)]",
            )}
          >
            <StatusIndicator state={dept.state} isActive={dept.isActive} color={dept.color} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{dept.name}</p>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors duration-500"
                  style={{
                    backgroundColor: `${dept.color}18`,
                    color: dept.color,
                  }}
                >
                  {dept.stateLabel}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)] transition-all duration-500">
                {dept.activityText}
              </p>
              <ActivityProgress value={dept.progress} color={dept.color} isActive={dept.isActive} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
