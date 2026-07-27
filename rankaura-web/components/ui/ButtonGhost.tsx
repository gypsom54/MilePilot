import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

const ghostClassName =
  "inline-flex items-center text-sm font-semibold text-ra-accent underline-offset-2 transition-colors hover:text-[#2f5fbe] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ra-focus";

interface ButtonGhostProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  className?: string;
}

export function ButtonGhost({
  children,
  href,
  className,
  type = "button",
  ...props
}: ButtonGhostProps) {
  if (href) {
    return (
      <Link href={href} className={cn(ghostClassName, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cn(ghostClassName, className)} {...props}>
      {children}
    </button>
  );
}
