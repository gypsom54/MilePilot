import Link from "next/link";
import type { BiggestOpportunity } from "@/types/workspace";
import { FEATURED_VARIANT_LABELS } from "@/types/workspace";

interface BiggestOpportunityCardProps {
  opportunity: BiggestOpportunity;
}

export function BiggestOpportunityCard({
  opportunity,
}: BiggestOpportunityCardProps) {
  const actionClassName =
    "mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#080f1a] px-6 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]";

  return (
    <section
      aria-labelledby="biggest-opportunity-heading"
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8"
    >
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#5b8def]">
        {FEATURED_VARIANT_LABELS[opportunity.variant].toUpperCase()}
      </p>
      <h2
        id="biggest-opportunity-heading"
        className="mt-3 text-xl font-semibold tracking-tight text-[#080f1a] sm:text-2xl"
      >
        {opportunity.title}
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#8b95a5]">
        {opportunity.support}
      </p>
      {opportunity.href ? (
        <Link href={opportunity.href} className={actionClassName}>
          {opportunity.actionLabel}
        </Link>
      ) : (
        <button type="button" className={actionClassName}>
          {opportunity.actionLabel}
        </button>
      )}
    </section>
  );
}
