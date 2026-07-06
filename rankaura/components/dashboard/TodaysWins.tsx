import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Win } from "@/types/dashboard";

interface TodaysWinsProps {
  wins: Win[];
}

/**
 * Today's Wins — recent positive changes.
 * Future: Optimiser + Analyst → AuraCore
 */
export function TodaysWins({ wins }: TodaysWinsProps) {
  return (
    <Card>
      <SectionHeader
        title="Today's wins"
        description="Improvements your AI team made for you"
      />
      <ul className="space-y-4">
        {wins.map((win) => (
          <li key={win.id} className="flex gap-3">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-emerald)]"
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {win.title}
              </p>
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                {win.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
