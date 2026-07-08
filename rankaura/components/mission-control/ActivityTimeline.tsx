import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/utils/cn";
import type { ActivityTimelineEvent } from "@/types/activity";

interface ActivityTimelineProps {
  events: ActivityTimelineEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <Card delay={180} className="transition-shadow duration-300">
      <SectionHeader
        title="Timeline Preview"
        description="Live updates from your Growth Team"
      />
      <ul className="space-y-3">
        {events.map((event, index) => {
          const isNew = index === 0;

          return (
            <li
              key={event.id}
              className={cn(
                "flex gap-3 rounded-lg px-2 py-2 transition-all duration-500",
                isNew && "animate-fade-in bg-[var(--color-background)]",
              )}
            >
              <span
                aria-hidden
                className="mt-1 h-2 w-2 shrink-0 rounded-full transition-colors duration-500"
                style={{ backgroundColor: event.departmentColor }}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm transition-colors duration-300",
                    isNew
                      ? "font-medium text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)]",
                  )}
                >
                  {event.message}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <span style={{ color: event.departmentColor }}>{event.departmentName}</span>
                  <span aria-hidden>·</span>
                  <time>{event.timestamp}</time>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
