export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-10"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse-soft rounded-full bg-[var(--color-aura)]" />
        <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
      </div>
    </div>
  );
}
