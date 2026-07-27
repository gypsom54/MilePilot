import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import type { AskRankAuraAction } from "@/types/askRankAura";

interface AskRankAuraActionProps {
  action: AskRankAuraAction;
}

/** Same Continue button treatment as onboarding (label from action). */
export function AskRankAuraActionButton({ action }: AskRankAuraActionProps) {
  return (
    <ButtonPrimary
      href={action.href}
      className="mt-auto h-12 w-full rounded-full sm:mt-14 sm:w-auto"
    >
      {action.label}
    </ButtonPrimary>
  );
}
