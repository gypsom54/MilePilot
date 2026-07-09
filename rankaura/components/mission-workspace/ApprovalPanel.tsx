"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Mission } from "@/types/mission";

interface ApprovalPanelProps {
  mission: Mission;
  onApprove: () => void;
  onRequestChanges: (comment: string) => void;
  onSaveForLater: () => void;
  loading?: boolean;
  delay?: number;
}

export function ApprovalPanel({
  mission,
  onApprove,
  onRequestChanges,
  onSaveForLater,
  loading = false,
  delay = 240,
}: ApprovalPanelProps) {
  const [showChangesForm, setShowChangesForm] = useState(false);
  const [comment, setComment] = useState("");

  const isActionable =
    mission.workspaceStatus === "ready_for_approval" ||
    mission.workspaceStatus === "in_review" ||
    mission.workspaceStatus === "pending";

  if (!isActionable) return null;

  const submitChanges = () => {
    if (!comment.trim()) return;
    onRequestChanges(comment.trim());
    setComment("");
    setShowChangesForm(false);
  };

  return (
    <section
      className="animate-fade-in rounded-2xl bg-[var(--color-surface)] px-10 py-12 shadow-[var(--shadow-md)] sm:px-14 sm:py-14"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
        Ready to approve?
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
        Your Growth Team has completed all checks. Approve to continue publishing, or send back for changes.
      </p>

      {showChangesForm ? (
        <div className="mt-8 space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What should the team change?"
            rows={4}
            className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm focus:border-[var(--color-aura)] focus:outline-none"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={submitChanges} disabled={loading || !comment.trim()}>
              Send to Writer
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowChangesForm(false);
                setComment("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Button className="px-10 py-4 text-base" onClick={onApprove} disabled={loading}>
            Approve Mission
          </Button>
          <Button
            variant="secondary"
            className="px-10 py-4 text-base"
            onClick={() => setShowChangesForm(true)}
            disabled={loading}
          >
            Request Changes
          </Button>
          <Button variant="secondary" className="px-10 py-4 text-base" onClick={onSaveForLater} disabled={loading}>
            Save For Later
          </Button>
        </div>
      )}
    </section>
  );
}
