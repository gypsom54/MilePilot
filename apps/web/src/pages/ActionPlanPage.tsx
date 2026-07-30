import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useActionPlan } from "../actionPlans/ActionPlanContext";
import { ActionPlanComplete } from "../components/ActionPlanComplete";
import { ActionPlanOutline } from "../components/ActionPlanOutline";
import { ActionPlanStepFocus } from "../components/ActionPlanStep";
import { PageContainer } from "../components/PageContainer";
import { PlainLanguageNote } from "../components/PlainLanguageNote";
import "./ActionPlanPage.css";

export function ActionPlanPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    getPlan,
    ensureSession,
    getSession,
    getCurrentStep,
    markStepComplete,
    goToStep,
    isStepComplete,
    completedCount,
    isPlanComplete,
  } = useActionPlan();

  const plan = slug ? getPlan(slug) : undefined;

  useEffect(() => {
    if (slug && plan) {
      ensureSession(slug);
    }
  }, [slug, plan, ensureSession]);

  if (!slug) {
    return <Navigate to="/opportunities" replace />;
  }

  if (!plan) {
    return (
      <PageContainer narrow>
        <div className="action-plan-page__missing">
          <h1>Action plan not available yet</h1>
          <p>
            A guided plan has not been prepared for this opportunity in the current mock
            set. You can return to the opportunity details or browse other opportunities.
          </p>
          <p>
            <Link to={`/opportunities/${slug}`}>Back to opportunity</Link>
          </p>
          <p>
            <Link to="/opportunities">View all opportunities</Link>
          </p>
        </div>
      </PageContainer>
    );
  }

  const session = getSession(slug);
  const currentStep = getCurrentStep(slug);
  const completed = completedCount(slug);
  const total = plan.steps.length;
  const planComplete = isPlanComplete(slug);
  const currentIndex = currentStep
    ? plan.steps.findIndex((step) => step.id === currentStep.id)
    : -1;

  return (
    <PageContainer>
      <nav className="action-plan-page__crumb" aria-label="Breadcrumb">
        <Link to="/opportunities">Opportunities</Link>
        <span aria-hidden="true"> / </span>
        <Link to={`/opportunities/${slug}`}>{plan.title}</Link>
        <span aria-hidden="true"> / </span>
        <span>Action plan</span>
      </nav>

      <header className="action-plan-page__header">
        <p className="action-plan-page__eyebrow">Guided action plan</p>
        <h1 className="action-plan-page__title">{plan.title}</h1>
        <p className="action-plan-page__intro">{plan.introduction}</p>
        <p className="action-plan-page__meta">
          Estimated time: {plan.estimatedTime}
        </p>
        <p className="action-plan-page__progress" aria-live="polite">
          {completed} of {total} steps completed
        </p>
      </header>

      <PlainLanguageNote>
        <p>
          This is guided implementation with manual confirmation. SEO AutoPilot will not
          change your website for you in this sprint.
        </p>
      </PlainLanguageNote>

      {session ? (
        <ActionPlanOutline
          steps={plan.steps}
          currentStepId={session.currentStepId}
          completedStepIds={session.completedStepIds}
          onSelectStep={(stepId) => goToStep(slug, stepId)}
        />
      ) : null}

      {planComplete ? <ActionPlanComplete /> : null}

      {currentStep && currentIndex >= 0 ? (
        <ActionPlanStepFocus
          step={currentStep}
          stepNumber={currentIndex + 1}
          totalSteps={total}
          isComplete={isStepComplete(slug, currentStep.id)}
          onMarkComplete={() => markStepComplete(slug, currentStep.id)}
        />
      ) : null}
    </PageContainer>
  );
}
