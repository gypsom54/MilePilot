import { StatusPill } from "@/components/mission-workspace/StatusPill";
import type { DepartmentStatus } from "@/types/mission";

interface DepartmentCardProps {
  department: DepartmentStatus;
  isLast?: boolean;
}

export function DepartmentCard({ department, isLast = false }: DepartmentCardProps) {
  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[11px] top-8 h-[calc(100%+1rem)] w-px bg-[var(--color-border-subtle)]"
        />
      )}

      <span
        aria-hidden
        className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        <span className="h-2 w-2 rounded-full bg-[var(--color-aura)]" />
      </span>

      <div className="min-w-0 flex-1 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            {department.name}
          </h3>
          <StatusPill label={department.statusLabel} variant={department.status} />
        </div>

        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          Output
        </p>
        <ul className="mt-2 space-y-1.5">
          {department.outputs.map((output) => (
            <li key={output} className="text-sm text-[var(--color-text-secondary)]">
              {output}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
