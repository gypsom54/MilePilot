"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ApprovalFooterProps {
  onApprove: () => void;
  onRequestChanges: (comment: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function ApprovalFooter({
  onApprove,
  onRequestChanges,
  loading = false,
  disabled = false,
}: ApprovalFooterProps) {
  const [showChanges, setShowChanges] = useState(false);
  const [comment, setComment] = useState("");

  const submitChanges = () => {
    if (!comment.trim()) return;
    onRequestChanges(comment.trim());
    setComment("");
    setShowChanges(false);
  };

  return (
    <footer className="animate-fade-in mt-20 rounded-2xl bg-[var(--color-surface)] p-10 shadow-[var(--shadow-sm)] sm:p-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        Your decision
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        Ready to approve this mission?
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
        Approving will deploy the work your AI departments prepared. You can request changes if
        anything needs adjustment.
      </p>

      {showChanges ? (
        <div className="mt-10 space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe what you'd like changed..."
            rows={4}
            className="w-full resize-none rounded-xl bg-[var(--color-background)] px-5 py-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-aura)]/30"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={submitChanges} disabled={loading || !comment.trim()}>
              Send to Writer
            </Button>
            <Button variant="secondary" onClick={() => setShowChanges(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            className="min-w-[220px] px-10 py-4 text-base"
            onClick={onApprove}
            disabled={loading || disabled}
          >
            Approve Mission
          </Button>
          <Button
            variant="secondary"
            className="px-10 py-4 text-base"
            onClick={() => setShowChanges(true)}
            disabled={loading || disabled}
          >
            Request Changes
          </Button>
        </div>
      )}
    </footer>
  );
}
