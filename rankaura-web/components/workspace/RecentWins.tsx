import { SuccessMark } from "@/components/ui/SuccessMark";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { RecentWin } from "@/types/workspace";

interface RecentWinsProps {
  wins: RecentWin[];
}

export function RecentWins({ wins }: RecentWinsProps) {
  if (wins.length === 0) return null;

  return (
    <SurfaceCard aria-labelledby="recent-wins-heading">
      <h2
        id="recent-wins-heading"
        className="text-base font-semibold text-ra-ink"
      >
        Recent wins
      </h2>
      <ul className="mt-4 space-y-2.5">
        {wins.slice(0, 3).map((win) => (
          <li
            key={win.id}
            className="flex gap-2.5 text-sm font-normal leading-relaxed text-ra-ink-soft"
          >
            <SuccessMark />
            <span>{win.text}</span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
