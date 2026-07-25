import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/utils/cn";
import type { DashboardTimelineEvent } from "@/types/dashboard";

interface TimelinePreviewProps {
  events: DashboardTimelineEvent[];
}

const eventIcons: Record<DashboardTimelineEvent["type"], string> = {
  mission: "✓",
  team: "•",
  system: "○",
};

export function TimelinePreview({ events }: TimelinePreviewProps) {
  return (
    <Card delay={180}>
      <SectionHeader
        title="Timeline Preview"
        description="Recent activity from your Growth Team"
      />
      <ul className="space-y-4">
        {events.map((event, index) => {
          const isNewApproval = event.type === "mission" && index === 0;

          return (
            <li
              key={event.id}
              className={cn(
                "flex gap-3 rounded-lg transition-colors duration-300",
                isNewApproval && "bg-[var(--color-emerald-muted)]/40 px-3 py-2 -mx-3",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                  isNewApproval
                    ? "bg-[var(--color-emerald-muted)] text-emerald-700"
                    : "bg-[var(--color-border-subtle)] text-[var(--color-text-muted)]",
                )}
              >
                {eventIcons[event.type]}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isNewApproval
                      ? "text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-primary)]",
                  )}
                >
                  {event.title}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    isNewApproval
                      ? "font-medium text-emerald-700"
                      : "text-[var(--color-text-muted)]",
                  )}
                >
                  {event.timestamp}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
