import { describe, it, expect } from 'vitest';
import {
  SEOReviewer,
  BrandReviewer,
  ReadabilityReviewer,
  QAReviewer,
} from '../src/modules/reviewers/index.js';
import { MODULE_RESPONSIBILITIES } from '../src/config/department.config.js';
import { MOCK_BRIEF_LANDING_PAGE } from '../src/mock/mockBriefs.js';
import type { Draft, ReviewRequest } from '../src/types/interfaces.js';

const mockDraft: Draft = {
  id: 'draft-test',
  briefId: 'brief-001',
  version: 1,
  title: 'Test',
  body: 'This is cheap content without keywords.',
  wordCount: 8,
  sections: [{ heading: 'Hero', content: 'Test content' }],
  metadata: {
    planId: 'plan-001',
    strategyId: 'strategy-001',
    producedBy: 'copywriter',
    lastModifiedBy: 'copywriter',
    lastModifiedAt: new Date().toISOString(),
  },
};

const baseRequest: ReviewRequest = {
  id: 'review-test',
  draftId: mockDraft.id,
  draftVersion: 1,
  stage: 'seo',
  reviewerId: 'seo-reviewer',
  brief: MOCK_BRIEF_LANDING_PAGE,
  draft: mockDraft,
  requestedAt: new Date().toISOString(),
};

describe('Reviewers — single responsibility', () => {
  it('SEOReviewer only checks SEO concerns', () => {
    const reviewer = new SEOReviewer();
    expect(reviewer.responsibility).toBe(MODULE_RESPONSIBILITIES['seo-reviewer']);
    const result = reviewer.execute({ ...baseRequest, stage: 'seo', reviewerId: 'seo-reviewer' }).payload;
    expect(result.stage).toBe('seo');
    expect(result.findings.every((f) => ['keyword', 'meta'].includes(f.category))).toBe(true);
  });

  it('BrandReviewer only checks brand concerns', () => {
    const reviewer = new BrandReviewer();
    const result = reviewer.execute({ ...baseRequest, stage: 'brand', reviewerId: 'brand-reviewer' }).payload;
    expect(result.findings.some((f) => f.category === 'brand-voice')).toBe(true);
    expect(result.findings.some((f) => f.message.includes('cheap'))).toBe(true);
  });

  it('ReadabilityReviewer only checks readability', () => {
    const reviewer = new ReadabilityReviewer();
    const result = reviewer.execute({
      ...baseRequest,
      stage: 'readability',
      reviewerId: 'readability-reviewer',
    }).payload;
    expect(result.stage).toBe('readability');
  });

  it('QAReviewer only checks publish-readiness', () => {
    const reviewer = new QAReviewer();
    const result = reviewer.execute({ ...baseRequest, stage: 'qa', reviewerId: 'qa-reviewer' }).payload;
    expect(result.stage).toBe('qa');
  });

  it('each reviewer has a unique moduleId', () => {
    const reviewers = [new SEOReviewer(), new BrandReviewer(), new ReadabilityReviewer(), new QAReviewer()];
    const ids = reviewers.map((r) => r.moduleId);
    expect(new Set(ids).size).toBe(4);
  });
});
