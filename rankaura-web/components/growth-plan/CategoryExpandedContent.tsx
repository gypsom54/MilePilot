import type { GrowthCategory } from "@/types/growthPlan";

interface CategoryExpandedContentProps {
  category: GrowthCategory;
}

export function CategoryExpandedContent({
  category,
}: CategoryExpandedContentProps) {
  return (
    <div className="space-y-5 border-t border-[#eef1f4] px-5 pb-5 pt-4 sm:px-6">
      <div>
        <h4 className="text-[11px] font-semibold tracking-[0.12em] text-[#8b95a5]">
          DISCOVERED
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-[#080f1a]">
          {category.discovered}
        </p>
      </div>
      <div>
        <h4 className="text-[11px] font-semibold tracking-[0.12em] text-[#8b95a5]">
          COMPLETED
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-[#080f1a]">
          {category.completed}
        </p>
      </div>
      <div>
        <h4 className="text-[11px] font-semibold tracking-[0.12em] text-[#8b95a5]">
          NEXT
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-[#080f1a]">
          {category.next}
        </p>
      </div>
      {category.yourAction ? (
        <div className="rounded-xl bg-[#f8fafb] px-4 py-3">
          <h4 className="text-[11px] font-semibold tracking-[0.12em] text-[#8b95a5]">
            YOUR ACTION
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-[#080f1a]">
            {category.yourAction}
          </p>
          {category.primaryAction ? (
            <button
              type="button"
              className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-[#080f1a] px-5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
            >
              {category.primaryAction}
            </button>
          ) : null}
        </div>
      ) : category.primaryAction ? (
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#080f1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
        >
          {category.primaryAction}
        </button>
      ) : null}
    </div>
  );
}
