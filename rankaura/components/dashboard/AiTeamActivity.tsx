import { AIEmployeeCard } from "@/components/ui/AIEmployeeCard";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { DashboardTeamMember } from "@/types/dashboard";

interface AiTeamActivityProps {
  activities: DashboardTeamMember[];
}

/**
 * Your AI Team — alive employee feed.
 * Future: Scout, Writer, Optimiser, Architect, Publisher, Analyst → AuraCore
 */
export function AiTeamActivity({ activities }: AiTeamActivityProps) {
  return (
    <Card delay={80}>
      <SectionHeader
        title="Your AI Team"
        description="Working for you right now"
      />
      <ul className="space-y-5">
        {activities.map((activity) => (
          <li key={activity.id}>
            <AIEmployeeCard employee={activity} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
