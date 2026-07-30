import { Link } from "react-router-dom";
import type { AskStructuredAnswer } from "../content/ask";
import "./AskAnswerCard.css";

type AskAnswerCardProps = {
  answer: AskStructuredAnswer;
};

export function AskAnswerCard({ answer }: AskAnswerCardProps) {
  return (
    <div className="ask-answer-card">
      <section className="ask-answer-card__block">
        <h3 className="ask-answer-card__label">Answer</h3>
        <p>{answer.answer}</p>
      </section>

      <section className="ask-answer-card__block">
        <h3 className="ask-answer-card__label">Why this matters</h3>
        <p>{answer.whyItMatters}</p>
      </section>

      <section className="ask-answer-card__block">
        <h3 className="ask-answer-card__label">Recommended next step</h3>
        <p>
          <Link to={answer.recommendedNextStep.href}>
            {answer.recommendedNextStep.label}
          </Link>
        </p>
      </section>

      <section className="ask-answer-card__block">
        <h3 className="ask-answer-card__label">Learn more</h3>
        <p>
          <Link to={answer.learnMore.href}>{answer.learnMore.label}</Link>
        </p>
      </section>
    </div>
  );
}
