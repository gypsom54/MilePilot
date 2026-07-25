export interface ContentPlan {
  outline: string[];
  targetAudience: string;
  estimatedWordCount: number;
  deadline: string;
}

export interface PlannerInput {
  brief: string;
}

export type PlannerOutput = ContentPlan;