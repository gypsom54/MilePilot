"use client";

import { useId } from "react";
import type { GrowthCategory } from "@/types/growthPlan";
import { CategoryExpandedContent } from "@/components/growth-plan/CategoryExpandedContent";
import { StatusBadge } from "@/components/growth-plan/StatusBadge";
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
        "overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[box-shadow] duration-200 motion-reduce:transition-none",
        featured
          ? "border-[#dce6fb] shadow-[0_2px_8px_rgba(91,141,239,0.08)]"
          : "border-transparent",
        !category.applicable && "opacity-70",
      )}
    >
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[#080f1a] sm:text-lg">
              {category.name}
            </h3>
            <StatusBadge status={category.status} />
            {typeof category.count === "number" ? (
              <span className="text-xs font-medium text-[#8b95a5]">
                {category.count}{" "}
                {category.count === 1 ? "insight" : "insights"}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#8b95a5]">
            {category.subtitle}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-[#3d4654]">
            {category.summary}
          </p>
          {featured && category.businessImpact ? (
            <p className="mt-2 text-sm font-medium text-[#3b6fd4]">
              {category.businessImpact}
            </p>
          ) : (
            <p className="mt-2 text-sm text-[#8b95a5]">{category.whyItMatters}</p>
          )}
        </div>
        <button
          id={buttonId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className="inline-flex h-10 shrink-0 items-center justify-center self-start rounded-full border border-[#e5e7eb] bg-white px-4 text-sm font-semibold text-[#080f1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
        >
          {expanded ? "Hide details" : "View details"}
        </button>
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
