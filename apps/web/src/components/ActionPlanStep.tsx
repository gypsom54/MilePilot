import { Link } from "react-router-dom";
import type { ActionPlanStepDefinition } from "../content/actionPlans";
import "./ActionPlanStep.css";

type ActionPlanStepProps = {
  step: ActionPlanStepDefinition;
  stepNumber: number;
  totalSteps: number;
  isComplete: boolean;
  onMarkComplete: () => void;
};

export function ActionPlanStepFocus({
  step,
  stepNumber,
  totalSteps,
  isComplete,
  onMarkComplete,
}: ActionPlanStepProps) {
  const askHref = step.askReference
    ? `/ask?q=${encodeURIComponent(step.askReference.suggestedQuestion)}`
    : null;

  return (
    <section
      className="action-plan-step"
      aria-labelledby={`action-step-${step.id}-title`}
    >
      <p className="action-plan-step__eyebrow">
        Step {stepNumber} of {totalSteps}
        {isComplete ? " · Completed" : ""}
      </p>
      <h2 className="action-plan-step__title" id={`action-step-${step.id}-title`}>
        {step.title}
      </h2>

      <div className="action-plan-step__block">
        <h3>What to do</h3>
        <p>{step.whatToDo}</p>
      </div>

      <div className="action-plan-step__block">
        <h3>Why it matters</h3>
        <p>{step.whyItMatters}</p>
      </div>

      <div className="action-plan-step__block">
        <h3>Helpful guidance</h3>
        <p>{step.helpfulGuidance}</p>
      </div>

      {step.relatedLearningGuide ? (
        <div className="action-plan-step__block">
          <h3>Related learning guide</h3>
          <p>
            <Link to={step.relatedLearningGuide.href}>
              {step.relatedLearningGuide.title}
            </Link>
          </p>
        </div>
      ) : null}

      <div className="action-plan-step__actions">
        {!isComplete ? (
          <button
            type="button"
            className="action-plan-step__cta"
            onClick={onMarkComplete}
          >
            Mark this step complete
          </button>
        ) : (
          <p className="action-plan-step__done-note">This step is marked complete.</p>
        )}

        {askHref ? (
          <Link className="action-plan-step__ask" to={askHref}>
            Ask SEO AutoPilot
          </Link>
        ) : null}
      </div>
    </section>
  );
}
