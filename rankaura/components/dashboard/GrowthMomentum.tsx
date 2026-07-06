import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { GrowthMomentum as GrowthMomentumType } from "@/types/dashboard";

interface GrowthMomentumProps {
  momentum: GrowthMomentumType;
}

const trendLabels = {
  up: "Trending up",
  steady: "Holding steady",
  down: "Needs attention",
} as const;

/**
 * Growth Momentum overview.
 * Future: Architect + Analyst → AuraCore
 */
export function GrowthMomentum({ momentum }: GrowthMomentumProps) {
  return (
    <Card>
      <SectionHeader
        title="Growth momentum"
        description="How your business is doing online"
      />
      <div className="flex items-end gap-4">
        <p className="text-4xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          {momentum.score}
        </p>
        <p className="mb-1 text-sm font-medium text-[var(--color-emerald)]">
          {trendLabels[momentum.trend]}
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-aura)] to-[var(--color-emerald)]"
          style={{ width: `${momentum.score}%` }}
        />
      </div>
      <p className="mt-4 text-sm text-[var(--color-text-secondary)]">{momentum.summary}</p>
    </Card>
  );
}
