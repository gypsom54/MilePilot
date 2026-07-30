import { Link } from "react-router-dom";
import type { OpportunityViewModel } from "../opportunities/useOpportunities";
import "./OpportunityDetail.css";

type OpportunityDetailProps = {
  opportunity: OpportunityViewModel;
};

export function OpportunityDetailView({ opportunity }: OpportunityDetailProps) {
  return (
    <article className="opportunity-detail">
      <p className="opportunity-detail__band">{opportunity.priorityLabel}</p>
      <h1 className="opportunity-detail__title">{opportunity.title}</h1>

      <section className="opportunity-detail__block">
        <h2>Plain-English explanation</h2>
        <p>{opportunity.explanation}</p>
      </section>

      <section className="opportunity-detail__block">
        <h2>Why we identified this</h2>
        <p>{opportunity.whyIdentified}</p>
      </section>

      <section className="opportunity-detail__block">
        <h2>Why this matters</h2>
        <p>{opportunity.whyThisMatters}</p>
      </section>

      <section className="opportunity-detail__block">
        <h2>Expected benefit</h2>
        <p>{opportunity.expectedBenefit}</p>
      </section>

      <dl className="opportunity-detail__facts">
        <div>
          <dt>Estimated effort</dt>
          <dd>{opportunity.estimatedEffort}</dd>
        </div>
        <div>
          <dt>Potential impact</dt>
          <dd>{opportunity.potentialImpact}</dd>
        </div>
        <div>
          <dt>Recommended action</dt>
          <dd>{opportunity.recommendedAction}</dd>
        </div>
      </dl>

      <section className="opportunity-detail__block">
        <h2>Step-by-step guidance</h2>
        <ol className="opportunity-detail__steps">
          {opportunity.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="opportunity-detail__block">
        <h2>Related learning resource</h2>
        <p>
          <Link to={opportunity.relatedLearningGuide.href}>
            {opportunity.relatedLearningGuide.title}
          </Link>
        </p>
      </section>

      <div className="opportunity-detail__actions">
        <Link className="opportunity-detail__cta" to={`/opportunities/${opportunity.slug}/plan`}>
          Show me how
        </Link>
        <Link className="opportunity-detail__secondary" to="/opportunities">
          Back to all opportunities
        </Link>
      </div>
    </article>
  );
}
