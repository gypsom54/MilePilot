"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createInitialMissionModeState,
  tickMissionModeEngine,
} from "@/services/mission-mode/missionModeEngine";
import type { MissionModeState } from "@/types/mission-mode";

const TICK_INTERVAL_MS = 3200;

export function useMissionModeEngine(enabled = true) {
  const [state, setState] = useState<MissionModeState>(createInitialMissionModeState);

  const tick = useCallback(() => {
    setState((prev) => tickMissionModeEngine(prev));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const interval = window.setInterval(tick, TICK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [enabled, tick]);

  return state;
}
