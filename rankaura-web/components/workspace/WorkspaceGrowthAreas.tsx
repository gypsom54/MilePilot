import Link from "next/link";
import type { WorkspaceGrowthArea } from "@/types/workspace";

interface WorkspaceGrowthAreasProps {
  areas: WorkspaceGrowthArea[];
}

export function WorkspaceGrowthAreas({ areas }: WorkspaceGrowthAreasProps) {
  return (
    <section aria-labelledby="workspace-growth-areas-heading" className="space-y-4">
      <div>
        <h2
          id="workspace-growth-areas-heading"
          className="text-lg font-semibold text-[#080f1a]"
        >
          Growth areas
        </h2>
        <p className="mt-1 text-sm text-[#8b95a5]">
          The areas that matter most right now — from your Growth Plan.
        </p>
      </div>
      <div className="space-y-3">
        {areas.slice(0, 4).map((area) => (
          <article
            key={area.id}
            className="rounded-2xl border border-[#dce6fb] bg-white p-5 shadow-[0_2px_8px_rgba(91,141,239,0.08)] sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-[#080f1a] sm:text-lg">
                    {area.name}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-[#eef3ff] px-2.5 py-1 text-xs font-medium text-[#3b6fd4]">
                    {area.statusLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#8b95a5]">
                  {area.subtitle}
                </p>
                <p className="mt-2.5 text-sm font-medium text-[#3b6fd4]">
                  {area.impact}
                </p>
              </div>
              <Link
                href={area.href}
                className="inline-flex h-10 shrink-0 items-center justify-center self-start rounded-full border border-[#e5e7eb] bg-white px-4 text-sm font-semibold text-[#080f1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
              >
                {area.actionLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm text-[#8b95a5]">
        <Link
          href="/growth-plan?site=existing"
          className="font-medium text-[#3b6fd4] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
        >
          View full Growth Plan
        </Link>
      </p>
    </section>
  );
}
