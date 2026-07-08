"use client";

import { Button } from "@/components/ui/Button";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { Badge } from "@/components/ui/Badge";
import type { DashboardMission } from "@/types/dashboard";

interface MissionReviewPanelProps {
  mission: DashboardMission;
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onDefer: () => void;
}

const impactLabels = {
  high: "High impact",
  medium: "Medium impact",
  low: "Low impact",
} as const;

export function MissionReviewPanel({
  mission,
  open,
  onClose,
  onApprove,
  onDefer,
}: MissionReviewPanelProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mission-review-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close mission review"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg animate-fade-in rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-lg)]">
        <p className="text-sm font-medium text-[var(--color-text-muted)]">Mission Review</p>
        <h2
          id="mission-review-title"
          className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-text-primary)]"
        >
          {mission.title}
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="aura">{impactLabels[mission.impact]}</Badge>
          <ConfidenceBadge confidence={mission.confidence} />
          <span className="text-sm text-[var(--color-text-muted)] self-center">
            {mission.timeRequiredMinutes} min to review
          </span>
        </div>

        <div className="mt-6 space-y-5">
          <section>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              What this mission is
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {mission.reason}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Why it matters
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {mission.expectedOutcome}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Growth Team contributions
            </h3>
            <ul className="mt-2 space-y-2">
              {mission.departments.map((dept) => (
                <li key={dept.id} className="text-sm text-[var(--color-text-secondary)]">
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {dept.name}
                  </span>
                  {" — "}
                  {dept.contribution}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              If you approve
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {mission.onApproveSummary}
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onDefer}>
            Not Now
          </Button>
          <Button onClick={onApprove}>Approve Mission</Button>
        </div>
      </div>
    </div>
  );
}
