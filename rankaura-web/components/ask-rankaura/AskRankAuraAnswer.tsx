"use client";

import { useEffect, useRef } from "react";
import { AskRankAuraActionButton } from "@/components/ask-rankaura/AskRankAuraAction";
import { AskRankAuraAnswerSectionView } from "@/components/ask-rankaura/AskRankAuraAnswerSection";
import { AskRankAuraSourceNotice } from "@/components/ask-rankaura/AskRankAuraSourceNotice";
import { OnboardingPrimaryButton } from "@/components/onboarding/OnboardingFields";
import type { AskRankAuraAnswer } from "@/types/askRankAura";

interface AskRankAuraAnswerProps {
  answer: AskRankAuraAnswer;
  onAskAnother: () => void;
}

export function AskRankAuraAnswerPanel({
  answer,
  onAskAnother,
}: AskRankAuraAnswerProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [answer.questionId, answer.questionText]);

  const contentSections = answer.sections.filter(
    (section) => section.kind !== "direct",
  );

  return (
    <div className="mt-5" aria-live="polite">
      <p className="text-sm font-medium text-[#8b95a5]">You asked</p>
      <h3
        ref={headingRef}
        tabIndex={-1}
        id="ask-rankaura-answer-heading"
        className="mt-1 text-xl font-semibold tracking-tight text-[#080f1a]"
      >
        {answer.questionText}
      </h3>

      <p className="mt-4 text-base font-normal leading-relaxed text-[#8b95a5]">
        {answer.directAnswer}
      </p>

      {contentSections.length > 0 ? (
        <div className="mt-5 space-y-4">
          {contentSections.map((section) => (
            <AskRankAuraAnswerSectionView
              key={`${section.kind}-${section.title}`}
              section={section}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-5">
        <AskRankAuraSourceNotice
          sources={answer.sources}
          availabilityNotice={answer.availabilityNotice}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {answer.action ? (
          <AskRankAuraActionButton action={answer.action} />
        ) : null}
        <OnboardingPrimaryButton onClick={onAskAnother}>
          Ask another question
        </OnboardingPrimaryButton>
      </div>
    </div>
  );
}
