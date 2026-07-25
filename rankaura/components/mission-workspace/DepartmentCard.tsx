import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface DepartmentCardProps {
  departmentId: string;
  departmentName: string;
  title: string;
  subtitle?: string;
  confidence?: number;
  children: ReactNode;
  delay?: number;
  className?: string;
}

const DEPARTMENT_ACCENTS: Record<string, string> = {
  scout: "var(--color-aura)",
  writer: "var(--color-emerald)",
  architect: "#5b7c99",
  guardian: "#6b5b95",
  publisher: "var(--color-midnight)",
  sales: "var(--color-amber)",
  finance: "#4a7c59",
  operations: "#7c6b4a",
  support: "#4a6b7c",
  hiring: "#7c4a6b",
};

/**
 * Universal department section — plug in Sales, Finance, Operations, etc.
 */
export function DepartmentCard({
  departmentId,
  departmentName,
  title,
  subtitle,
  confidence,
  children,
  delay = 0,
  className,
}: DepartmentCardProps) {
  const accent = DEPARTMENT_ACCENTS[departmentId] ?? "var(--color-aura)";

  return (
    <section
      className={cn(
        "animate-fade-in rounded-2xl bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-md)] sm:p-10",
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
      data-department={departmentId}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            {departmentName}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
        {confidence !== undefined && (
          <p className="text-sm text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text-primary)]">{confidence}%</span>{" "}
            confidence
          </p>
        )}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
