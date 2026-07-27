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
      className="rounded-ra-md border border-ra-border bg-ra-neutral-soft px-3.5 py-3"
      role="status"
    >
      {label ? (
        <p className="text-xs font-medium text-ra-muted">{label}</p>
      ) : null}
      {availabilityNotice ? (
        <p className="mt-1 text-sm font-normal leading-relaxed text-ra-ink-soft">
          {availabilityNotice}
        </p>
      ) : null}
    </div>
  );
}
