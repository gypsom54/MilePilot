import type { ContentBrief } from '../types/interfaces.js';

export const MOCK_BRIEF_LANDING_PAGE: ContentBrief = {
  id: 'brief-001',
  title: 'Vector OS — Product Launch Landing Page',
  format: 'landing_page',
  audience: 'business_owner',
  tone: 'professional',
  objective: 'Drive sign-ups for Vector OS beta programme',
  keywords: ['vector os', 'design system', 'ui lab'],
  constraints: {
    maxWordCount: 600,
    minWordCount: 400,
    requiredSections: ['Hero', 'Features', 'Call to Action'],
    forbiddenTerms: ['cheap', 'guaranteed'],
    callToAction: 'Join the beta',
  },
  businessContext: {
    campaign: 'vector-os-launch',
    productArea: 'design-system',
    targetMetric: 'beta sign-ups',
    impactTier: 'high',
  },
  createdAt: '2026-07-07T00:00:00.000Z',
};

export const MOCK_BRIEF_EMAIL: ContentBrief = {
  id: 'brief-002',
  title: 'Welcome Email — New User Onboarding',
  format: 'email',
  audience: 'general',
  tone: 'friendly',
  objective: 'Welcome new users and guide them to first action',
  keywords: ['welcome', 'get started'],
  constraints: {
    maxWordCount: 300,
    callToAction: 'Complete your profile',
  },
  businessContext: {
    campaign: 'onboarding-v1',
    productArea: 'user-activation',
    targetMetric: 'profile completion rate',
    impactTier: 'medium',
  },
  createdAt: '2026-07-07T00:00:00.000Z',
};

export const MOCK_BRIEF_ARTICLE: ContentBrief = {
  id: 'brief-003',
  title: 'Editorial Department Architecture Guide',
  format: 'article',
  audience: 'developer',
  tone: 'technical',
  objective: 'Explain the Writer Department orchestrator pattern',
  keywords: ['orchestrator', 'editorial', 'architecture'],
  constraints: {
    maxWordCount: 1200,
    requiredSections: ['Overview', 'Modules', 'Pipeline'],
    forbiddenTerms: ['AI-generated'],
  },
  businessContext: {
    productArea: 'aura-core',
    targetMetric: 'developer adoption',
    impactTier: 'strategic',
  },
  createdAt: '2026-07-07T00:00:00.000Z',
};

export const MOCK_BRIEFS = [MOCK_BRIEF_LANDING_PAGE, MOCK_BRIEF_EMAIL, MOCK_BRIEF_ARTICLE] as const;
