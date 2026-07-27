import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { CompletedActivity } from "@/types/workspace";

interface SinceLastVisitProps {
  items: CompletedActivity[];
}

export function SinceLastVisit({ items }: SinceLastVisitProps) {
  return (
    <SurfaceCard aria-labelledby="since-last-visit-heading" className="sm:p-7">
      <h2
        id="since-last-visit-heading"
        className="text-lg font-semibold text-ra-ink"
      >
        Since your last visit
      </h2>
      <p className="mt-2 text-sm font-normal text-ra-muted">
        Meaningful work RankAura has already completed for your business.
      </p>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#b7e6d2] bg-ra-success-soft text-[11px] font-bold text-ra-success"
              aria-hidden="true"
            >
              ✓
            </span>
            <div className="min-w-0">
              <p className="text-sm font-normal leading-relaxed text-ra-ink sm:text-base">
                {item.text}
              </p>
              <p className="mt-1 text-xs font-normal text-ra-muted">
                {item.completedAtLabel}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
