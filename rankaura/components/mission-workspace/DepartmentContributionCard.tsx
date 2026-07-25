import { cn } from "@/utils/cn";
import type { DepartmentContribution } from "@/types/mission";

const DEPARTMENT_ACCENTS: Record<string, string> = {
  scout: "var(--color-aura)",
  writer: "var(--color-emerald)",
  architect: "#5b7c99",
  guardian: "#6b5b95",
  publisher: "var(--color-midnight)",
};

interface DepartmentContributionCardProps {
  contribution: DepartmentContribution;
  isLast?: boolean;
  delay?: number;
}

export function DepartmentContributionCard({
  contribution,
  isLast = false,
  delay = 0,
}: DepartmentContributionCardProps) {
  const accent = DEPARTMENT_ACCENTS[contribution.id] ?? "var(--color-aura)";
  const isWaiting = contribution.statusLabel.toLowerCase().includes("waiting");

  return (
    <div
      className={cn(
        "animate-fade-in relative pl-10",
        !isLast && "pb-12",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[11px] top-8 h-[calc(100%-1rem)] w-px bg-[var(--color-border-subtle)]"
        />
      )}
      <span
        aria-hidden
        className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-[var(--color-background)]"
        style={{ borderColor: accent }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: isWaiting ? "transparent" : accent }}
        />
      </span>

      <div className="rounded-2xl bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: accent }}
            >
              {contribution.departmentName}
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">
              {contribution.statusLabel}
            </p>
          </div>
          {contribution.confidence !== undefined && (
            <p className="text-sm text-[var(--color-text-muted)]">
              Confidence:{" "}
              <span className="font-semibold text-[var(--color-text-primary)]">
                {contribution.confidence}%
              </span>
            </p>
          )}
          {contribution.score !== undefined && (
            <p className="text-sm text-[var(--color-text-muted)]">
              Score:{" "}
              <span className="font-semibold text-[var(--color-text-primary)]">
                {contribution.score}
              </span>
            </p>
          )}
        </div>

        <ul className="mt-6 space-y-2.5">
          {contribution.outputs.map((output) => (
            <li
              key={output}
              className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text-secondary)]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border)]" />
              {output}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
