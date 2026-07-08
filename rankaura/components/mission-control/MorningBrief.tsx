import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { MorningBriefData } from "@/types/activity";

interface MorningBriefProps {
  brief: MorningBriefData;
}

export function MorningBrief({ brief }: MorningBriefProps) {
  return (
    <Card delay={0} className="border-[var(--color-border-subtle)] transition-shadow duration-300">
      <p className="text-sm font-medium text-[var(--color-text-muted)]">{brief.title}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
        {brief.greeting}
      </h1>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
        <span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {brief.improvementsCount}
          </span>{" "}
          improvements {brief.period === "morning" ? "overnight" : "today"}
        </span>
        <span aria-hidden>·</span>
        <span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {brief.hoursSaved} hrs
          </span>{" "}
          saved
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background)] px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          Priority mission
        </p>
        <p className="mt-1 text-base font-semibold text-[var(--color-text-primary)]">
          {brief.priorityMissionTitle}
        </p>
      </div>

      <div className="mt-8">
        <Link href={brief.ctaHref}>
          <Button className="min-w-[200px] px-8 py-4 text-base">{brief.ctaLabel}</Button>
        </Link>
      </div>
    </Card>
  );
}
