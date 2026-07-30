import type { OpportunityCategory } from "../content/opportunities";
import type { OpportunityViewModel } from "../opportunities/useOpportunities";
import { OpportunityListItem } from "./OpportunityListItem";
import "./OpportunityCategoryGroup.css";

type OpportunityCategoryGroupProps = {
  category: OpportunityCategory;
  opportunities: OpportunityViewModel[];
};

export function OpportunityCategoryGroup({
  category,
  opportunities,
}: OpportunityCategoryGroupProps) {
  return (
    <section
      className="opportunity-category"
      id={category.id}
      aria-labelledby={`${category.id}-heading`}
    >
      <div className="opportunity-category__intro">
        <h2 id={`${category.id}-heading`}>{category.title}</h2>
        <p>{category.description}</p>
      </div>
      <div className="opportunity-category__list">
        {opportunities.map((opportunity) => (
          <OpportunityListItem key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </section>
  );
}
