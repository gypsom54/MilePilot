import type { AskSuggestedQuestion } from "../content/ask";
import "./SuggestedQuestions.css";

type SuggestedQuestionsProps = {
  questions: AskSuggestedQuestion[];
  onSelect: (question: AskSuggestedQuestion) => void;
};

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <section className="suggested-questions" aria-labelledby="suggested-questions-heading">
      <h2 id="suggested-questions-heading">Suggested questions</h2>
      <p className="suggested-questions__intro">
        Choose a question to get a clear answer based on what we already know about your
        business.
      </p>
      <ul className="suggested-questions__list">
        {questions.map((question) => (
          <li key={question.id}>
            <button
              type="button"
              className="suggested-questions__button"
              onClick={() => onSelect(question)}
            >
              {question.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
