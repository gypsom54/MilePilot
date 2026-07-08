import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DepartmentCard } from "@/components/mission-workspace/DepartmentCard";
import type { DepartmentStatus } from "@/types/mission";

interface DepartmentWorkflowProps {
  departments: DepartmentStatus[];
}

export function DepartmentWorkflow({ departments }: DepartmentWorkflowProps) {
  return (
    <Card>
      <SectionHeader
        title="Department Progress"
        description="Work completed by your Growth Team"
      />
      <div className="space-y-6">
        {departments.map((department, index) => (
          <DepartmentCard
            key={department.id}
            department={department}
            isLast={index === departments.length - 1}
          />
        ))}
      </div>
    </Card>
  );
}
