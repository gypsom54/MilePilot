import { useState, type FormEvent } from "react";
import "./AskComposer.css";

type AskComposerProps = {
  onSubmit: (question: string) => void;
};

export function AskComposer({ onSubmit }: AskComposerProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form className="ask-composer" onSubmit={handleSubmit} aria-label="Ask a question">
      <label className="ask-composer__label" htmlFor="ask-question-input">
        Your question
      </label>
      <div className="ask-composer__row">
        <input
          id="ask-question-input"
          className="ask-composer__input"
          type="text"
          name="question"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask about your website, opportunities or business"
          autoComplete="off"
        />
        <button className="ask-composer__submit" type="submit">
          Ask
        </button>
      </div>
    </form>
  );
}
