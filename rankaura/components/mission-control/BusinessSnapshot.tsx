import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { BusinessSnapshotData } from "@/types/activity";

interface BusinessSnapshotProps {
  snapshot: BusinessSnapshotData;
}

export function BusinessSnapshot({ snapshot }: BusinessSnapshotProps) {
  const metrics = [
    { label: "Growth", value: `+${snapshot.growthPercent}%` },
    { label: "Estimated leads", value: snapshot.estimatedLeads },
    { label: "Visibility trend", value: snapshot.visibilityTrend },
    { label: "Hours saved", value: `${snapshot.hoursSaved} hrs` },
    { label: "Pending reviews", value: String(snapshot.pendingReviews) },
  ];

  return (
    <Card delay={140} className="transition-shadow duration-300">
      <div className="flex items-center justify-between gap-2">
        <SectionHeader title="Business Snapshot" description={snapshot.statusLabel} />
        <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-emerald)] animate-pulse-soft" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background)] px-3 py-3 transition-colors duration-300"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              {metric.label}
            </p>
            <p className="mt-1 text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
