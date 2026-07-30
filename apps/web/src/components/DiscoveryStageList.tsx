import { stageStatusLabel, type DiscoveryStageDefinition, type DiscoveryStageStatus } from "../content/discovery";
import "./DiscoveryStageList.css";

type DiscoveryStageListProps = {
  stages: DiscoveryStageDefinition[];
  statuses: Record<string, DiscoveryStageStatus>;
};

export function DiscoveryStageList({ stages, statuses }: DiscoveryStageListProps) {
  return (
    <ol className="discovery-stages" aria-label="Discovery progress">
      {stages.map((stage, index) => {
        const status = statuses[stage.id] ?? "waiting";
        return (
          <li
            key={stage.id}
            className={`discovery-stage discovery-stage--${status}`}
            aria-current={status === "in_progress" ? "step" : undefined}
          >
            <div className="discovery-stage__index" aria-hidden="true">
              {status === "done" ? "✓" : index + 1}
            </div>
            <div className="discovery-stage__body">
              <div className="discovery-stage__header">
                <h2 className="discovery-stage__title">{stage.title}</h2>
                <span className="discovery-stage__status">{stageStatusLabel(status)}</span>
              </div>
              <p className="discovery-stage__explanation">{stage.explanation}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
