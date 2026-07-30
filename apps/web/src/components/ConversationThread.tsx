import type { AskTurn } from "../content/ask";
import { AskAnswerCard } from "./AskAnswerCard";
import "./ConversationThread.css";

type ConversationThreadProps = {
  turns: AskTurn[];
};

export function ConversationThread({ turns }: ConversationThreadProps) {
  if (turns.length === 0) {
    return (
      <p className="conversation-thread__empty">
        Your questions and answers will appear here during this visit. Nothing is saved
        after you leave.
      </p>
    );
  }

  return (
    <ol className="conversation-thread" aria-label="Conversation">
      {turns.map((turn) => (
        <li key={turn.id} className="conversation-thread__turn">
          <h2 className="conversation-thread__question">{turn.question}</h2>
          <AskAnswerCard answer={turn.response} />
        </li>
      ))}
    </ol>
  );
}
