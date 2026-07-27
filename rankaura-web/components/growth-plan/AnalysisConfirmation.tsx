import type { AnalysisConfirmationItem } from "@/types/growthPlan";

interface AnalysisConfirmationProps {
  items: AnalysisConfirmationItem[];
}

export function AnalysisConfirmation({ items }: AnalysisConfirmationProps) {
  return (
    <section
      aria-labelledby="analysis-confirmation-heading"
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7"
    >
      <h2
        id="analysis-confirmation-heading"
        className="text-sm font-semibold text-[#080f1a]"
      >
        Analysis confirmation
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {items.map((item) => (
          <li
            key={item.id}
            className="inline-flex items-center gap-2 rounded-full border border-[#e8ecf1] bg-[#f8fafb] px-3.5 py-2 text-sm text-[#080f1a]"
          >
            <span
              className={
                item.done
                  ? "flex h-5 w-5 items-center justify-center rounded-full bg-[#2eb88a] text-[11px] font-bold text-white"
                  : "flex h-5 w-5 items-center justify-center rounded-full border border-[#e5e7eb] text-[11px] text-[#8b95a5]"
              }
              aria-hidden="true"
            >
              {item.done ? "✓" : "·"}
            </span>
            <span>{item.label}</span>
            <span className="sr-only">
              {item.done ? "complete" : "pending"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
