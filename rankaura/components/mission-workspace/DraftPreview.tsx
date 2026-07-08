import type { MissionDraft } from "@/types/mission";

interface DraftPreviewProps {
  draft: MissionDraft;
  delay?: number;
}

export function DraftPreview({ draft, delay = 120 }: DraftPreviewProps) {
  return (
    <section
      className="animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
        Draft Preview
      </h2>
      <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
        Review the guide as your customers will see it.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
        <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-background)] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[var(--color-border)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--color-border)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--color-border)]" />
            <span className="ml-4 text-xs text-[var(--color-text-muted)]">
              Preview — not yet published
            </span>
          </div>
        </div>

        <article className="px-8 py-12 sm:px-14 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
            Research Library
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            {draft.title}
          </h3>

          <div className="mt-12 space-y-10">
            {draft.sections.map((section) => (
              <div key={section.heading}>
                <h4 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                  {section.heading}
                </h4>
                <p className="mt-4 max-w-3xl text-base leading-[1.75] text-[var(--color-text-secondary)]">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-[var(--color-border-subtle)] pt-10">
            <span className="inline-flex rounded-xl bg-[var(--color-midnight)] px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-sm)]">
              {draft.callToAction}
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}
