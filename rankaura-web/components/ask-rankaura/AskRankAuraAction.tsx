import Link from "next/link";
import type { AskRankAuraAction } from "@/types/askRankAura";

interface AskRankAuraActionProps {
  action: AskRankAuraAction;
}

export function AskRankAuraActionButton({ action }: AskRankAuraActionProps) {
  const className =
    "inline-flex h-11 items-center justify-center rounded-full bg-[#080f1a] px-6 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]";

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {action.label}
    </button>
  );
}
