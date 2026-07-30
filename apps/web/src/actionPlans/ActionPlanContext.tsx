import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getActionPlanByOpportunitySlug,
  type ActionPlanCompletionState,
  type ActionPlanDefinition,
  type ActionPlanStepDefinition,
} from "../content/actionPlans";

type PlanSessionState = {
  currentStepId: string;
  completedStepIds: string[];
};

type ActionPlanContextValue = {
  getPlan: (opportunitySlug: string) => ActionPlanDefinition | undefined;
  getSession: (opportunitySlug: string) => PlanSessionState | null;
  getCompletionState: (opportunitySlug: string) => ActionPlanCompletionState;
  getCurrentStep: (
    opportunitySlug: string,
  ) => ActionPlanStepDefinition | undefined;
  markStepComplete: (opportunitySlug: string, stepId: string) => void;
  goToStep: (opportunitySlug: string, stepId: string) => void;
  ensureSession: (opportunitySlug: string) => void;
  isStepComplete: (opportunitySlug: string, stepId: string) => boolean;
  completedCount: (opportunitySlug: string) => number;
  isPlanComplete: (opportunitySlug: string) => boolean;
};

const ActionPlanContext = createContext<ActionPlanContextValue | null>(null);

function createInitialSession(plan: ActionPlanDefinition): PlanSessionState {
  const first = plan.steps[0];
  return {
    currentStepId: first?.id ?? "",
    completedStepIds: [],
  };
}

export function ActionPlanProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Record<string, PlanSessionState>>(
    {},
  );

  const getPlan = useCallback((opportunitySlug: string) => {
    return getActionPlanByOpportunitySlug(opportunitySlug);
  }, []);

  const ensureSession = useCallback((opportunitySlug: string) => {
    const plan = getActionPlanByOpportunitySlug(opportunitySlug);
    if (!plan) {
      return;
    }
    setSessions((current) => {
      if (current[opportunitySlug]) {
        return current;
      }
      return {
        ...current,
        [opportunitySlug]: createInitialSession(plan),
      };
    });
  }, []);

  const getSession = useCallback(
    (opportunitySlug: string) => sessions[opportunitySlug] ?? null,
    [sessions],
  );

  const completedCount = useCallback(
    (opportunitySlug: string) =>
      sessions[opportunitySlug]?.completedStepIds.length ?? 0,
    [sessions],
  );

  const isPlanComplete = useCallback(
    (opportunitySlug: string) => {
      const plan = getActionPlanByOpportunitySlug(opportunitySlug);
      const session = sessions[opportunitySlug];
      if (!plan || !session || plan.steps.length === 0) {
        return false;
      }
      return plan.steps.every((step) =>
        session.completedStepIds.includes(step.id),
      );
    },
    [sessions],
  );

  const getCompletionState = useCallback(
    (opportunitySlug: string): ActionPlanCompletionState => {
      const plan = getActionPlanByOpportunitySlug(opportunitySlug);
      const session = sessions[opportunitySlug];
      if (!plan || !session) {
        return "not_started";
      }
      if (
        plan.steps.length > 0 &&
        plan.steps.every((step) => session.completedStepIds.includes(step.id))
      ) {
        return "completed";
      }
      if (session.completedStepIds.length > 0) {
        return "in_progress";
      }
      return "not_started";
    },
    [sessions],
  );

  const getCurrentStep = useCallback(
    (opportunitySlug: string) => {
      const plan = getActionPlanByOpportunitySlug(opportunitySlug);
      const session = sessions[opportunitySlug];
      if (!plan || !session) {
        return undefined;
      }
      return plan.steps.find((step) => step.id === session.currentStepId);
    },
    [sessions],
  );

  const isStepComplete = useCallback(
    (opportunitySlug: string, stepId: string) =>
      sessions[opportunitySlug]?.completedStepIds.includes(stepId) ?? false,
    [sessions],
  );

  const goToStep = useCallback((opportunitySlug: string, stepId: string) => {
    const plan = getActionPlanByOpportunitySlug(opportunitySlug);
    if (!plan?.steps.some((step) => step.id === stepId)) {
      return;
    }
    setSessions((current) => {
      const existing = current[opportunitySlug] ?? createInitialSession(plan);
      return {
        ...current,
        [opportunitySlug]: {
          ...existing,
          currentStepId: stepId,
        },
      };
    });
  }, []);

  const markStepComplete = useCallback(
    (opportunitySlug: string, stepId: string) => {
      const plan = getActionPlanByOpportunitySlug(opportunitySlug);
      if (!plan?.steps.some((step) => step.id === stepId)) {
        return;
      }

      setSessions((current) => {
        const existing = current[opportunitySlug] ?? createInitialSession(plan);
        const completedStepIds = existing.completedStepIds.includes(stepId)
          ? existing.completedStepIds
          : [...existing.completedStepIds, stepId];

        const currentIndex = plan.steps.findIndex((step) => step.id === stepId);
        const nextIncomplete = plan.steps.find(
          (step, index) =>
            index > currentIndex && !completedStepIds.includes(step.id),
        );
        const firstIncomplete = plan.steps.find(
          (step) => !completedStepIds.includes(step.id),
        );

        return {
          ...current,
          [opportunitySlug]: {
            completedStepIds,
            currentStepId:
              nextIncomplete?.id ??
              firstIncomplete?.id ??
              existing.currentStepId,
          },
        };
      });
    },
    [],
  );

  const value = useMemo<ActionPlanContextValue>(
    () => ({
      getPlan,
      getSession,
      getCompletionState,
      getCurrentStep,
      markStepComplete,
      goToStep,
      ensureSession,
      isStepComplete,
      completedCount,
      isPlanComplete,
    }),
    [
      getPlan,
      getSession,
      getCompletionState,
      getCurrentStep,
      markStepComplete,
      goToStep,
      ensureSession,
      isStepComplete,
      completedCount,
      isPlanComplete,
    ],
  );

  return (
    <ActionPlanContext.Provider value={value}>
      {children}
    </ActionPlanContext.Provider>
  );
}

export function useActionPlan(): ActionPlanContextValue {
  const value = useContext(ActionPlanContext);
  if (!value) {
    throw new Error("useActionPlan must be used within ActionPlanProvider");
  }
  return value;
}
