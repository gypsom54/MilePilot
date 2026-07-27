import type { AskRankAuraSource } from "@/types/askRankAura";
import { DATA_AVAILABILITY_LABELS } from "@/types/askRankAura";

interface AskRankAuraSourceNoticeProps {
  sources: AskRankAuraSource[];
  availabilityNotice?: string;
}

export function AskRankAuraSourceNotice({
  sources,
  availabilityNotice,
}: AskRankAuraSourceNoticeProps) {
  const primary =
    sources.find((source) => source.availability === "unavailable") ??
    sources.find((source) => source.availability === "incomplete") ??
    sources[0];

  if (!primary && !availabilityNotice) return null;

  const label = primary
    ? `${DATA_AVAILABILITY_LABELS[primary.availability]} · ${primary.label}`
    : null;

  return (
    <div
      className="rounded-xl border border-[#e8ecf1] bg-[#f8fafc] px-3.5 py-3"
      role="status"
    >
      {label ? (
        <p className="text-xs font-medium text-[#8b95a5]">{label}</p>
      ) : null}
      {availabilityNotice ? (
        <p className="mt-1 text-sm leading-relaxed text-[#3d4654]">
          {availabilityNotice}
        </p>
      ) : null}
    </div>
  );
}
