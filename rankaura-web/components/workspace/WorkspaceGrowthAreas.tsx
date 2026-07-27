import { ButtonGhost } from "@/components/ui/ButtonGhost";
import { GrowthCard } from "@/components/ui/GrowthCard";
import type { WorkspaceGrowthArea } from "@/types/workspace";

interface WorkspaceGrowthAreasProps {
  areas: WorkspaceGrowthArea[];
}

export function WorkspaceGrowthAreas({ areas }: WorkspaceGrowthAreasProps) {
  return (
    <section aria-labelledby="workspace-growth-areas-heading" className="space-y-4">
      <div>
        <h2
          id="workspace-growth-areas-heading"
          className="text-lg font-semibold text-ra-ink"
        >
          Growth areas
        </h2>
        <p className="mt-1 text-sm font-normal text-ra-muted">
          The areas that matter most right now — from your Growth Plan.
        </p>
      </div>
      <div className="space-y-3">
        {areas.slice(0, 4).map((area) => (
          <GrowthCard
            key={area.id}
            name={area.name}
            subtitle={area.subtitle}
            statusLabel={area.statusLabel}
            impact={area.impact}
            actionLabel={area.actionLabel}
            href={area.href}
          />
        ))}
      </div>
      <p className="text-sm">
        <ButtonGhost href="/growth-plan?site=existing">
          View full Growth Plan
        </ButtonGhost>
      </p>
    </section>
  );
}
