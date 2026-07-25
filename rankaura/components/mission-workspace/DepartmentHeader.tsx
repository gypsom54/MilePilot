import type { ReactNode } from "react";

interface DepartmentHeaderProps {
  department: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  delay?: number;
}

const DEPARTMENT_ICONS: Record<string, string> = {
  Scout: "🔍",
  Writer: "✍️",
  Architect: "🏗️",
  Guardian: "🛡️",
  Publisher: "📤",
  Impact: "📈",
  Approval: "✓",
};

export function DepartmentHeader({
  department,
  title,
  description,
  icon,
  delay = 0,
}: DepartmentHeaderProps) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-lg">{icon ?? DEPARTMENT_ICONS[department] ?? "•"}</span>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {department}
        </p>
      </div>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
      )}
    </div>
  );
}
