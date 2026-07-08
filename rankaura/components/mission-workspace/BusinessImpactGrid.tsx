import type { BusinessImpact } from "@/types/mission";

interface BusinessImpactGridProps {
  impact: BusinessImpact;
  delay?: number;
}

const KPI_ITEMS: {
  key: keyof BusinessImpact;
  label: string;
  format: (value: number) => string;
}[] = [
  { key: "estimatedMonthlyVisitors", label: "Estimated monthly visitors", format: (v) => String(v) },
  { key: "potentialEnquiries", label: "Potential enquiries", format: (v) => `${v}/month` },
  { key: "confidence", label: "Confidence", format: (v) => `${v}%` },
  { key: "managementTimeMinutes", label: "Management time", format: (v) => `${v} minutes` },
  { key: "estimatedTimeSavedHours", label: "Estimated time saved", format: (v) => `${v} hours` },
];

export function BusinessImpactGrid({ impact, delay = 200 }: BusinessImpactGridProps) {
  return (
    <section
      className="animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
        Business Impact
      </h2>
      <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
        Projected outcomes if you approve this mission.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KPI_ITEMS.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl bg-[var(--color-surface)] px-8 py-8 shadow-[var(--shadow-sm)]"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              {item.label}
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
              {item.format(impact[item.key])}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
