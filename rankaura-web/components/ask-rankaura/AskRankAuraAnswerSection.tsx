import type { AskRankAuraAnswerSection } from "@/types/askRankAura";

interface AskRankAuraAnswerSectionProps {
  section: AskRankAuraAnswerSection;
}

export function AskRankAuraAnswerSectionView({
  section,
}: AskRankAuraAnswerSectionProps) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold tracking-[0.1em] text-[#8b95a5]">
        {section.title.toUpperCase()}
      </h4>
      <p className="mt-1.5 text-sm leading-relaxed text-[#3d4654]">
        {section.body}
      </p>
      {section.items && section.items.length > 0 ? (
        <ul className="mt-2.5 space-y-1.5">
          {section.items.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-relaxed text-[#3d4654]"
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f8f1] text-[11px] font-bold text-[#1f8a62]"
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
