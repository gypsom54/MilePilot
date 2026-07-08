import type { ContentBrief, ContentPlan, ContentStrategy, ModuleResponse } from '../types/interfaces.js';
import { MODULE_RESPONSIBILITIES } from '../config/department.config.js';
import { BaseModule } from './BaseModule.js';

export interface StrategistInput {
  brief: ContentBrief;
  plan: ContentPlan;
  correlationId?: string;
}

export class Strategist extends BaseModule<StrategistInput, ContentStrategy> {
  readonly moduleId = 'strategist' as const;
  readonly responsibility = MODULE_RESPONSIBILITIES.strategist;

  execute(input: StrategistInput): ModuleResponse<ContentStrategy> {
    const correlationId = input.correlationId ?? this.generateCorrelationId();
    const { brief, plan } = input;

    const strategy: ContentStrategy = {
      id: `strategy-${brief.id}`,
      briefId: brief.id,
      planId: plan.id,
      angle: `${brief.tone} narrative for ${brief.audience}`,
      positioning: `Lead with ${brief.objective}`,
      narrativeArc: plan.outline.map((s) => s.heading),
      seoFocus: brief.keywords,
      brandPillars: ['clarity', 'trust', 'authority'],
      createdBy: 'strategist',
      createdAt: new Date().toISOString(),
    };

    return this.createResponse('create_strategy', true, strategy, correlationId);
  }
}
