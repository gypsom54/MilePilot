import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { MissionPreview } from "@/types/mission";

interface MissionPreviewPanelProps {
  preview: MissionPreview;
}

export function MissionPreviewPanel({ preview }: MissionPreviewPanelProps) {
  return (
    <Card>
      <SectionHeader title="Mission Preview" description="How this will appear to your customers" />

      <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-white shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-background)] px-5 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
          </div>
        </div>

        <article className="px-8 py-10 sm:px-12">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            {preview.title}
          </p>

          {preview.blocks.map((block, index) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2
                    key={index}
                    className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  >
                    {block.content}
                  </h2>
                );
              case "subheading":
                return (
                  <h3
                    key={index}
                    className="mt-8 text-lg font-semibold text-[var(--color-text-primary)]"
                  >
                    {block.content}
                  </h3>
                );
              case "paragraph":
                return (
                  <p
                    key={index}
                    className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]"
                  >
                    {block.content}
                  </p>
                );
              case "cta":
                return (
                  <div key={index} className="mt-10">
                    <span className="inline-flex rounded-xl bg-[var(--color-midnight)] px-6 py-3 text-sm font-semibold text-white">
                      {block.content}
                    </span>
                  </div>
                );
              default:
                return null;
            }
          })}
        </article>
      </div>
    </Card>
  );
}
