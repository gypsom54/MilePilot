export const RESEARCH_PIPELINE_CONFIG = {
  id: "research-pipeline",
  name: "Research Pipeline",
  stages: ["analyse", "discover", "score", "prioritise", "recommend"] as const,
} as const;
