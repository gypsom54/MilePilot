/**
 * Brand voice and writing style memory.
 */

export interface BrandMemory {
  personality: string[];
  values: string[];
  tone: string;
  readingLevel: string;
  sentenceLength: "short" | "medium" | "long";
  useContractions: boolean;
  wordsToUse: string[];
  wordsToAvoid: string[];
  updatedAt: string;
}
