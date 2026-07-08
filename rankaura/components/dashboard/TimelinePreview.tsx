import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
        {events.map((event) => (
          <li key={event.id} className="flex gap-3">
            <span
              aria-hidden
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]"
            >
              {eventIcons[event.type]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {event.title}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                {event.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
