"use client";

import { useRouter } from "next/navigation";
import { useCallback, type MouseEvent } from "react";

interface MissionModeTransitionProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps Review Mission — sets session flag for immersive entrance, no dashboard layout changes.
 */
export function MissionModeTransition({ href, children, className }: MissionModeTransitionProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      sessionStorage.setItem("rankaura-mission-mode-enter", "1");
      document.documentElement.classList.add("mission-mode-transitioning");
      window.setTimeout(() => {
        router.push(href);
      }, 280);
    },
    [href, router],
  );

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
