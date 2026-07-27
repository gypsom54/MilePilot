import type { PrimaryOpportunity } from "@/types/growthPlan";

interface PrimaryOpportunityCardProps {
  opportunity: PrimaryOpportunity;
}

export function PrimaryOpportunityCard({
  opportunity,
}: PrimaryOpportunityCardProps) {
  return (
    <section
      aria-labelledby="primary-opportunity-heading"
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8"
    >
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#5b8def]">
        PRIMARY OPPORTUNITY
      </p>
      <h2
        id="primary-opportunity-heading"
        className="mt-3 text-xl font-semibold tracking-tight text-[#080f1a] sm:text-2xl"
      >
        {opportunity.title}
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#8b95a5]">
        {opportunity.support}
      </p>
      <button
        type="button"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#080f1a] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
      >
        {opportunity.actionLabel}
      </button>
    </section>
  );
}
