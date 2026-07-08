/**
 * Content quality scores aggregated from reviewers.
 */

export interface ContentQualityScore {
  reviewerId: string;
  score: number;
  passed: boolean;
  notes: string;
}

export interface ContentQuality {
  draftId: string;
  overallScore: number;
  passed: boolean;
  scores: ContentQualityScore[];
  assessedAt: string;
}
