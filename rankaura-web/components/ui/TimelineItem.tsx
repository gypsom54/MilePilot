import type { ReactNode } from "react";
import { ButtonGhost } from "@/components/ui/ButtonGhost";
import { cn } from "@/utils/cn";

interface TimelineItemProps {
  typeLabel: string;
  timestampLabel: string;
  title: string;
  body: string;
  actionLabel?: string;
  href?: string;
  showConnector?: boolean;
  className?: string;
  children?: ReactNode;
}

export function TimelineItem({
  typeLabel,
  timestampLabel,
  title,
  body,
  actionLabel,
  href,
  showConnector = true,
  className,
}: TimelineItemProps) {
  return (
    <li className={cn("relative flex gap-4 pb-6 last:pb-0", className)}>
      {showConnector ? (
        <span
          className="absolute bottom-0 left-[7px] top-4 w-px bg-ra-border"
          aria-hidden="true"
        />
      ) : null}
      <span
        className="relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-ra-accent bg-ra-surface"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-[0.08em] text-ra-muted">
          {typeLabel.toUpperCase()} · {timestampLabel}
        </p>
        <h3 className="mt-1.5 text-base font-semibold text-ra-ink">{title}</h3>
        <p className="mt-1.5 text-sm font-normal leading-relaxed text-ra-muted">
          {body}
        </p>
        {actionLabel && href ? (
          <ButtonGhost href={href} className="mt-3">
            {actionLabel}
          </ButtonGhost>
        ) : null}
      </div>
    </li>
  );
}
