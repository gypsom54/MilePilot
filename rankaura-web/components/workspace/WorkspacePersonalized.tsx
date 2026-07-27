"use client";

import { useEffect, useMemo, useState } from "react";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { loadOnboardingSession } from "@/services/onboarding/session";
import { personalizeWorkspace } from "@/services/workspace/personalizeWorkspace";
import type { WorkspaceData } from "@/types/workspace";
import type { OnboardingSession } from "@/types/onboarding";

interface WorkspacePersonalizedProps {
  data: WorkspaceData;
}

export function WorkspacePersonalized({ data }: WorkspacePersonalizedProps) {
  const [session, setSession] = useState<OnboardingSession | null>(null);

  useEffect(() => {
    setSession(loadOnboardingSession());
  }, []);

  const personalized = useMemo(
    () => personalizeWorkspace(data, session),
    [data, session],
  );

  return <WorkspacePage data={personalized} />;
}
