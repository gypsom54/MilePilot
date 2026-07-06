import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AutopilotState } from "@/types/dashboard";

interface AutopilotStatusProps {
  autopilot: AutopilotState;
}

/**
 * Autopilot status — background AI operations toggle state.
 * Future: AuraCore orchestration + Publisher
 */
export function AutopilotStatus({ autopilot }: AutopilotStatusProps) {
  return (
    <Card className="border-[var(--color-aura-glow)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-aura-glow)]">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader title="Autopilot" description="Your AI team in the background" />
        <Badge variant={autopilot.enabled ? "success" : "muted"}>
          {autopilot.enabled ? "On" : "Off"}
        </Badge>
      </div>
      <p className="text-sm font-medium text-[var(--color-text-primary)]">{autopilot.label}</p>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{autopilot.description}</p>
    </Card>
  );
}
