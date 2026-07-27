import type { GrowthPlanHeaderContent } from "@/types/growthPlan";

interface GrowthPlanHeaderProps {
  header: GrowthPlanHeaderContent;
}

export function GrowthPlanHeader({ header }: GrowthPlanHeaderProps) {
  return (
    <header className="space-y-3">
      <p className="text-sm font-medium text-[#8b95a5]">{header.businessName}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-[#080f1a] sm:text-4xl">
        {header.title}
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-[#8b95a5] sm:text-lg">
        {header.support}
      </p>
    </header>
  );
}
