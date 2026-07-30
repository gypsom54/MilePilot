import { Link } from "react-router-dom";
import type { TodaysPriority } from "../content/briefing";
import "./TodaysPriorityCard.css";

type TodaysPriorityCardProps = {
  priority: TodaysPriority;
};

export function TodaysPriorityCard({ priority }: TodaysPriorityCardProps) {
  return (
    <section className="todays-priority" aria-labelledby="todays-priority-heading">
      <p className="todays-priority__eyebrow">Today’s priority</p>
      <h2 className="todays-priority__title" id="todays-priority-heading">
        {priority.title}
      </h2>

      <dl className="todays-priority__meta">
        <div>
          <dt>Why this matters</dt>
          <dd>{priority.whyItMatters}</dd>
        </div>
        <div>
          <dt>Estimated effort</dt>
          <dd>{priority.estimatedEffort}</dd>
        </div>
        <div>
          <dt>Potential impact</dt>
          <dd>{priority.potentialImpact}</dd>
        </div>
      </dl>

      <Link className="todays-priority__cta" to={priority.href}>
        {priority.ctaLabel}
      </Link>
    </section>
  );
}
