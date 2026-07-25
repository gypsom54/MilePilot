import { cn } from "@/utils/cn";

interface FindingCardProps {
  label: string;
  value: string;
  detail?: string;
  className?: string;
}

export function FindingCard({ label, value, detail, className }: FindingCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[var(--color-background)] px-5 py-4 transition-colors duration-200 hover:bg-[var(--color-border-subtle)]/40",
        className,
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
        {value}
      </p>
      {detail && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{detail}</p>
      )}
    </div>
  );
}
