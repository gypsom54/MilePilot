import type { ProgressEvent } from "../content/briefing";
import "./RecentProgress.css";

type RecentProgressProps = {
  events: ProgressEvent[];
};

export function RecentProgress({ events }: RecentProgressProps) {
  return (
    <section className="recent-progress" aria-labelledby="recent-progress-heading">
      <div className="recent-progress__intro">
        <h2 id="recent-progress-heading">Recent progress</h2>
        <p>A light record of what SEO AutoPilot has already taken care of.</p>
      </div>
      <ol className="recent-progress__list">
        {events.map((event) => (
          <li key={event.id} className="recent-progress__item">
            <span className="recent-progress__mark" aria-hidden="true">
              ✓
            </span>
            <div>
              <p className="recent-progress__label">{event.label}</p>
              <p className="recent-progress__when">{event.whenLabel}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
