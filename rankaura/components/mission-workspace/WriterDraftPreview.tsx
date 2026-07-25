"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DepartmentHeader } from "@/components/mission-workspace/DepartmentHeader";
import { MissionStatusBadge } from "@/components/mission-workspace/MissionStatusBadge";
import type { WriterDraft } from "@/types/mission";

interface WriterDraftPreviewProps {
  draft: WriterDraft;
  onApproveDraft: () => void;
  onRequestRewrite: () => void;
  loading?: boolean;
  delay?: number;
}

export function WriterDraftPreview({
  draft,
  onApproveDraft,
  onRequestRewrite,
  loading = false,
  delay = 120,
}: WriterDraftPreviewProps) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-[var(--shadow-md)]" delay={delay}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <DepartmentHeader department="Writer" title="Writer Draft" description="Content prepared for your review" />
        <MissionStatusBadge
          label={draft.statusLabel}
          status={draft.status === "revision_requested" ? "revision_requested" : "ready_for_approval"}
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-white shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-background)] px-5 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
          </div>
        </div>
        <article className="px-8 py-10">
          <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            {draft.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {draft.introduction}
          </p>
          {draft.sections.map((section) => (
            <div key={section.heading} className="mt-8">
              <h4 className="text-lg font-semibold text-[var(--color-text-primary)]">{section.heading}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{section.body}</p>
            </div>
          ))}
          <div className="mt-10">
            <span className="inline-flex rounded-xl bg-[var(--color-midnight)] px-6 py-3 text-sm font-semibold text-white">
              {draft.callToAction}
            </span>
          </div>
        </article>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" disabled={loading}>Edit Draft</Button>
        <Button onClick={onApproveDraft} disabled={loading || draft.status === "approved"}>
          Approve Draft
        </Button>
        <Button variant="secondary" onClick={onRequestRewrite} disabled={loading}>
          Request Rewrite
        </Button>
      </div>
    </Card>
  );
}
