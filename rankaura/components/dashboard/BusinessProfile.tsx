import type { BusinessProfile as BusinessProfileType } from "@/types/dashboard";

interface BusinessProfileProps {
  business: BusinessProfileType;
}

/**
 * Business profile in sidebar.
 * Future: AuraCore multi-business support
 */
export function BusinessProfile({ business }: BusinessProfileProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-midnight)] text-sm font-semibold text-[var(--color-aura-soft)]"
        aria-hidden
      >
        {business.logoInitial}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
          {business.name}
        </p>
        <p className="truncate text-xs text-[var(--color-text-muted)]">{business.industry}</p>
      </div>
    </div>
  );
}
