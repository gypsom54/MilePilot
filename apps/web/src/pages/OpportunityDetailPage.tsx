import { Link, Navigate, useParams } from "react-router-dom";
import { OpportunityDetailView } from "../components/OpportunityDetail";
import { PageContainer } from "../components/PageContainer";
import { useOpportunities } from "../opportunities/useOpportunities";
import "./OpportunityDetailPage.css";

export function OpportunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getBySlug } = useOpportunities();
  const opportunity = slug ? getBySlug(slug) : undefined;

  if (!slug) {
    return <Navigate to="/opportunities" replace />;
  }

  if (!opportunity) {
    return (
      <PageContainer narrow>
        <div className="opportunity-detail-page__missing">
          <h1>Opportunity not found</h1>
          <p>
            That opportunity is not available in the current mock set. Return to the full
            list to choose another.
          </p>
          <Link to="/opportunities">Back to opportunities</Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer narrow>
      <nav className="opportunity-detail-page__crumb" aria-label="Breadcrumb">
        <Link to="/opportunities">Opportunities</Link>
        <span aria-hidden="true"> / </span>
        <span>{opportunity.title}</span>
      </nav>
      <OpportunityDetailView opportunity={opportunity} />
    </PageContainer>
  );
}
