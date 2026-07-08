"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DepartmentHeader } from "@/components/mission-workspace/DepartmentHeader";
import type { Mission } from "@/types/mission";

interface ApprovalPanelProps {
  mission: Mission;
  onApprove: () => void;
  onRequestChanges: (comment: string) => void;
  onArchive: () => void;
  onLeaveFeedback: (comment: string) => void;
  loading?: boolean;
  delay?: number;
}

export function ApprovalPanel({
  mission,
  onApprove,
  onRequestChanges,
  onArchive,
  onLeaveFeedback,
  loading = false,
  delay = 280,
}: ApprovalPanelProps) {
  const [mode, setMode] = useState<"default" | "changes" | "feedback">("default");
  const [comment, setComment] = useState("");

  const isActionable =
    mission.workspaceStatus === "ready_for_approval" ||
    mission.workspaceStatus === "in_review" ||
    mission.workspaceStatus === "pending";

  if (!isActionable && mission.workspaceStatus === "approved") {
    return (
      <Card delay={delay} className="border-[var(--color-emerald-muted)] bg-[var(--color-emerald-muted)]/10">
        <DepartmentHeader department="Approval" title="Mission Approved" />
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          {mission.approvalMessage ?? "Your Growth Team is continuing execution."}
        </p>
      </Card>
    );
  }

  if (!isActionable) return null;

  const submitComment = () => {
    if (!comment.trim()) return;
    if (mode === "changes") onRequestChanges(comment.trim());
    if (mode === "feedback") onLeaveFeedback(comment.trim());
    setComment("");
    setMode("default");
  };

  return (
    <Card delay={delay} className="border-[var(--color-aura)]/20 bg-[var(--color-surface)]">
      <DepartmentHeader
        department="Approval"
        title="Your Decision"
        description="Approve to publish, or send back for changes"
      />

      {mode === "default" ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Button className="py-4 text-base" onClick={onApprove} disabled={loading}>
            Approve Mission
          </Button>
          <Button variant="secondary" className="py-4 text-base" onClick={() => setMode("changes")} disabled={loading}>
            Request Changes
          </Button>
          <Button variant="secondary" onClick={onArchive} disabled={loading}>
            Archive
          </Button>
          <Button variant="secondary" onClick={() => setMode("feedback")} disabled={loading}>
            Leave Feedback
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={mode === "changes" ? "What should the team change?" : "Share your feedback..."}
            rows={4}
            className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm focus:border-[var(--color-aura)] focus:outline-none"
          />
          <div className="flex gap-3">
            <Button onClick={submitComment} disabled={loading || !comment.trim()}>
              {mode === "changes" ? "Send to Writer" : "Submit Feedback"}
            </Button>
            <Button variant="secondary" onClick={() => { setMode("default"); setComment(""); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {mission.comments.length > 0 && (
        <div className="mt-8 border-t border-[var(--color-border-subtle)] pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Feedback history</p>
          <ul className="mt-3 space-y-2">
            {mission.comments.map((c) => (
              <li key={c.id} className="text-sm text-[var(--color-text-secondary)]">{c.text}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
