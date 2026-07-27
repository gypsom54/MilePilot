import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

/** THE one Workspace card. No accent variants. Same border, radius, shadow, padding. */
export const SURFACE_CARD_CLASSNAME = "ra-card bg-ra-surface";
export const SURFACE_CARD_PADDED = "p-5 sm:p-6";

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
        SURFACE_CARD_CLASSNAME,
        padded && SURFACE_CARD_PADDED,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export const Card = SurfaceCard;
