import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { MissionImpact } from "@/types/mission";

interface BusinessImpactPanelProps {
  impact: MissionImpact;
}

export function BusinessImpactPanel({ impact }: BusinessImpactPanelProps) {
  const cards = [
    { label: "Estimated visitors", value: impact.estimatedVisitors },
    { label: "Estimated enquiries", value: impact.estimatedEnquiries },
    { label: "Confidence", value: `${impact.confidence}%` },
    { label: "Time saved", value: `${impact.managementTimeMinutes} mins management time` },
  ];

  return (
    <Card>
      <SectionHeader title="Business Impact" description="Expected results from this mission" />
      <div className="grid gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background)] px-4 py-4"
          >
            <p className="text-xs text-[var(--color-text-muted)]">{card.label}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
