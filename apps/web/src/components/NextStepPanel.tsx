import { Link } from "react-router-dom";
import "./NextStepPanel.css";

type NextStepPanelProps = {
  label: string;
  href: string;
};

export function NextStepPanel({ label, href }: NextStepPanelProps) {
  const isInternal = href.startsWith("/");

  return (
    <aside className="next-step-panel" aria-label="Suggested next step">
      <p className="next-step-panel__label">You might also find this helpful</p>
      {isInternal ? (
        <Link className="next-step-panel__link" to={href}>
          {label}
        </Link>
      ) : (
        <a className="next-step-panel__link" href={href}>
          {label}
        </a>
      )}
    </aside>
  );
}
