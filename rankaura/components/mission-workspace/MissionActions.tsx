"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Mission } from "@/types/mission";

interface MissionActionsProps {
  mission: Mission;
  onApprove: () => void;
  onRequestChanges: (comment: string) => void;
  onSaveForLater: () => void;
  loading?: boolean;
}

export function MissionActions({
  mission,
  onApprove,
  onRequestChanges,
  onSaveForLater,
  loading = false,
}: MissionActionsProps) {
  const [showChangesForm, setShowChangesForm] = useState(false);
  const [comment, setComment] = useState("");

  const isActionable =
    mission.workspaceStatus === "in_review" ||
    mission.workspaceStatus === "pending" ||
    mission.workspaceStatus === "saved_for_later";

  const handleRequestChanges = () => {
    if (!comment.trim()) return;
    onRequestChanges(comment.trim());
    setComment("");
    setShowChangesForm(false);
  };

  if (!isActionable && mission.workspaceStatus === "approved") {
    return (
      <Card>
        <SectionHeader title="Actions" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          This mission has been approved. Your Growth Team is continuing the work.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Actions" description="Your decision moves the team forward" />

      {showChangesForm ? (
        <div className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe what you'd like changed..."
            rows={4}
            className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-aura)] focus:outline-none"
          />
          <div className="flex flex-col gap-2">
            <Button onClick={handleRequestChanges} disabled={loading || !comment.trim()}>
              Send to Writer
            </Button>
            <Button variant="secondary" onClick={() => setShowChangesForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Button onClick={onApprove} disabled={loading}>
            Approve Mission
          </Button>
          <Button variant="secondary" onClick={() => setShowChangesForm(true)} disabled={loading}>
            Request Changes
          </Button>
          <Button variant="secondary" onClick={onSaveForLater} disabled={loading}>
            Save For Later
          </Button>
        </div>
      )}

      {mission.comments.length > 0 && (
        <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Your feedback
          </p>
          <ul className="mt-2 space-y-2">
            {mission.comments.map((c) => (
              <li key={c.id} className="text-sm text-[var(--color-text-secondary)]">
                {c.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
