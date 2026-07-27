interface WhatHappensNextProps {
  items: string[];
}

export function WhatHappensNext({ items }: WhatHappensNextProps) {
  return (
    <section
      aria-labelledby="what-happens-next-heading"
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7"
    >
      <h2
        id="what-happens-next-heading"
        className="text-lg font-semibold text-[#080f1a]"
      >
        What happens next
      </h2>
      <p className="mt-2 text-sm text-[#8b95a5]">
        RankAura is already moving quietly on the work that matters most.
      </p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-[#080f1a] sm:text-base"
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
    </section>
  );
}
