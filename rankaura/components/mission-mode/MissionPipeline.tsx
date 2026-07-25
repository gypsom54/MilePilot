"use client";

import { PipelineEmployeeRow } from "@/components/mission-mode/PipelineEmployeeRow";
import type { PipelineEmployee } from "@/types/mission-mode";

interface MissionPipelineProps {
  employees: PipelineEmployee[];
  missionProgress: number;
}

export function MissionPipeline({ employees, missionProgress }: MissionPipelineProps) {
  return (
    <aside className="flex h-full flex-col border-r border-[var(--mm-border)] bg-[var(--mm-surface)] backdrop-blur-xl">
      <div className="border-b border-[var(--mm-border)] px-5 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--mm-text-muted)]">
          Mission Pipeline
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-[var(--mm-text-secondary)]">
            <span>Mission progress</span>
            <span className="font-mono font-medium text-[var(--mm-aura)]">{missionProgress}%</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="mission-mode-progress h-full rounded-full bg-gradient-to-r from-[var(--mm-aura)] to-[var(--mm-emerald)] transition-all duration-1000"
              style={{ width: `${missionProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 mission-mode-scroll">
        {employees.map((employee, index) => (
          <PipelineEmployeeRow key={employee.id} employee={employee} index={index} />
        ))}
      </div>
    </aside>
  );
}
