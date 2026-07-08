"use client";

import { cn } from "@/utils/cn";
import type { PipelineEmployee } from "@/types/mission-mode";

interface PipelineEmployeeRowProps {
  employee: PipelineEmployee;
  index: number;
}

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  const filled = Math.round(progress / 10);
  const empty = 10 - filled;
  return (
    <div className="mt-3 font-mono text-[11px] tracking-wider text-[var(--mm-text-muted)]">
      <span style={{ color }}>{"█".repeat(filled)}</span>
      <span className="opacity-30">{"░".repeat(empty)}</span>
    </div>
  );
}

export function PipelineEmployeeRow({ employee, index }: PipelineEmployeeRowProps) {
  const isComplete = employee.status === "complete";
  const isWaiting = employee.status === "waiting";
  const isWorking = employee.status === "working";

  return (
    <div
      className="mission-mode-panel-enter group rounded-xl px-4 py-4 transition-all duration-500 hover:bg-white/[0.03]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            isComplete && "bg-[var(--mm-emerald)] mission-mode-pulse",
            isWorking && "mission-mode-pulse",
            isWaiting && "opacity-40",
          )}
          style={{ backgroundColor: isComplete || isWorking ? employee.color : undefined }}
        />
        <span className="text-sm font-semibold text-[var(--mm-text)]">{employee.name}</span>
        {isComplete && (
          <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-[var(--mm-emerald)]">
            Done
          </span>
        )}
      </div>

      <p
        className={cn(
          "mt-2 text-xs leading-relaxed transition-opacity duration-500",
          isWaiting ? "text-[var(--mm-text-muted)]" : "text-[var(--mm-text-secondary)]",
        )}
      >
        {employee.activity}
      </p>

      {!isWaiting && <ProgressBar progress={employee.progress} color={employee.color} />}

      {employee.detail && (
        <p className="mt-2 text-[11px] text-[var(--mm-text-muted)]">{employee.detail}</p>
      )}
    </div>
  );
}
