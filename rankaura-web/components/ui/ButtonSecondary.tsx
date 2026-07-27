import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

const secondaryClassName =
  "inline-flex h-ra-control items-center justify-center rounded-ra-md border border-ra-border bg-ra-surface px-5 text-sm font-semibold text-ra-ink transition-colors duration-150 hover:border-ra-border-strong hover:bg-ra-surface-subtle active:bg-ra-neutral-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ra-focus disabled:pointer-events-none disabled:border-ra-border disabled:bg-ra-disabled-bg disabled:text-ra-disabled-fg";

interface ButtonSecondaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  className?: string;
}

export function ButtonSecondary({
  children,
  href,
  className,
  type = "button",
  ...props
}: ButtonSecondaryProps) {
  if (href) {
    return (
      <Link href={href} className={cn(secondaryClassName, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cn(secondaryClassName, className)}
      {...props}
    >
      {children}
    </button>
  );
}
