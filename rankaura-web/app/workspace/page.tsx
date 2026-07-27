import { WorkspacePersonalized } from "@/components/workspace/WorkspacePersonalized";
import { getWorkspaceData } from "@/services/workspace";

/**
 * Phase 4 Workspace prototype — static mock data only.
 * Route: /workspace
 */
export default async function WorkspaceRoute() {
  const data = await getWorkspaceData();
  return <WorkspacePersonalized data={data} />;
}
