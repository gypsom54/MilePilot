import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/** THE one text input. */
export const INPUT_CLASSNAME =
  "h-ra-control w-full rounded-ra-md border border-ra-border bg-ra-surface px-4 text-sm font-normal text-ra-ink placeholder:text-ra-placeholder transition-[border-color,box-shadow,background-color] duration-150 hover:border-ra-border-strong focus-visible:border-ra-focus focus-visible:shadow-ra-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ra-focus disabled:cursor-not-allowed disabled:border-ra-border disabled:bg-ra-disabled-bg disabled:text-ra-disabled-fg disabled:placeholder:text-ra-disabled-fg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(INPUT_CLASSNAME, className)} {...props} />;
}
