import type { RecentWin } from "@/types/workspace";

interface RecentWinsProps {
  wins: RecentWin[];
}

/** Calm celebratory progress — max three wins, no gamification. */
export function RecentWins({ wins }: RecentWinsProps) {
  if (wins.length === 0) return null;

  return (
    <section
      aria-labelledby="recent-wins-heading"
      className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6"
    >
      <h2
        id="recent-wins-heading"
        className="text-base font-semibold text-[#080f1a]"
      >
        Recent wins
      </h2>
      <ul className="mt-4 space-y-2.5">
        {wins.slice(0, 3).map((win) => (
          <li
            key={win.id}
            className="flex gap-2.5 text-sm leading-relaxed text-[#3d4654]"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f8f1] text-[11px] font-bold text-[#1f8a62]"
              aria-hidden="true"
            >
              ✓
            </span>
            <span>{win.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
