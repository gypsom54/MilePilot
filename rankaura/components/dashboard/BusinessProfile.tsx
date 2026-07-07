import { Avatar } from "@/components/ui/Avatar";
import type { DashboardBusinessProfile } from "@/types/dashboard";

interface BusinessProfileProps {
  business: DashboardBusinessProfile;
}

/**
 * Business profile in sidebar.
 * Future: AuraCore multi-business support
 */
export function BusinessProfile({ business }: BusinessProfileProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar label={business.logoInitial} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
          {business.name}
        </p>
        <p className="truncate text-xs text-[var(--color-text-muted)]">{business.industry}</p>
      </div>
    </div>
  );
}
