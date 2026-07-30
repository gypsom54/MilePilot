import type { ActionPlanStepDefinition } from "../content/actionPlans";
import "./ActionPlanOutline.css";

type ActionPlanOutlineProps = {
  steps: ActionPlanStepDefinition[];
  currentStepId: string;
  completedStepIds: string[];
  onSelectStep: (stepId: string) => void;
};

export function ActionPlanOutline({
  steps,
  currentStepId,
  completedStepIds,
  onSelectStep,
}: ActionPlanOutlineProps) {
  return (
    <nav className="action-plan-outline" aria-label="Action plan steps">
      <ol className="action-plan-outline__list">
        {steps.map((step, index) => {
          const done = completedStepIds.includes(step.id);
          const current = step.id === currentStepId;
          return (
            <li key={step.id}>
              <button
                type="button"
                className={[
                  "action-plan-outline__item",
                  current ? "action-plan-outline__item--current" : "",
                  done ? "action-plan-outline__item--done" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSelectStep(step.id)}
                aria-current={current ? "step" : undefined}
              >
                <span className="action-plan-outline__index" aria-hidden="true">
                  {done ? "✓" : index + 1}
                </span>
                <span className="action-plan-outline__title">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
