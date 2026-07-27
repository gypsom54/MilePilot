import type { KeyDiscovery } from "@/types/growthPlan";

interface KeyDiscoveriesProps {
  discoveries: KeyDiscovery[];
}

/** Emotional highlight — calm discoveries after analysis confirmation. */
export function KeyDiscoveries({ discoveries }: KeyDiscoveriesProps) {
  if (discoveries.length === 0) return null;

  return (
    <section
      aria-labelledby="key-discoveries-heading"
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8"
    >
      <h2
        id="key-discoveries-heading"
        className="text-lg font-semibold text-[#080f1a] sm:text-xl"
      >
        We discovered…
      </h2>
      <p className="mt-2 text-sm text-[#8b95a5]">
        A few highlights from the work already completed for your business.
      </p>
      <ul className="mt-5 space-y-3.5">
        {discoveries.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 text-sm leading-relaxed text-[#080f1a] sm:text-base"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2eb88a] text-[11px] font-bold text-white"
              aria-hidden="true"
            >
              ✓
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
