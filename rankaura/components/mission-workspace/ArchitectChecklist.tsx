import { Card } from "@/components/ui/Card";
import { DepartmentHeader } from "@/components/mission-workspace/DepartmentHeader";
import { MetricBadge } from "@/components/mission-workspace/MetricBadge";
import { cn } from "@/utils/cn";
import type { ArchitectReview } from "@/types/mission";

interface ArchitectChecklistProps {
  review: ArchitectReview;
  delay?: number;
}

function CheckItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          passed ? "bg-[var(--color-emerald-muted)] text-emerald-700" : "bg-[var(--color-border-subtle)] text-[var(--color-text-muted)]",
        )}
      >
        {passed ? "✓" : "–"}
      </span>
      <span className={passed ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}>
        {label}
      </span>
    </li>
  );
}

export function ArchitectChecklist({ review, delay = 160 }: ArchitectChecklistProps) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-[var(--shadow-md)]" delay={delay}>
      <DepartmentHeader
        department="Architect"
        title="Architect Review"
        description="Page structure and discoverability"
      />

      <div className="mt-6">
        <MetricBadge label="Structure score" value={`${review.structureScore}/100`} variant="success" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Page structure</p>
          <ul className="mt-3 space-y-2">
            {review.pageStructure.map((item) => (
              <li key={item} className="text-sm text-[var(--color-text-secondary)]">• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Heading hierarchy</p>
          <ul className="mt-3 space-y-2">
            {review.headingHierarchy.map((item) => (
              <li key={item} className="font-mono text-xs text-[var(--color-text-secondary)]">{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Internal links</p>
          <ul className="mt-3 space-y-2">
            {review.internalLinks.map((item) => (
              <li key={item} className="text-sm text-[var(--color-text-secondary)]">→ {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Related pages</p>
          <ul className="mt-3 space-y-2">
            {review.relatedPages.map((item) => (
              <li key={item} className="text-sm text-[var(--color-text-secondary)]">• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background)] p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Checklist</p>
        <ul className="mt-4 space-y-3">
          {review.checklist.map((item) => (
            <CheckItem key={item.id} label={item.label} passed={item.passed} />
          ))}
        </ul>
      </div>
    </Card>
  );
}
