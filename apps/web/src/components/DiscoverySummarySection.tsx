import type { ReactNode } from "react";
import "./DiscoverySummarySection.css";

type DiscoverySummarySectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function DiscoverySummarySection({
  title,
  description,
  children,
}: DiscoverySummarySectionProps) {
  return (
    <section className="discovery-summary-section" aria-labelledby={slugify(title)}>
      <div className="discovery-summary-section__intro">
        <h2 id={slugify(title)}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="discovery-summary-section__body">{children}</div>
    </section>
  );
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
