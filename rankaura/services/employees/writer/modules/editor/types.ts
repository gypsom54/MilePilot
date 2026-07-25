import type { ContentQualityScore } from "@/services/employees/writer/models/content-quality";

export interface EditorOutput {
  editedBody: string;
  changesSummary: string[];
  qualityScore: ContentQualityScore;
}