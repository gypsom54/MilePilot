"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApprovalConfirmation } from "@/components/dashboard/mission-review/ApprovalConfirmation";
import { MissionReview } from "@/components/dashboard/mission-review/MissionReview";
import type { DashboardMission } from "@/types/dashboard";

type ReviewStep = "review" | "confirmed";

interface MissionReviewModalProps {
  mission: DashboardMission;
  open: boolean;
  confirmationMessage: string;
  onClose: () => void;
  onApprove: () => void;
  onDefer: () => void;
}

/**
 * Mission Review modal — polished review and approval experience.
 */
export function MissionReviewModal({
  mission,
  open,
  confirmationMessage,
  onClose,
  onApprove,
  onDefer,
}: MissionReviewModalProps) {
  const [step, setStep] = useState<ReviewStep>("review");

  if (!open) return null;

  const handleApprove = () => {
    onApprove();
    setStep("confirmed");
  };

  const handleDone = () => {
    setStep("review");
    onClose();
  };

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
        onClick={step === "review" ? onClose : undefined}
        tabIndex={step === "confirmed" ? -1 : 0}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg animate-fade-in overflow-y-auto rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-lg)]">
        {step === "review" ? (
          <>
            <MissionReview mission={mission} />
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--color-border-subtle)] pt-6 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={onDefer}>
                Not Now
              </Button>
              <Button onClick={handleApprove}>Approve Mission</Button>
            </div>
          </>
        ) : (
          <ApprovalConfirmation message={confirmationMessage} onDone={handleDone} />
        )}
      </div>
    </div>
  );
}
