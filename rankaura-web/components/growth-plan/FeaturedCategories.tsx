"use client";

import { useState } from "react";
import type { GrowthCategory } from "@/types/growthPlan";
import { GrowthCategoryCard } from "@/components/growth-plan/GrowthCategoryCard";

interface FeaturedCategoriesProps {
  categories: GrowthCategory[];
  /** Optional: expand a category by id for review screenshots */
  initiallyExpandedId?: string;
}

export function FeaturedCategories({
  categories,
  initiallyExpandedId,
}: FeaturedCategoriesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    initiallyExpandedId ?? null,
  );

  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="featured-categories-heading" className="space-y-4">
      <div>
        <h2
          id="featured-categories-heading"
          className="text-lg font-semibold text-[#080f1a]"
        >
          Most relevant for you
        </h2>
        <p className="mt-1 text-sm text-[#8b95a5]">
          These areas matter most for your business right now.
        </p>
      </div>
      <div className="space-y-3">
        {categories.map((category) => (
          <GrowthCategoryCard
            key={category.id}
            category={category}
            featured
            expanded={expandedId === category.id}
            onToggle={() =>
              setExpandedId((current) =>
                current === category.id ? null : category.id,
              )
            }
          />
        ))}
      </div>
    </section>
  );
}
