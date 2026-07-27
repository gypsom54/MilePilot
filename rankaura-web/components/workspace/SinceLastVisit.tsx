import type { CompletedActivity } from "@/types/workspace";

interface SinceLastVisitProps {
  items: CompletedActivity[];
}

export function SinceLastVisit({ items }: SinceLastVisitProps) {
  return (
    <section
      aria-labelledby="since-last-visit-heading"
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7"
    >
      <h2
        id="since-last-visit-heading"
        className="text-lg font-semibold text-[#080f1a]"
      >
        Since your last visit
      </h2>
      <p className="mt-2 text-sm text-[#8b95a5]">
        Work RankAura has already completed for your business.
      </p>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f8f1] text-[11px] font-bold text-[#1f8a62]"
              aria-hidden="true"
            >
              ✓
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-[#080f1a] sm:text-base">
                {item.text}
              </p>
              <p className="mt-1 text-xs text-[#8b95a5]">{item.completedAtLabel}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
