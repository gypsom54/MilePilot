export const REPORT_CONFIG = {
  daily: { id: "daily-research-report", label: "Daily Research Report" },
  weekly: { id: "weekly-research-report", label: "Weekly Research Report" },
  monthly: { id: "monthly-research-report", label: "Monthly Research Report" },
} as const;

export type ReportPeriod = keyof typeof REPORT_CONFIG;
