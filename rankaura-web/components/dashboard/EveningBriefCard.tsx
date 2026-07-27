import type { EveningBrief } from "@/types/dashboard";

interface EveningBriefCardProps {
  brief: EveningBrief;
}

/** Locked Evening Brief card — structure matches approved dashboard screenshot. */
export function EveningBriefCard({ brief }: EveningBriefCardProps) {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h1 className="text-3xl font-semibold tracking-tight text-[#080f1a] sm:text-4xl">
        {brief.greeting} <span aria-hidden="true">👋</span>
      </h1>
      <p className="mt-3 text-base text-[#8b95a5]">{brief.statsLine}</p>

      <div className="mt-8 rounded-xl bg-[#f4f6f8] px-5 py-4">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#8b95a5]">
          {brief.priorityMission.label}
        </p>
        <p className="mt-2 text-lg font-semibold text-[#080f1a]">
          {brief.priorityMission.title}
        </p>
      </div>

      <button
        type="button"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#080f1a] px-6 text-sm font-semibold text-white"
      >
        {brief.priorityMission.ctaLabel}
      </button>
    </section>
  );
}
