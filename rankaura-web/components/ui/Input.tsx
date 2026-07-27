import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-ra-control w-full rounded-ra-md border border-ra-border bg-ra-surface px-4 text-sm font-normal text-ra-ink shadow-ra placeholder:text-ra-muted transition-[border-color,box-shadow] duration-150 focus-visible:border-ra-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ra-focus disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
