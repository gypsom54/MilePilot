import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
