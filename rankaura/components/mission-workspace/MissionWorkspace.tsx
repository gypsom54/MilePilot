"use client";

import { useCallback, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  BusinessImpactPanel,
  DepartmentWorkflow,
  MissionActions,
  MissionHeader,
  MissionOverview,
  MissionPreviewPanel,
  TimelineCard,
} from "@/components/mission-workspace";
import { mockBusiness } from "@/lib/mock-dashboard";
import {
  approveMission as approveMissionService,
  requestChanges as requestChangesService,
  saveMission as saveMissionService,
} from "@/services/mission/missionService";
import type { Mission } from "@/types/mission";

interface MissionWorkspaceProps {
  initialMission: Mission;
}

/**
 * Mission Workspace — dedicated review experience for Growth Team output.
 * Client state syncs with mock missionService (in-memory store).
 */
export function MissionWorkspace({ initialMission }: MissionWorkspaceProps) {
  const [mission, setMission] = useState(initialMission);
  const [loading, setLoading] = useState(false);

  const handleApprove = useCallback(async () => {
    setLoading(true);
    const updated = await approveMissionService(mission.id);
    if (updated) setMission(updated);
    setLoading(false);
  }, [mission.id]);

  const handleRequestChanges = useCallback(
    async (comment: string) => {
      setLoading(true);
      const updated = await requestChangesService(mission.id, comment);
      if (updated) setMission(updated);
      setLoading(false);
    },
    [mission.id],
  );

  const handleSaveForLater = useCallback(async () => {
    setLoading(true);
    const updated = await saveMissionService(mission.id);
    if (updated) setMission(updated);
    setLoading(false);
  }, [mission.id]);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar business={mockBusiness} />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10 sm:px-10 sm:py-12">
          <MissionHeader mission={mission} />

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <MissionOverview mission={mission} />
              <DepartmentWorkflow departments={mission.departments} />
              <MissionPreviewPanel preview={mission.preview} />
            </div>

            <div className="space-y-8">
              <BusinessImpactPanel impact={mission.impact} />
              <MissionActions
                mission={mission}
                onApprove={handleApprove}
                onRequestChanges={handleRequestChanges}
                onSaveForLater={handleSaveForLater}
                loading={loading}
              />
              <TimelineCard events={mission.timeline} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
