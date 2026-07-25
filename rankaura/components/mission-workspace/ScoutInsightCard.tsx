"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { DepartmentHeader } from "@/components/mission-workspace/DepartmentHeader";
import { MetricBadge } from "@/components/mission-workspace/MetricBadge";
import { cn } from "@/utils/cn";
import type { ScoutReport } from "@/types/mission";

interface ScoutInsightCardProps {
  report: ScoutReport;
  delay?: number;
}

function ExpandableCard({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background)] transition-all duration-200 hover:border-[var(--color-border)] hover:shadow-[var(--shadow-sm)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{title}</span>
        <span className="text-[var(--color-text-muted)] transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          ▾
        </span>
      </button>
      {open && <div className="border-t border-[var(--color-border-subtle)] px-5 py-4">{children}</div>}
    </div>
  );
}

export function ScoutInsightCard({ report, delay = 80 }: ScoutInsightCardProps) {
  return (
    <Card className={cn("transition-shadow duration-300 hover:shadow-[var(--shadow-md)]")} delay={delay}>
      <DepartmentHeader
        department="Scout"
        title="Scout Report"
        description="Market intelligence behind this mission"
      />

      <p className="mt-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {report.marketOpportunity}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MetricBadge label="Monthly searches" value={report.monthlySearches} variant="accent" />
        <MetricBadge label="Competition" value={report.competitionLabel} />
        <MetricBadge label="Intent" value={report.intentLabel} variant="success" />
      </div>

      <div className="mt-4">
        <MetricBadge label="Suggested angle" value={report.suggestedAngle} variant="accent" className="w-full" />
      </div>

      <div className="mt-6 space-y-3">
        <ExpandableCard title="Customer intent" defaultOpen>
          <p className="text-sm text-[var(--color-text-secondary)]">{report.customerIntent}</p>
        </ExpandableCard>
        <ExpandableCard title="Competitor observations">
          <ul className="space-y-2">
            {report.competitorObservations.map((item) => (
              <li key={item} className="text-sm text-[var(--color-text-secondary)]">• {item}</li>
            ))}
          </ul>
        </ExpandableCard>
        <ExpandableCard title="Questions customers ask">
          <ul className="space-y-2">
            {report.customerQuestions.map((q) => (
              <li key={q} className="text-sm text-[var(--color-text-secondary)]">• {q}</li>
            ))}
          </ul>
        </ExpandableCard>
      </div>
    </Card>
  );
}
