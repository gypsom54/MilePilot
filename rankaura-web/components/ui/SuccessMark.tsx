/** Shared success check mark — used in lists, not a badge. */
export function SuccessMark() {
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ra-success-border bg-ra-success-soft text-[11px] font-bold text-ra-success"
      aria-hidden="true"
    >
      ✓
    </span>
  );
}
