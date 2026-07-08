import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/utils/cn";
import type { MissionTimelineEvent } from "@/types/mission";

interface TimelineCardProps {
  events: MissionTimelineEvent[];
}

export function TimelineCard({ events }: TimelineCardProps) {
  return (
    <Card>
      <SectionHeader title="Timeline" description="Activity on this mission" />
      <ul className="space-y-4">
        {events.map((event, index) => {
          const isLatest = index === 0;

          return (
            <li
              key={event.id}
              className={cn(
                "flex gap-4",
                isLatest && event.type === "mission" && "rounded-lg bg-[var(--color-emerald-muted)]/30 px-3 py-2 -mx-3",
              )}
            >
              <time
                className={cn(
                  "shrink-0 text-sm font-medium tabular-nums",
                  isLatest ? "text-emerald-700" : "text-[var(--color-text-muted)]",
                )}
              >
                {event.time}
              </time>
              <p
                className={cn(
                  "text-sm",
                  isLatest
                    ? "font-medium text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)]",
                )}
              >
                {event.title}
              </p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
