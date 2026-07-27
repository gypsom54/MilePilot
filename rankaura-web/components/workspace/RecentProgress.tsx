import Link from "next/link";
import type { RecentProgressItem } from "@/types/workspace";
import { PROGRESS_TYPE_LABELS } from "@/types/workspace";

interface RecentProgressProps {
  items: RecentProgressItem[];
}

/** Calm timeline of meaningful updates — not a social feed. */
export function RecentProgress({ items }: RecentProgressProps) {
  return (
    <section
      aria-labelledby="recent-progress-heading"
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7"
    >
      <h2
        id="recent-progress-heading"
        className="text-lg font-semibold text-[#080f1a]"
      >
        Recent progress
      </h2>
      <p className="mt-2 text-sm text-[#8b95a5]">
        A calm timeline of the work RankAura has completed and the opportunities
        it has identified.
      </p>
      <ol className="mt-6 space-y-0">
        {items.map((item, index) => (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {index < items.length - 1 ? (
              <span
                className="absolute left-[7px] top-4 bottom-0 w-px bg-[#e8ecf1]"
                aria-hidden="true"
              />
            ) : null}
            <span
              className="relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[#5b8def] bg-white"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-[0.08em] text-[#8b95a5]">
                {PROGRESS_TYPE_LABELS[item.type].toUpperCase()} ·{" "}
                {item.timestampLabel}
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-[#080f1a]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#8b95a5]">
                {item.body}
              </p>
              {item.actionLabel && item.href ? (
                <Link
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-semibold text-[#3b6fd4] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
                >
                  {item.actionLabel}
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
