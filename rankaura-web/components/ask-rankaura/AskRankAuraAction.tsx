import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import type { AskRankAuraAction } from "@/types/askRankAura";

interface AskRankAuraActionProps {
  action: AskRankAuraAction;
}

export function AskRankAuraActionButton({ action }: AskRankAuraActionProps) {
  return (
    <ButtonPrimary href={action.href}>{action.label}</ButtonPrimary>
  );
}
