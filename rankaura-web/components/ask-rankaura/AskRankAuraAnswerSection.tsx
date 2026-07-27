import type { AskRankAuraAnswerSection } from "@/types/askRankAura";
import { SuccessMark } from "@/components/ui/SuccessMark";

interface AskRankAuraAnswerSectionProps {
  section: AskRankAuraAnswerSection;
}

export function AskRankAuraAnswerSectionView({
  section,
}: AskRankAuraAnswerSectionProps) {
  return (
    <div>
      <h4 className="text-[11px] font-medium tracking-[0.1em] text-ra-muted">
        {section.title.toUpperCase()}
      </h4>
      <p className="mt-1.5 text-sm font-normal leading-relaxed text-ra-ink-soft">
        {section.body}
      </p>
      {section.items && section.items.length > 0 ? (
        <ul className="mt-2.5 space-y-1.5">
          {section.items.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm font-normal leading-relaxed text-ra-ink-soft"
            >
              <SuccessMark />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
