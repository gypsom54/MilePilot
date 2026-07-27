import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

const primaryClassName =
  "inline-flex h-ra-control items-center justify-center rounded-ra-md bg-ra-ink px-5 text-sm font-semibold text-white transition-[background-color,transform,opacity] duration-150 hover:bg-[#161c28] hover:scale-[1.01] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ra-focus disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:hover:scale-100";

interface ButtonPrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
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
      <Link href={href} className={cn(primaryClassName, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cn(primaryClassName, className)} {...props}>
      {children}
    </button>
  );
}
