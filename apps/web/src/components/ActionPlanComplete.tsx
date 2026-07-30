import { Link } from "react-router-dom";
import "./ActionPlanComplete.css";

export function ActionPlanComplete() {
  return (
    <section className="action-plan-complete" aria-labelledby="action-plan-complete-heading">
      <h2 className="action-plan-complete__heading" id="action-plan-complete-heading">
        Nicely done.
      </h2>
      <p className="action-plan-complete__lead">You’ve completed this action plan.</p>
      <p className="action-plan-complete__copy">
        This improvement should help customers and search engines understand your
        business more clearly. You can return to your opportunities whenever you are
        ready for the next calm step.
      </p>
      <div className="action-plan-complete__actions">
        <Link className="action-plan-complete__cta" to="/opportunities">
          Return to opportunities
        </Link>
        <Link className="action-plan-complete__secondary" to="/opportunities">
          View another opportunity
        </Link>
      </div>
    </section>
  );
}
