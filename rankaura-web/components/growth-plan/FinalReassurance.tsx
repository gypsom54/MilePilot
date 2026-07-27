import type { FinalReassuranceContent } from "@/types/growthPlan";

interface FinalReassuranceProps {
  content: FinalReassuranceContent;
}

/** Final confidence moment before Continue to Workspace. */
export function FinalReassurance({ content }: FinalReassuranceProps) {
  return (
    <section
      aria-labelledby="final-reassurance-heading"
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8"
    >
      <h2
        id="final-reassurance-heading"
        className="text-lg font-semibold text-[#080f1a] sm:text-xl"
      >
        {content.title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8b95a5] sm:text-base">
        {content.support}
      </p>
      <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-[#080f1a] sm:text-lg">
        {content.closing}
      </p>
    </section>
  );
}
