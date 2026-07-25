export type GrowthTrend = "up" | "steady" | "down";

export interface GrowthMetric {
  id: string;
  businessId: string;
  label: string;
  changePercent: number;
  progress: number;
  trend: GrowthTrend;
  summary: string;
  detail: string;
  recordedAt: string;
}
