import { DepartmentContributionCard } from "@/components/mission-workspace/DepartmentContributionCard";
import type { DepartmentContribution } from "@/types/mission";

interface DepartmentWorkflowProps {
  contributions: DepartmentContribution[];
  delay?: number;
}

export function DepartmentWorkflow({ contributions, delay = 80 }: DepartmentWorkflowProps) {
  return (
    <section className="animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
        Department Workflow
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-secondary)]">
        Each department has completed its work. Review their contributions before approving.
      </p>

      <div className="mt-10">
        {contributions.map((contribution, index) => (
          <DepartmentContributionCard
            key={contribution.id}
            contribution={contribution}
            isLast={index === contributions.length - 1}
            delay={delay + index * 60}
          />
        ))}
      </div>
    </section>
  );
}
