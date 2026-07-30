import { Link } from "react-router-dom";
import type { ContextualGuide } from "../content/briefing";
import "./ContextualLearning.css";

type ContextualLearningProps = {
  guide: ContextualGuide;
};

export function ContextualLearning({ guide }: ContextualLearningProps) {
  return (
    <aside className="contextual-learning" aria-labelledby="contextual-learning-heading">
      <p className="contextual-learning__eyebrow">Recommended for you</p>
      <h2 className="contextual-learning__title" id="contextual-learning-heading">
        {guide.title}
      </h2>
      <p className="contextual-learning__reason">{guide.reason}</p>
      <p className="contextual-learning__explanation">{guide.explanation}</p>
      <Link className="contextual-learning__link" to={guide.href}>
        Read this short guide
      </Link>
    </aside>
  );
}
