import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ASK_SUGGESTED_QUESTIONS,
  type AskIntentId,
  type AskSuggestedQuestion,
  type AskTurn,
} from "../content/ask";
import {
  MOCK_BUSINESS_PROFILE,
  MOCK_DISCOVERY_SUMMARY,
} from "../content/discovery";
import { matchAskIntent, resolveMockAskAnswer } from "./mockAskResponder";

type AskContextValue = {
  suggestedQuestions: AskSuggestedQuestion[];
  turns: AskTurn[];
  askQuestion: (question: string, intentId?: AskIntentId) => void;
  clearConversation: () => void;
};

const AskContext = createContext<AskContextValue | null>(null);

function createTurnId(): string {
  return `ask-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AskProvider({ children }: { children: ReactNode }) {
  const [turns, setTurns] = useState<AskTurn[]>([]);

  const askQuestion = useCallback((question: string, intentId?: AskIntentId) => {
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }

    const resolvedIntent = intentId ?? matchAskIntent(trimmed);
    const response = resolveMockAskAnswer(resolvedIntent, {
      profile: MOCK_BUSINESS_PROFILE,
      summary: MOCK_DISCOVERY_SUMMARY,
    });

    setTurns((current) => [
      ...current,
      {
        id: createTurnId(),
        question: trimmed,
        intentId: resolvedIntent,
        response,
      },
    ]);
  }, []);

  const clearConversation = useCallback(() => {
    setTurns([]);
  }, []);

  const value = useMemo<AskContextValue>(
    () => ({
      suggestedQuestions: ASK_SUGGESTED_QUESTIONS,
      turns,
      askQuestion,
      clearConversation,
    }),
    [turns, askQuestion, clearConversation],
  );

  return <AskContext.Provider value={value}>{children}</AskContext.Provider>;
}

export function useAsk(): AskContextValue {
  const value = useContext(AskContext);
  if (!value) {
    throw new Error("useAsk must be used within AskProvider");
  }
  return value;
}
