import type { AskRankAuraAnswerSection } from "@/types/askRankAura";

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
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#b7e6d2] bg-ra-success-soft text-[11px] font-bold text-ra-success"
                aria-hidden="true"
              >
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
