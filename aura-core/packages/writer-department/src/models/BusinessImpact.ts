import type { BriefId, DraftId, ImpactTier } from '../types/index.js';
import type { BusinessImpact, BusinessContext } from '../types/interfaces.js';

const IMPACT_MULTIPLIERS: Record<ImpactTier, { reach: number; conversion: number; exposure: number }> = {
  low: { reach: 1000, conversion: 0.01, exposure: 0.1 },
  medium: { reach: 10000, conversion: 0.03, exposure: 0.3 },
  high: { reach: 50000, conversion: 0.05, exposure: 0.6 },
  strategic: { reach: 200000, conversion: 0.08, exposure: 0.9 },
};

const RISK_BY_TIER: Record<ImpactTier, 'low' | 'medium' | 'high'> = {
  low: 'low',
  medium: 'low',
  high: 'medium',
  strategic: 'high',
};

export function createBusinessImpact(
  briefId: BriefId,
  context: BusinessContext,
  draftId?: DraftId,
): BusinessImpact {
  const multiplier = IMPACT_MULTIPLIERS[context.impactTier];

  return {
    briefId,
    draftId,
    tier: context.impactTier,
    estimatedReach: multiplier.reach,
    conversionPotential: multiplier.conversion,
    brandExposure: multiplier.exposure,
    strategicValue: context.targetMetric ?? 'brand awareness',
    riskLevel: RISK_BY_TIER[context.impactTier],
    assessedAt: new Date().toISOString(),
  };
}

export function updateBusinessImpactWithDraft(
  impact: BusinessImpact,
  draftId: DraftId,
): BusinessImpact {
  return { ...impact, draftId, assessedAt: new Date().toISOString() };
}
