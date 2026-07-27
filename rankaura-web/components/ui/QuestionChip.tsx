import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

/** THE one question button. Not a badge. Not a pill. */
export const QUESTION_BUTTON_CLASSNAME =
  "min-h-[44px] w-full rounded-ra-lg border border-ra-border bg-ra-surface px-3.5 py-2.5 text-left text-sm font-medium leading-snug text-ra-ink transition-colors duration-150 hover:border-ra-border-strong hover:bg-ra-surface-subtle active:border-ra-border-strong active:bg-ra-neutral-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ra-focus";

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
      className={cn(QUESTION_BUTTON_CLASSNAME, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export const QuestionButton = QuestionChip;
