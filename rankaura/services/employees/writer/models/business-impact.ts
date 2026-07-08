/**
 * Business impact assessment for content.
 */

export interface BusinessImpact {
  draftId: string;
  estimatedVisitorIncrease: string;
  estimatedLeadIncrease: string;
  confidence: number;
  rationale: string;
  assessedAt: string;
}
