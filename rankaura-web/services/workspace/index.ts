import type { WorkspaceData, WorkspaceDataProvider } from "@/types/workspace";
import { mockWorkspaceProvider } from "@/services/workspace/mockWorkspace";

let activeProvider: WorkspaceDataProvider = mockWorkspaceProvider;

export function setWorkspaceDataProvider(provider: WorkspaceDataProvider): void {
  activeProvider = provider;
}

export async function getWorkspaceData(): Promise<WorkspaceData> {
  return activeProvider.getWorkspaceData();
}

export { mockWorkspaceData, mockWorkspaceProvider } from "@/services/workspace/mockWorkspace";
export { personalizeWorkspace } from "@/services/workspace/personalizeWorkspace";
