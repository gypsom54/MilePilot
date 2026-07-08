import type { ContentBrief, ContentPlan, ModuleResponse } from '../types/interfaces.js';
import { MODULE_RESPONSIBILITIES } from '../config/department.config.js';
import { BaseModule } from './BaseModule.js';

export interface PlannerInput {
  brief: ContentBrief;
  correlationId?: string;
}

export class Planner extends BaseModule<PlannerInput, ContentPlan> {
  readonly moduleId = 'planner' as const;
  readonly responsibility = MODULE_RESPONSIBILITIES.planner;

  execute(input: PlannerInput): ModuleResponse<ContentPlan> {
    const correlationId = input.correlationId ?? this.generateCorrelationId();
    const { brief } = input;

    const sectionCount = brief.constraints.requiredSections?.length ?? 3;
    const outline = Array.from({ length: sectionCount }, (_, i) => ({
      heading: brief.constraints.requiredSections?.[i] ?? `Section ${i + 1}`,
      purpose: `Deliver on objective: ${brief.objective}`,
      targetWordCount: Math.floor(
        (brief.constraints.maxWordCount ?? 800) / sectionCount,
      ),
    }));

    const plan: ContentPlan = {
      id: `plan-${brief.id}`,
      briefId: brief.id,
      outline,
      estimatedWordCount: brief.constraints.maxWordCount ?? 800,
      keyMessages: [
        brief.objective,
        `Target audience: ${brief.audience}`,
        `Tone: ${brief.tone}`,
      ],
      createdBy: 'planner',
      createdAt: new Date().toISOString(),
    };

    return this.createResponse('create_plan', true, plan, correlationId);
  }
}
