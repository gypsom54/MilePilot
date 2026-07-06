import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { GrowthMomentum as GrowthMomentumType } from "@/types/dashboard";

interface GrowthMomentumProps {
  momentum: GrowthMomentumType;
}

/**
 * Growth Momentum — plain-English business health signal.
 * Future: Architect + Analyst → AuraCore
 */
export function GrowthMomentum({ momentum }: GrowthMomentumProps) {
  return (
    <Card delay={160}>
      <SectionHeader
        title="Growth Momentum"
        description="Is your business growing?"
      />

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--color-emerald)] animate-pulse-soft" />
        <p className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          {momentum.label}
        </p>
      </div>

      <p className="mt-2 text-lg font-medium text-[var(--color-emerald)]">
        +{momentum.changePercent}%
      </p>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
        <div
          className="h-full rounded-full bg-[var(--color-aura)] animate-progress-fill"
          style={{ width: `${momentum.progress}%` }}
        />
      </div>

      <p className="mt-5 text-sm font-medium text-[var(--color-text-primary)]">
        {momentum.summary}
      </p>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{momentum.detail}</p>
    </Card>
  );
}
