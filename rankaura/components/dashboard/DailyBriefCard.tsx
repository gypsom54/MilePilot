import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { DashboardDailyBrief } from "@/types/dashboard";

interface DailyBriefCardProps {
  greeting: string;
  dailyBrief: DashboardDailyBrief;
  showContinueGrowing?: boolean;
  onContinueGrowing?: () => void;
}

export function DailyBriefCard({
  greeting,
  dailyBrief,
  showContinueGrowing = false,
  onContinueGrowing,
}: DailyBriefCardProps) {
  return (
    <Card delay={0} className="border-[var(--color-border-subtle)]">
      <p className="text-sm font-medium text-[var(--color-text-muted)]">Daily Brief</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
        {greeting}
      </h1>
      <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-[var(--color-text-primary)]">
        {dailyBrief.headline}
      </p>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {dailyBrief.summary}
      </p>
      <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
        <span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {dailyBrief.improvementsCount}
          </span>{" "}
          improvements overnight
        </span>
        <span aria-hidden>·</span>
        <span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {dailyBrief.managementTimeMinutes} min
          </span>{" "}
          management time today
        </span>
        <span aria-hidden>·</span>
        <span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {dailyBrief.hoursSaved} hrs
          </span>{" "}
          saved this week
        </span>
      </div>
      {showContinueGrowing && onContinueGrowing && (
        <div className="mt-6">
          <Button variant="secondary" onClick={onContinueGrowing}>
            Continue Growing
          </Button>
        </div>
      )}
    </Card>
  );
}
