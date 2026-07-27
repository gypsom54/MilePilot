import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface SurfaceCardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: "section" | "article" | "div";
  className?: string;
  padded?: boolean;
  /** Subtle accent border for primary Workspace entry points (e.g. Ask RankAura). */
  accent?: boolean;
}

export function SurfaceCard({
  children,
  as: Component = "section",
  className,
  padded = true,
  accent = false,
  ...props
}: SurfaceCardProps) {
  return (
    <Component
      className={cn(
        "ra-card bg-ra-surface",
        accent && "ra-card-accent",
        padded && "p-5 sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/** Alias matching design-system naming. */
export const Card = SurfaceCard;
