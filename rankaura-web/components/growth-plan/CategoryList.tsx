"use client";

import { useState } from "react";
import type { GrowthCategory } from "@/types/growthPlan";
import { GrowthCategoryCard } from "@/components/growth-plan/GrowthCategoryCard";

interface CategoryListProps {
  categories: GrowthCategory[];
  initiallyExpandedId?: string;
}

export function CategoryList({
  categories,
  initiallyExpandedId,
}: CategoryListProps) {
  const applicable = categories.filter((c) => c.applicable);
  const alsoAvailable = categories.filter((c) => !c.applicable);
  const [expandedId, setExpandedId] = useState<string | null>(
    initiallyExpandedId ?? null,
  );

  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="remaining-categories-heading" className="space-y-4">
      <div>
        <h2
          id="remaining-categories-heading"
          className="text-lg font-semibold text-[#080f1a]"
        >
          More ways we can help
        </h2>
        <p className="mt-1 text-sm text-[#8b95a5]">
          Everything RankAura can work on remains available — quietly, when it helps.
        </p>
      </div>
      <div className="space-y-3">
        {applicable.map((category) => (
          <GrowthCategoryCard
            key={category.id}
            category={category}
            expanded={expandedId === category.id}
            onToggle={() =>
              setExpandedId((current) =>
                current === category.id ? null : category.id,
              )
            }
          />
        ))}
      </div>
      {alsoAvailable.length > 0 ? (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-medium text-[#8b95a5]">Also available</h3>
          {alsoAvailable.map((category) => (
            <GrowthCategoryCard
              key={category.id}
              category={category}
              expanded={expandedId === category.id}
              onToggle={() =>
                setExpandedId((current) =>
                  current === category.id ? null : category.id,
                )
              }
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
