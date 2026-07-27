import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface SurfaceCardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: "section" | "article" | "div";
  className?: string;
  padded?: boolean;
}

export function SurfaceCard({
  children,
  as: Component = "section",
  className,
  padded = true,
  ...props
}: SurfaceCardProps) {
  return (
    <Component
      className={cn(
        "ra-card bg-ra-surface",
        padded && "p-5 sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
