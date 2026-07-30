import { Link } from "react-router-dom";
import type { DiscoveryRecommendation } from "../content/discovery";
import "./RecommendationList.css";

type RecommendationListProps = {
  recommendations: DiscoveryRecommendation[];
};

/** Summary screen must never show more than three recommendations. */
export function RecommendationList({ recommendations }: RecommendationListProps) {
  const items = recommendations.slice(0, 3);

  return (
    <ol className="recommendation-list" aria-label="Recommended first steps">
      {items.map((item, index) => (
        <li key={item.id} className="recommendation-list__item">
          <p className="recommendation-list__index" aria-hidden="true">
            {index + 1}
          </p>
          <div className="recommendation-list__body">
            <h3 className="recommendation-list__title">{item.title}</h3>
            <p className="recommendation-list__text">{item.explanation}</p>
            <Link className="recommendation-list__link" to={item.href}>
              {item.nextLabel}
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
