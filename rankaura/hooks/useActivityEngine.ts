"use client";

import { useEffect, useState } from "react";
import {
  createInitialActivityState,
  tickActivityEngine,
} from "@/services/activity/activityEngine";
import type { ActivityEngineState } from "@/types/activity";

const TICK_INTERVAL_MS = 4000;

export function useActivityEngine(enabled = true) {
  const [state, setState] = useState<ActivityEngineState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootTimer = window.setTimeout(() => {
      setState(createInitialActivityState());
      setIsReady(true);
    }, 350);

    return () => window.clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    if (!enabled || !isReady) return;

    const interval = window.setInterval(() => {
      setState((prev) => (prev ? tickActivityEngine(prev) : prev));
    }, TICK_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [enabled, isReady]);

  return { activity: state, isReady };
}
