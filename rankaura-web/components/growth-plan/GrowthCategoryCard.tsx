"use client";

import { useId } from "react";
import type { GrowthCategory } from "@/types/growthPlan";
import { CategoryExpandedContent } from "@/components/growth-plan/CategoryExpandedContent";
import { StatusBadge } from "@/components/growth-plan/StatusBadge";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { cn } from "@/utils/cn";

interface GrowthCategoryCardProps {
  category: GrowthCategory;
  featured?: boolean;
  expanded: boolean;
  onToggle: () => void;
}

export function GrowthCategoryCard({
  category,
  featured = false,
  expanded,
  onToggle,
}: GrowthCategoryCardProps) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <article
      className={cn(
        "overflow-hidden rounded-ra-xl border border-ra-border bg-ra-surface shadow-ra transition-[box-shadow] duration-200 motion-reduce:transition-none",
        featured && "border-ra-border-accent",
        !category.applicable && "opacity-70",
      )}
    >
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-ra-ink sm:text-lg">
              {category.name}
            </h3>
            <StatusBadge status={category.status} />
            {typeof category.count === "number" ? (
              <span className="text-xs font-medium text-ra-muted">
                {category.count}{" "}
                {category.count === 1 ? "insight" : "insights"}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-normal leading-relaxed text-ra-muted">
            {category.subtitle}
          </p>
          <p className="mt-2.5 text-sm font-normal leading-relaxed text-ra-ink-soft">
            {category.summary}
          </p>
          {featured && category.businessImpact ? (
            <p className="mt-2 text-sm font-medium text-ra-accent">
              {category.businessImpact}
            </p>
          ) : (
            <p className="mt-2 text-sm font-normal text-ra-muted">
              {category.whyItMatters}
            </p>
          )}
        </div>
        <ButtonSecondary
          id={buttonId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className="shrink-0 self-start"
        >
          {expanded ? "Hide details" : "View details"}
        </ButtonSecondary>
      </div>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!expanded}
        className={cn(
          "motion-safe:transition-[opacity] motion-safe:duration-200",
          expanded ? "opacity-100" : "opacity-0",
        )}
      >
        {expanded ? <CategoryExpandedContent category={category} /> : null}
      </div>
    </article>
  );
}
