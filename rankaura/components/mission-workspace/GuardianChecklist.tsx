import { Card } from "@/components/ui/Card";
import { DepartmentHeader } from "@/components/mission-workspace/DepartmentHeader";
import { MetricBadge } from "@/components/mission-workspace/MetricBadge";
import { cn } from "@/utils/cn";
import type { GuardianReview } from "@/types/mission";

interface GuardianChecklistProps {
  review: GuardianReview;
  delay?: number;
}

export function GuardianChecklist({ review, delay = 200 }: GuardianChecklistProps) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-[var(--shadow-md)]" delay={delay}>
      <DepartmentHeader
        department="Guardian"
        title="Guardian Review"
        description="Quality, compliance, and brand standards"
      />

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <MetricBadge label="Quality score" value={review.scoreLabel} variant="success" />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {review.checks.map((check) => (
          <div
            key={check.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 hover:shadow-[var(--shadow-sm)]",
              check.passed
                ? "border-[var(--color-emerald-muted)] bg-[var(--color-emerald-muted)]/20"
                : "border-[var(--color-border-subtle)] bg-[var(--color-background)]",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold",
                check.passed ? "bg-[var(--color-emerald)] text-white" : "bg-[var(--color-border-subtle)]",
              )}
            >
              {check.passed ? "✓" : "–"}
            </span>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">{check.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
