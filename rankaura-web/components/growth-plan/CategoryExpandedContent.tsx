import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import type { GrowthCategory } from "@/types/growthPlan";

interface CategoryExpandedContentProps {
  category: GrowthCategory;
}

function Paragraphs({ text }: { text: string }) {
  const parts = text.split("\n\n").filter(Boolean);
  return (
    <div className="mt-2 space-y-3">
      {parts.map((part) => (
        <p key={part.slice(0, 48)} className="text-sm leading-relaxed text-[#080f1a]">
          {part}
        </p>
      ))}
    </div>
  );
}

export function CategoryExpandedContent({
  category,
}: CategoryExpandedContentProps) {
  return (
    <div className="space-y-5 border-t border-[#eef1f4] px-5 pb-5 pt-4 sm:px-6">
      <div>
        <h4 className="text-[11px] font-semibold tracking-[0.12em] text-[#8b95a5]">
          WHY THIS MATTERS
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-[#080f1a]">
          {category.whyItMatters}
        </p>
      </div>
      <div>
        <h4 className="text-[11px] font-semibold tracking-[0.12em] text-[#8b95a5]">
          DISCOVERED
        </h4>
        <Paragraphs text={category.discovered} />
      </div>
      <div>
        <h4 className="text-[11px] font-semibold tracking-[0.12em] text-[#8b95a5]">
          COMPLETED
        </h4>
        <Paragraphs text={category.completed} />
      </div>
      <div>
        <h4 className="text-[11px] font-semibold tracking-[0.12em] text-[#8b95a5]">
          NEXT
        </h4>
        <Paragraphs text={category.next} />
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
            <div className="mt-3">
              <ButtonPrimary type="button">{category.primaryAction}</ButtonPrimary>
            </div>
          ) : null}
        </div>
      ) : category.primaryAction ? (
        <ButtonSecondary type="button">{category.primaryAction}</ButtonSecondary>
      ) : null}
    </div>
  );
}
