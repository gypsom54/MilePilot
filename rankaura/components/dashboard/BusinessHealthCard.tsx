import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { DashboardBusinessHealth } from "@/types/dashboard";

interface BusinessHealthCardProps {
  health: DashboardBusinessHealth;
}

export function BusinessHealthCard({ health }: BusinessHealthCardProps) {
  return (
    <Card delay={140}>
      <SectionHeader
        title="Business Health"
        description="Is your business growing?"
      />

      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-[var(--color-emerald)] animate-pulse-soft" />
        <p className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          {health.label}
        </p>
        <StatusBadge status={health.status} />
      </div>

      <p className="mt-3 text-lg font-medium text-[var(--color-emerald)]">
        +{health.changePercent}% this month
      </p>

      <p className="mt-4 text-sm font-medium text-[var(--color-text-primary)]">
        {health.summary}
      </p>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{health.detail}</p>
    </Card>
  );
}
