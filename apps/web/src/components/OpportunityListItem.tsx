import { Link } from "react-router-dom";
import type { OpportunityViewModel } from "../opportunities/useOpportunities";
import "./OpportunityListItem.css";

type OpportunityListItemProps = {
  opportunity: OpportunityViewModel;
};

export function OpportunityListItem({ opportunity }: OpportunityListItemProps) {
  return (
    <article className="opportunity-list-item">
      <div className="opportunity-list-item__meta">
        <span className="opportunity-list-item__band">{opportunity.priorityLabel}</span>
      </div>
      <h3 className="opportunity-list-item__title">
        <Link to={`/opportunities/${opportunity.slug}`}>{opportunity.title}</Link>
      </h3>
      <p className="opportunity-list-item__why">{opportunity.whyThisMatters}</p>
      <dl className="opportunity-list-item__facts">
        <div>
          <dt>Estimated effort</dt>
          <dd>{opportunity.estimatedEffort}</dd>
        </div>
        <div>
          <dt>Potential impact</dt>
          <dd>{opportunity.potentialImpact}</dd>
        </div>
      </dl>
      <p className="opportunity-list-item__action">
        <Link to={`/opportunities/${opportunity.slug}`}>View details</Link>
      </p>
    </article>
  );
}
