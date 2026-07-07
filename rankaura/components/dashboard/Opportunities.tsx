import { Card } from "@/components/ui/Card";
import { OpportunityCard } from "@/components/ui/OpportunityCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { DashboardOpportunity } from "@/types/dashboard";

interface OpportunitiesProps {
  opportunities: DashboardOpportunity[];
}

/**
 * Opportunities — actionable growth suggestions with impact estimates.
 * Future: Scout → AuraCore
 */
export function Opportunities({ opportunities }: OpportunitiesProps) {
  return (
    <Card delay={200}>
      <SectionHeader
        title="Opportunities"
        description="Ways to help more customers find you"
      />
      <ul className="space-y-5">
        {opportunities.map((opp) => (
          <li key={opp.id}>
            <OpportunityCard opportunity={opp} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
