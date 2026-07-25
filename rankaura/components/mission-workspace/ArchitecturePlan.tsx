import type { ArchitecturePlan as ArchitecturePlanData } from "@/types/mission";

interface ArchitecturePlanProps {
  plan: ArchitecturePlanData;
  delay?: number;
}

export function ArchitecturePlan({ plan, delay = 160 }: ArchitecturePlanProps) {
  return (
    <section
      className="animate-fade-in rounded-2xl bg-[var(--color-surface)] px-10 py-12 shadow-[var(--shadow-sm)] sm:px-12"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
        Architecture Plan
      </h2>

      <div className="mt-10 space-y-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Recommended location
          </p>
          <p className="mt-3 text-xl font-semibold text-[var(--color-text-primary)]">
            {plan.recommendedLocation}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Suggested internal links
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {plan.suggestedInternalLinks.map((link) => (
              <li
                key={link}
                className="rounded-xl bg-[var(--color-background)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]"
              >
                {link}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Suggested CTA
          </p>
          <p className="mt-3 text-lg font-medium text-[var(--color-text-primary)]">
            {plan.suggestedCta}
          </p>
        </div>
      </div>
    </section>
  );
}
