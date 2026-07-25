import type { AuraBrief } from "@/types/mission";

interface AuraBriefProps {
  brief: AuraBrief;
  delay?: number;
}

export function AuraBrief({ brief, delay = 40 }: AuraBriefProps) {
  return (
    <section
      className="animate-fade-in rounded-2xl bg-[var(--color-surface)] px-10 py-12 shadow-[var(--shadow-sm)] sm:px-14 sm:py-14"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-aura)]">
        Aura Brief
      </p>
      <div className="mt-8 max-w-3xl space-y-5">
        {brief.paragraphs.map((paragraph, index) => (
          <p
            key={paragraph}
            className={
              index === 0
                ? "text-xl font-medium leading-relaxed text-[var(--color-text-primary)] sm:text-2xl"
                : "text-base leading-relaxed text-[var(--color-text-secondary)]"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
