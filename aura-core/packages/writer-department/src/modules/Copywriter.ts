import type {
  ContentBrief,
  ContentPlan,
  ContentStrategy,
  Draft,
  ModuleResponse,
} from '../types/interfaces.js';
import { MODULE_RESPONSIBILITIES } from '../config/department.config.js';
import { BaseModule } from './BaseModule.js';

export interface CopywriterInput {
  brief: ContentBrief;
  plan: ContentPlan;
  strategy: ContentStrategy;
  correlationId?: string;
}

export class Copywriter extends BaseModule<CopywriterInput, Draft> {
  readonly moduleId = 'copywriter' as const;
  readonly responsibility = MODULE_RESPONSIBILITIES.copywriter;

  execute(input: CopywriterInput): ModuleResponse<Draft> {
    const correlationId = input.correlationId ?? this.generateCorrelationId();
    const { brief, plan, strategy } = input;

    const sections = plan.outline.map((section) => ({
      heading: section.heading,
      content: `[Draft copy for "${section.heading}" — ${section.purpose}. Angle: ${strategy.angle}]`,
    }));

    const body = sections.map((s) => `## ${s.heading}\n\n${s.content}`).join('\n\n');
    const wordCount = body.split(/\s+/).length;

    const draft: Draft = {
      id: `draft-${brief.id}-v1`,
      briefId: brief.id,
      version: 1,
      title: brief.title,
      body,
      wordCount,
      sections,
      metadata: {
        planId: plan.id,
        strategyId: strategy.id,
        producedBy: 'copywriter',
        lastModifiedBy: 'copywriter',
        lastModifiedAt: new Date().toISOString(),
      },
    };

    return this.createResponse('create_draft', true, draft, correlationId);
  }
}
