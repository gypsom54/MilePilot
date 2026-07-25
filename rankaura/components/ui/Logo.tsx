import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-midnight)] shadow-[var(--shadow-sm)]"
        aria-hidden
      >
        <span className="text-sm font-bold text-[var(--color-aura-soft)]">R</span>
      </div>
      {!compact && (
        <div>
          <p className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            {APP_NAME}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">{APP_TAGLINE}</p>
        </div>
      )}
    </div>
  );
}
