interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = "✨" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)] px-6 py-10 text-center">
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <p className="mt-3 text-sm font-semibold text-[var(--color-text-primary)]">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-[var(--color-text-secondary)]">{description}</p>
    </div>
  );
}
