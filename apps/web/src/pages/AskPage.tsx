import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { AskComposer } from "../components/AskComposer";
import { ConversationThread } from "../components/ConversationThread";
import { PageContainer } from "../components/PageContainer";
import { PageIntro } from "../components/PageIntro";
import { PlainLanguageNote } from "../components/PlainLanguageNote";
import { SuggestedQuestions } from "../components/SuggestedQuestions";
import { useAsk } from "../ask/AskContext";
import type { AskSuggestedQuestion } from "../content/ask";
import "./AskPage.css";

export function AskPage() {
  const { suggestedQuestions, turns, askQuestion, clearConversation } = useAsk();
  const [searchParams] = useSearchParams();
  const suggestedFromPlan = searchParams.get("q")?.trim() ?? "";
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (turns.length === 0) {
      return;
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [turns.length]);

  const handleSuggested = (question: AskSuggestedQuestion) => {
    askQuestion(question.label, question.intentId);
  };

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Business assistant"
        title="Ask SEO AutoPilot"
        description={
          <p>
            Ask questions about your website, your opportunities or your business. We’ll
            explain everything in plain English.
          </p>
        }
      />

      <PlainLanguageNote>
        <p>
          These answers use your mock business profile and discovery summary for this
          session. They are not live AI replies and are not saved after you leave.
        </p>
      </PlainLanguageNote>

      <SuggestedQuestions questions={suggestedQuestions} onSelect={handleSuggested} />

      <AskComposer
        key={suggestedFromPlan || "ask-composer"}
        initialValue={suggestedFromPlan}
        onSubmit={(question) => askQuestion(question)}
      />

      <div className="ask-page__history-header">
        <h2 className="ask-page__history-title">Conversation</h2>
        {turns.length > 0 ? (
          <button type="button" className="ask-page__clear" onClick={clearConversation}>
            Clear this visit
          </button>
        ) : null}
      </div>

      <div aria-live="polite">
        <ConversationThread turns={turns} />
      </div>
      <div ref={endRef} />
    </PageContainer>
  );
}
