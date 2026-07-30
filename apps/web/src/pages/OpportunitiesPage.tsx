import { Link } from "react-router-dom";
import { OpportunityCategoryGroup } from "../components/OpportunityCategoryGroup";
import { PageContainer } from "../components/PageContainer";
import { PageIntro } from "../components/PageIntro";
import { PlainLanguageNote } from "../components/PlainLanguageNote";
import { PrioritisationLegend } from "../components/PrioritisationLegend";
import { useOpportunities } from "../opportunities/useOpportunities";
import "./OpportunitiesPage.css";

export function OpportunitiesPage() {
  const { grouped, firstPriority } = useOpportunities();

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Opportunity Engine"
        title="What deserves your attention next."
        description={
          <p>
            These are business decisions, not a technical audit. Each opportunity is
            ordered by impact first, so you can see what to tackle first.
          </p>
        }
      />

      <PlainLanguageNote>
        <p>
          This list uses structured mock opportunities for Harbour View Plumbing. Live
          opportunity scoring engines are not connected yet.
        </p>
      </PlainLanguageNote>

      {firstPriority ? (
        <aside className="opportunities-page__first" aria-label="Tackle first">
          <p className="opportunities-page__first-label">Start here</p>
          <h2 className="opportunities-page__first-title">
            <Link to={`/opportunities/${firstPriority.slug}`}>{firstPriority.title}</Link>
          </h2>
          <p className="opportunities-page__first-copy">{firstPriority.whyThisMatters}</p>
          <p className="opportunities-page__first-band">{firstPriority.priorityLabel}</p>
        </aside>
      ) : null}

      <PrioritisationLegend />

      <nav className="opportunities-page__nav" aria-label="Opportunity categories">
        {grouped.map(({ category }) => (
          <a key={category.id} href={`#${category.id}`}>
            {category.title}
          </a>
        ))}
      </nav>

      {grouped.map(({ category, opportunities }) => (
        <OpportunityCategoryGroup
          key={category.id}
          category={category}
          opportunities={opportunities}
        />
      ))}
    </PageContainer>
  );
}
