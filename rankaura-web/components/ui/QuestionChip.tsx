import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  ButtonSecondary,
  BUTTON_SECONDARY_CLASSNAME,
} from "@/components/ui/ButtonSecondary";
import { cn } from "@/utils/cn";

/**
 * Suggested-question control = THE outlined secondary button.
 * Layout-only helpers for full-width multi-line labels. No unique chrome.
 */
export const QUESTION_BUTTON_CLASSNAME = BUTTON_SECONDARY_CLASSNAME;

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
    <ButtonSecondary
      type={type}
      className={cn(
        "h-auto min-h-ra-control w-full justify-start text-left whitespace-normal",
        className,
      )}
      {...props}
    >
      {children}
    </ButtonSecondary>
  );
}

export const QuestionButton = QuestionChip;
