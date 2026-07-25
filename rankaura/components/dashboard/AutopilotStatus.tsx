import type { DashboardAutopilot } from "@/types/dashboard";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface AutopilotStatusProps {
  autopilot: DashboardAutopilot;
}

/**
 * Marketing Autopilot — reassuring background operations.
 * Future: AuraCore orchestration + Publisher
 */
export function AutopilotStatus({ autopilot }: AutopilotStatusProps) {
  return (
    <Card delay={120} className="border-[var(--color-border)]">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          title="Marketing Autopilot"
          description="Everything running smoothly"
        />
        {autopilot.enabled && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-emerald-muted)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-emerald)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-emerald)] animate-pulse-soft" />
            Active
          </span>
        )}
      </div>

      <p className="text-sm font-medium text-[var(--color-text-primary)]">
        Aura is currently:
      </p>

      <ul className="mt-3 space-y-2">
        {autopilot.activities.map((activity) => (
          <li
            key={activity}
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
          >
            <span className="text-[var(--color-emerald)]" aria-hidden>
              ✓
            </span>
            {activity}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs text-[var(--color-text-muted)]">
        Last completed task:{" "}
        <span className="font-medium text-[var(--color-text-secondary)]">
          {autopilot.lastCompletedTask}
        </span>
      </p>
    </Card>
  );
}
