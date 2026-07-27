import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

/** THE one primary button. No screen-specific variations. */
export const BUTTON_PRIMARY_CLASSNAME =
  "inline-flex h-ra-control items-center justify-center rounded-ra-md bg-ra-primary px-5 text-sm font-semibold text-ra-primary-fg transition-[background-color,transform] duration-150 hover:bg-ra-primary-hover active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ra-focus disabled:pointer-events-none disabled:bg-ra-disabled-bg disabled:text-ra-disabled-fg motion-reduce:transition-none";

interface ButtonPrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  /** Layout-only helpers (e.g. shrink-0). Do not pass visual overrides. */
  className?: string;
}

export function ButtonPrimary({
  children,
  href,
  className,
  type = "button",
  ...props
}: ButtonPrimaryProps) {
  if (href) {
    return (
      <Link href={href} className={cn(BUTTON_PRIMARY_CLASSNAME, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cn(BUTTON_PRIMARY_CLASSNAME, className)}
      {...props}
    >
      {children}
    </button>
  );
}
