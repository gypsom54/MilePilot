import { PRIORITY_BAND_LABELS, type PriorityBand } from "../content/opportunities";
import "./PrioritisationLegend.css";

const BAND_ORDER: PriorityBand[] = [
  "high-impact-low-effort",
  "high-impact-medium-effort",
  "medium-impact-low-effort",
  "low-impact-high-effort",
];

export function PrioritisationLegend() {
  return (
    <aside className="prioritisation-legend" aria-labelledby="priority-legend-heading">
      <h2 id="priority-legend-heading">How we prioritise</h2>
      <p>
        Opportunities are ordered by business value — impact first, then effort. There
        are no scores or grades.
      </p>
      <ol className="prioritisation-legend__list">
        {BAND_ORDER.map((band) => (
          <li key={band}>{PRIORITY_BAND_LABELS[band]}</li>
        ))}
      </ol>
    </aside>
  );
}
