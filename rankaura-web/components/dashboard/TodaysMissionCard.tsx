import type { TodaysMission } from "@/types/dashboard";

interface TodaysMissionCardProps {
  mission: TodaysMission;
}

/** Locked Today's Mission card — hierarchy matches approved dashboard screenshot. */
export function TodaysMissionCard({ mission }: TodaysMissionCardProps) {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="text-2xl font-semibold tracking-tight text-[#080f1a]">
        {mission.title}
      </h2>
      <p className="mt-2 text-base text-[#8b95a5]">{mission.support}</p>
      <p className="mt-5 text-base leading-relaxed text-[#080f1a]">
        {mission.description}
      </p>
    </section>
  );
}
