import { AIEmployeeCard } from "@/components/ui/AIEmployeeCard";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { DashboardGrowthTeamMember } from "@/types/dashboard";

interface GrowthTeamCardProps {
  team: DashboardGrowthTeamMember[];
}

export function GrowthTeamCard({ team }: GrowthTeamCardProps) {
  const activeCount = team.filter((m) => m.status === "working").length;

  return (
    <Card delay={120}>
      <SectionHeader
        title="Growth Team Status"
        description={`${activeCount} team members working for you right now`}
      />
      <ul className="space-y-5">
        {team.map((member) => (
          <li key={member.id}>
            <AIEmployeeCard employee={member} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
