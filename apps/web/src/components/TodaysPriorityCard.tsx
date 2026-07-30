import { Link } from "react-router-dom";
import type { TodaysPriority } from "../content/briefing";
import "./TodaysPriorityCard.css";

type TodaysPriorityCardProps = {
  priority: TodaysPriority | null;
  allClearMessage: string;
};

export function TodaysPriorityCard({
  priority,
  allClearMessage,
}: TodaysPriorityCardProps) {
  if (!priority) {
    return (
      <section
        className="todays-priority todays-priority--clear"
        aria-labelledby="todays-priority-heading"
      >
        <p className="todays-priority__eyebrow">Today’s priority</p>
        <h2 className="todays-priority__title" id="todays-priority-heading">
          Everything looks good today
        </h2>
        <p className="todays-priority__clear-message">{allClearMessage}</p>
      </section>
    );
  }

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
