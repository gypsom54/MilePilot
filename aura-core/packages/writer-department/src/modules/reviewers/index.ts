import type { ReviewStage, ReviewerModuleId } from '../../types/index.js';
import type { IReviewer, ModuleResponse, ReviewRequest, ReviewResult } from '../../types/interfaces.js';
import { MODULE_RESPONSIBILITIES } from '../../config/department.config.js';
import { scoreFromFindings } from '../../models/ContentQuality.js';
import { BaseModule } from '../BaseModule.js';

export abstract class BaseReviewer extends BaseModule<ReviewRequest, ReviewResult> implements IReviewer {
  abstract readonly moduleId: ReviewerModuleId;
  abstract readonly stage: ReviewStage;
  abstract readonly responsibility: string;

  execute(input: ReviewRequest): ModuleResponse<ReviewResult> {
    const findings = this.evaluate(input);
    const errorCount = findings.filter((f) => f.severity === 'error').length;
    const warningCount = findings.filter((f) => f.severity === 'warning').length;
    const infoCount = findings.filter((f) => f.severity === 'info').length;

    const score = scoreFromFindings(errorCount, warningCount, infoCount);
    const outcome = errorCount > 0 ? 'needs_revision' : warningCount > 0 ? 'needs_revision' : 'pass';

    const result: ReviewResult = {
      id: input.id,
      draftId: input.draftId,
      draftVersion: input.draftVersion,
      reviewerId: this.moduleId,
      stage: this.stage,
      outcome,
      findings,
      qualityDelta: { [this.stage]: score },
      completedAt: new Date().toISOString(),
    };

    return this.createResponse('review', true, result, input.id);
  }

  protected abstract evaluate(request: ReviewRequest): ReviewResult['findings'];
}

export class SEOReviewer extends BaseReviewer {
  readonly moduleId = 'seo-reviewer' as const;
  readonly stage = 'seo' as const;
  readonly responsibility = MODULE_RESPONSIBILITIES['seo-reviewer'];

  protected evaluate(request: ReviewRequest): ReviewResult['findings'] {
    const findings: ReviewResult['findings'] = [];
    const { brief, draft } = request;

    const missingKeywords = brief.keywords.filter(
      (kw) => !draft.body.toLowerCase().includes(kw.toLowerCase()),
    );

    for (const kw of missingKeywords) {
      findings.push({
        severity: 'warning',
        category: 'keyword',
        message: `Target keyword "${kw}" not found in draft`,
        suggestion: `Include "${kw}" in a heading or first paragraph`,
      });
    }

    if (draft.title.length < 30) {
      findings.push({
        severity: 'info',
        category: 'meta',
        message: 'Title may be too short for search snippets',
      });
    }

    return findings;
  }
}

export class BrandReviewer extends BaseReviewer {
  readonly moduleId = 'brand-reviewer' as const;
  readonly stage = 'brand' as const;
  readonly responsibility = MODULE_RESPONSIBILITIES['brand-reviewer'];

  protected evaluate(request: ReviewRequest): ReviewResult['findings'] {
    const findings: ReviewResult['findings'] = [];
    const { brief, draft } = request;

    for (const term of brief.constraints.forbiddenTerms ?? []) {
      if (draft.body.toLowerCase().includes(term.toLowerCase())) {
        findings.push({
          severity: 'error',
          category: 'brand-voice',
          message: `Forbidden term "${term}" found in draft`,
          suggestion: `Remove or replace "${term}"`,
        });
      }
    }

    if (brief.tone === 'professional' && draft.body.includes('!')) {
      findings.push({
        severity: 'warning',
        category: 'tone',
        message: 'Exclamation marks may not align with professional tone',
      });
    }

    return findings;
  }
}

export class ReadabilityReviewer extends BaseReviewer {
  readonly moduleId = 'readability-reviewer' as const;
  readonly stage = 'readability' as const;
  readonly responsibility = MODULE_RESPONSIBILITIES['readability-reviewer'];

  protected evaluate(request: ReviewRequest): ReviewResult['findings'] {
    const findings: ReviewResult['findings'] = [];
    const { draft, brief } = request;

    const sentences = draft.body.split(/[.!?]+/).filter(Boolean);
    const longSentences = sentences.filter((s) => s.split(/\s+/).length > 30);

    for (const sentence of longSentences) {
      findings.push({
        severity: 'warning',
        category: 'sentence-length',
        message: 'Sentence exceeds 30 words',
        location: sentence.trim().slice(0, 50) + '...',
        suggestion: 'Break into shorter sentences',
      });
    }

    if (brief.constraints.maxWordCount && draft.wordCount > brief.constraints.maxWordCount) {
      findings.push({
        severity: 'error',
        category: 'word-count',
        message: `Draft exceeds max word count (${draft.wordCount}/${brief.constraints.maxWordCount})`,
      });
    }

    return findings;
  }
}

export class QAReviewer extends BaseReviewer {
  readonly moduleId = 'qa-reviewer' as const;
  readonly stage = 'qa' as const;
  readonly responsibility = MODULE_RESPONSIBILITIES['qa-reviewer'];

  protected evaluate(request: ReviewRequest): ReviewResult['findings'] {
    const findings: ReviewResult['findings'] = [];
    const { draft, brief } = request;

    if (!draft.sections.length) {
      findings.push({
        severity: 'error',
        category: 'completeness',
        message: 'Draft has no sections',
      });
    }

    if (brief.constraints.callToAction && !draft.body.includes(brief.constraints.callToAction)) {
      findings.push({
        severity: 'warning',
        category: 'cta',
        message: 'Required call-to-action not found in draft',
        suggestion: `Add CTA: "${brief.constraints.callToAction}"`,
      });
    }

    if (draft.body.includes('[Draft copy') || draft.body.includes('[Edited copy')) {
      findings.push({
        severity: 'info',
        category: 'placeholder',
        message: 'Draft contains placeholder markers',
      });
    }

    return findings;
  }
}
