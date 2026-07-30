import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DISCOVERY_STAGES,
  MOCK_BUSINESS_PROFILE,
  MOCK_DISCOVERY_SUMMARY,
  type DiscoveryStageId,
  type DiscoveryStageStatus,
  type DiscoverySummary,
  type MockBusinessProfile,
} from "../content/discovery";

export type DiscoveryRunStatus = "idle" | "running" | "complete";

type StageStatusMap = Record<DiscoveryStageId, DiscoveryStageStatus>;

type DiscoveryContextValue = {
  runStatus: DiscoveryRunStatus;
  stageStatuses: StageStatusMap;
  profile: MockBusinessProfile;
  summary: DiscoverySummary | null;
  startDiscovery: () => void;
  markStage: (id: DiscoveryStageId, status: DiscoveryStageStatus) => void;
  completeDiscovery: () => void;
  resetDiscovery: () => void;
  allStagesDone: boolean;
};

const initialStageStatuses = (): StageStatusMap =>
  Object.fromEntries(
    DISCOVERY_STAGES.map((stage) => [stage.id, "waiting" as DiscoveryStageStatus]),
  ) as StageStatusMap;

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null);

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [runStatus, setRunStatus] = useState<DiscoveryRunStatus>("idle");
  const [stageStatuses, setStageStatuses] = useState<StageStatusMap>(initialStageStatuses);
  const [summary, setSummary] = useState<DiscoverySummary | null>(null);

  const markStage = useCallback((id: DiscoveryStageId, status: DiscoveryStageStatus) => {
    setStageStatuses((current) => ({ ...current, [id]: status }));
  }, []);

  const startDiscovery = useCallback(() => {
    setRunStatus("running");
    setSummary(null);
    setStageStatuses(initialStageStatuses());
  }, []);

  const completeDiscovery = useCallback(() => {
    setStageStatuses(
      Object.fromEntries(
        DISCOVERY_STAGES.map((stage) => [stage.id, "done" as DiscoveryStageStatus]),
      ) as StageStatusMap,
    );
    setSummary(MOCK_DISCOVERY_SUMMARY);
    setRunStatus("complete");
  }, []);

  const resetDiscovery = useCallback(() => {
    setRunStatus("idle");
    setSummary(null);
    setStageStatuses(initialStageStatuses());
  }, []);

  const allStagesDone = DISCOVERY_STAGES.every(
    (stage) => stageStatuses[stage.id] === "done",
  );

  const value = useMemo<DiscoveryContextValue>(
    () => ({
      runStatus,
      stageStatuses,
      profile: MOCK_BUSINESS_PROFILE,
      summary,
      startDiscovery,
      markStage,
      completeDiscovery,
      resetDiscovery,
      allStagesDone,
    }),
    [
      runStatus,
      stageStatuses,
      summary,
      startDiscovery,
      markStage,
      completeDiscovery,
      resetDiscovery,
      allStagesDone,
    ],
  );

  return (
    <DiscoveryContext.Provider value={value}>{children}</DiscoveryContext.Provider>
  );
}

export function useDiscovery(): DiscoveryContextValue {
  const value = useContext(DiscoveryContext);
  if (!value) {
    throw new Error("useDiscovery must be used within DiscoveryProvider");
  }
  return value;
}
