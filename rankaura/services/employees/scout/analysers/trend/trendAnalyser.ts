import type {
  ITrendAnalyser,
  TrendAnalysisInput,
  TrendAnalysisResult,
} from "@/services/employees/scout/analysers/trend/types";

export const trendAnalyser: ITrendAnalyser = {
  async analyse(input: TrendAnalysisInput): Promise<TrendAnalysisResult> {
    return {
      businessId: input.businessId,
      summary: `Demand in ${input.market} is rising for emergency services ahead of winter.`,
      analysedAt: new Date().toISOString(),
      findings: [
        {
          id: "tf-1",
          label: "Emergency repair demand rising",
          description: "Local searches for urgent boiler repair up 18% this quarter.",
          direction: "rising",
          confidence: 91,
        },
        {
          id: "tf-2",
          label: "Service plan interest steady",
          description: "Maintenance package interest holds year-round with slight winter uplift.",
          direction: "steady",
          confidence: 78,
        },
      ],
    };
  },
};
