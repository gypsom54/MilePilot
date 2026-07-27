import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { TimelineItem } from "@/components/ui/TimelineItem";
import type { RecentProgressItem } from "@/types/workspace";
import { PROGRESS_TYPE_LABELS } from "@/types/workspace";

interface RecentProgressProps {
  items: RecentProgressItem[];
}

/** Calm timeline of meaningful updates — not a social feed. */
export function RecentProgress({ items }: RecentProgressProps) {
  return (
    <SurfaceCard aria-labelledby="recent-progress-heading" className="sm:p-7">
      <h2
        id="recent-progress-heading"
        className="text-lg font-semibold text-ra-ink"
      >
        Recent progress
      </h2>
      <p className="mt-2 text-sm font-normal text-ra-muted">
        A calm timeline of the work RankAura has completed and the opportunities
        it has identified.
      </p>
      <ol className="mt-6 space-y-0">
        {items.map((item, index) => (
          <TimelineItem
            key={item.id}
            typeLabel={PROGRESS_TYPE_LABELS[item.type]}
            timestampLabel={item.timestampLabel}
            title={item.title}
            body={item.body}
            actionLabel={item.actionLabel}
            href={item.href}
            showConnector={index < items.length - 1}
          />
        ))}
      </ol>
    </SurfaceCard>
  );
}
