import { Card } from "@/components/ui/Card";
import { DepartmentHeader } from "@/components/mission-workspace/DepartmentHeader";
import { MetricBadge } from "@/components/mission-workspace/MetricBadge";
import type { MissionBriefingImpact } from "@/types/mission";

interface BusinessImpactCardProps {
  impact: MissionBriefingImpact;
  delay?: number;
}

export function BusinessImpactCard({ impact, delay = 240 }: BusinessImpactCardProps) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-[var(--shadow-md)]" delay={delay}>
      <DepartmentHeader
        department="Impact"
        title="Business Impact"
        description="Projected outcomes if you approve this mission"
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricBadge label="Est. monthly visitors" value={impact.estimatedMonthlyVisitors} variant="accent" />
        <MetricBadge label="Potential leads" value={impact.potentialLeads} />
        <MetricBadge label="Revenue impact" value={impact.estimatedRevenueImpact} variant="success" />
        <MetricBadge label="Hours saved" value={impact.hoursSaved} />
        <MetricBadge label="Confidence" value={`${impact.confidence}%`} variant="accent" />
      </div>
    </Card>
  );
}
