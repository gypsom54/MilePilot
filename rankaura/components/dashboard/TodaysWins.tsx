import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Win } from "@/types/dashboard";

interface TodaysWinsProps {
  wins: Win[];
}

/**
 * Today's Wins — rewarding achievement cards.
 * Future: Optimiser + Analyst → AuraCore
 */
export function TodaysWins({ wins }: TodaysWinsProps) {
  return (
    <Card delay={120}>
      <SectionHeader
        title="Today's Wins"
        description="What your AI team achieved for you"
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {wins.map((win) => (
          <li
            key={win.id}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background)] p-5 transition-colors duration-200 hover:border-[var(--color-border)]"
          >
            <span className="text-xl" aria-hidden>
              {win.icon}
            </span>
            <p className="mt-3 text-sm font-semibold text-[var(--color-text-primary)]">
              {win.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {win.description}
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Estimated impact
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--color-emerald)]">
              {win.impact}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
