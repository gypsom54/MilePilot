import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DiscoveryStageList } from "../components/DiscoveryStageList";
import { PageContainer } from "../components/PageContainer";
import { PageIntro } from "../components/PageIntro";
import { PlainLanguageNote } from "../components/PlainLanguageNote";
import { DISCOVERY_STAGES } from "../content/discovery";
import { useDiscovery } from "../discovery/DiscoveryContext";
import "./AnalysisProgressPage.css";

/** Calm pause between discrete stages — not a percentage and not a spinner. */
const STAGE_PAUSE_MS = 1400;

export function AnalysisProgressPage() {
  const navigate = useNavigate();
  const {
    runStatus,
    stageStatuses,
    startDiscovery,
    markStage,
    completeDiscovery,
    allStagesDone,
  } = useDiscovery();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    if (runStatus === "complete") {
      return;
    }
    startedRef.current = true;
    startDiscovery();
  }, [startDiscovery, runStatus]);

  useEffect(() => {
    if (runStatus !== "running") {
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const run = async () => {
      for (const stage of DISCOVERY_STAGES) {
        if (cancelled) {
          return;
        }
        markStage(stage.id, "waiting");
      }
      for (const stage of DISCOVERY_STAGES) {
        if (cancelled) {
          return;
        }
        markStage(stage.id, "in_progress");
        await new Promise<void>((resolve) => {
          timer = window.setTimeout(resolve, STAGE_PAUSE_MS);
        });
        if (cancelled) {
          return;
        }
        markStage(stage.id, "done");
      }
      if (!cancelled) {
        completeDiscovery();
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [runStatus, markStage, completeDiscovery]);

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Website discovery"
        title="Learning about your business online."
        description={
          <p>
            SEO AutoPilot is reviewing a few important areas so your first workspace
            starts with clarity — not a long technical report.
          </p>
        }
      />

      <PlainLanguageNote>
        <p>
          This is a calm checklist, not a score. Each step finishes when that part of
          the review is ready. There are no percentages and no rush.
        </p>
      </PlainLanguageNote>

      <DiscoveryStageList stages={DISCOVERY_STAGES} statuses={stageStatuses} />

      <div className="analysis-progress__actions">
        {allStagesDone || runStatus === "complete" ? (
          <button
            type="button"
            className="analysis-progress__cta"
            onClick={() => navigate("/discover/summary")}
          >
            See your discovery summary
          </button>
        ) : (
          <p className="analysis-progress__waiting">
            Working through each step carefully. You can stay on this page — nothing
            needs your action yet.
          </p>
        )}
        <Link className="analysis-progress__secondary" to="/learn">
          Or browse the Learning Centre while you wait
        </Link>
      </div>
    </PageContainer>
  );
}
