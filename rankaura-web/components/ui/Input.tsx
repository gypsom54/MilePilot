import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * THE one text input — styles live in `.ra-input` (globals.css).
 * Focus: ONE treatment only — a single blue border.
 * Never blue border + glow/outline together.
 */
export const INPUT_CLASSNAME = "ra-input";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(INPUT_CLASSNAME, className)} {...props} />;
}
