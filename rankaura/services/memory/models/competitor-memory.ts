/**
 * Competitive landscape memory.
 */

export interface CompetitorMemory {
  competitors: CompetitorRecord[];
  lastReviewedAt: string;
  updatedAt: string;
}

export interface CompetitorRecord {
  id: string;
  name: string;
  websiteUrl: string;
  strengths: string[];
  notes: string;
}
