import type { ReactNode } from "react";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

interface RecommendationCardProps {
  eyebrow: string;
  title: string;
  support: string;
  actionLabel: string;
  href?: string;
  headingId?: string;
  children?: ReactNode;
}

/** Featured recommendation content inside THE shared SurfaceCard. */
export function RecommendationCard({
  eyebrow,
  title,
  support,
  actionLabel,
  href,
  headingId = "recommendation-heading",
}: RecommendationCardProps) {
  return (
    <SurfaceCard as="section" aria-labelledby={headingId}>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-ra-accent">
        {eyebrow.toUpperCase()}
      </p>
      <h2
        id={headingId}
        className="mt-3 text-xl font-semibold tracking-tight text-ra-ink sm:text-2xl"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-ra-muted">
        {support}
      </p>
      <div className="mt-6">
        <ButtonPrimary href={href}>{actionLabel}</ButtonPrimary>
      </div>
    </SurfaceCard>
  );
}
