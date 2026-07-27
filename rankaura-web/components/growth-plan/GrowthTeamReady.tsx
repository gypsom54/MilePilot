import type { GrowthTeamReadyContent } from "@/types/growthPlan";

interface GrowthTeamReadyProps {
  content: GrowthTeamReadyContent;
}

/** Premium reassurance — your AI Growth Team is already working. */
export function GrowthTeamReady({ content }: GrowthTeamReadyProps) {
  return (
    <section
      aria-labelledby="growth-team-heading"
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8"
    >
      <h2
        id="growth-team-heading"
        className="text-lg font-semibold text-[#080f1a] sm:text-xl"
      >
        {content.title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8b95a5] sm:text-base">
        {content.support}
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#3d4654] sm:text-base">
        {content.quietWork}
      </p>
      <p className="mt-5 text-sm font-medium text-[#080f1a] sm:text-base">
        {content.strategyLine}
      </p>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {content.checklist.map((label) => (
          <li
            key={label}
            className="flex items-center gap-2.5 text-sm text-[#080f1a]"
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2eb88a] text-[11px] font-bold text-white"
              aria-hidden="true"
            >
              ✓
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-2xl rounded-xl bg-[#f8fafb] px-4 py-4 text-sm leading-relaxed text-[#3d4654] sm:text-base">
        {content.promise}
      </p>
    </section>
  );
}
