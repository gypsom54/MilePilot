import { Button } from "@/components/ui/Button";
import { MISSION_APPROVAL_CONFIRMATION } from "@/lib/mission-review";

interface ApprovalConfirmationProps {
  message?: string;
  onDone: () => void;
}

/**
 * Calm post-approval confirmation — shown before returning to Mission Control.
 */
export function ApprovalConfirmation({
  message = MISSION_APPROVAL_CONFIRMATION,
  onDone,
}: ApprovalConfirmationProps) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-emerald-muted)] text-lg text-emerald-700"
      >
        ✓
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
        Mission approved
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {message}
      </p>
      <Button className="mt-8 min-w-[140px]" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}
