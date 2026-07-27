import type { ReactNode } from "react";
import { Badge, badgeVariantFromLabel } from "@/components/ui/Badge";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

interface GrowthCardProps {
  name: string;
  subtitle: string;
  statusLabel: string;
  impact: string;
  actionLabel: string;
  href: string;
  children?: ReactNode;
}

export function GrowthCard({
  name,
  subtitle,
  statusLabel,
  impact,
  actionLabel,
  href,
}: GrowthCardProps) {
  return (
    <SurfaceCard as="article">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-ra-ink sm:text-lg">
              {name}
            </h3>
            <Badge variant={badgeVariantFromLabel(statusLabel)}>
              {statusLabel}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-normal leading-relaxed text-ra-muted">
            {subtitle}
          </p>
          <p className="mt-2.5 text-sm font-medium text-ra-accent">{impact}</p>
        </div>
        <ButtonSecondary href={href} className="shrink-0 self-start">
          {actionLabel}
        </ButtonSecondary>
      </div>
    </SurfaceCard>
  );
}
