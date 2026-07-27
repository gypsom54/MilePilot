import { WorkspacePersonalized } from "@/components/workspace/WorkspacePersonalized";
import { getAskRankAuraData } from "@/services/askRankAura";
import { getWorkspaceData } from "@/services/workspace";

/**
 * Phase 4 Workspace + Phase B Ask RankAura prototype.
 * Route: /workspace
 */
export default async function WorkspaceRoute() {
  const [data, askData] = await Promise.all([
    getWorkspaceData(),
    getAskRankAuraData(),
  ]);
  return <WorkspacePersonalized data={data} askData={askData} />;
}
