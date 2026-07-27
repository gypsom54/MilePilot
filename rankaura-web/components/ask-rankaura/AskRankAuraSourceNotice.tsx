import type { AskRankAuraSource } from "@/types/askRankAura";
import { DATA_AVAILABILITY_LABELS } from "@/types/askRankAura";

interface AskRankAuraSourceNoticeProps {
  sources: AskRankAuraSource[];
  availabilityNotice?: string;
}

/** Plain muted copy — same typography as Workspace support lines. No unique box. */
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
    <div role="status">
      {label ? (
        <p className="text-xs font-medium text-ra-muted">{label}</p>
      ) : null}
      {availabilityNotice ? (
        <p
          className={
            label
              ? "mt-1 text-sm font-normal text-ra-muted"
              : "text-sm font-normal text-ra-muted"
          }
        >
          {availabilityNotice}
        </p>
      ) : null}
    </div>
  );
}
