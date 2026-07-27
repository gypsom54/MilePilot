import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface QuestionChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function QuestionChip({
  children,
  className,
  type = "button",
  ...props
}: QuestionChipProps) {
  return (
    <button
      type={type}
      className={cn(
        "w-full rounded-ra-md border border-ra-border bg-ra-surface px-3.5 py-2.5 text-left text-sm font-normal leading-snug text-ra-ink shadow-ra transition-colors duration-150 hover:border-ra-border-strong hover:bg-ra-neutral-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ra-focus",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
