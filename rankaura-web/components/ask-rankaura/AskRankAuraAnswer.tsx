"use client";

import { useEffect, useRef } from "react";
import { AskRankAuraActionButton } from "@/components/ask-rankaura/AskRankAuraAction";
import { AskRankAuraAnswerSectionView } from "@/components/ask-rankaura/AskRankAuraAnswerSection";
import { AskRankAuraSourceNotice } from "@/components/ask-rankaura/AskRankAuraSourceNotice";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
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
      <p className="text-xs font-medium text-ra-muted">You asked</p>
      <h3
        ref={headingRef}
        tabIndex={-1}
        id="ask-rankaura-answer-heading"
        className="mt-1 text-base font-semibold text-ra-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ra-focus"
      >
        {answer.questionText}
      </h3>

      <p className="mt-4 text-sm font-normal leading-relaxed text-ra-ink-soft sm:text-base">
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

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {answer.action ? (
          <AskRankAuraActionButton action={answer.action} />
        ) : null}
        <ButtonSecondary type="button" onClick={onAskAnother}>
          Ask another question
        </ButtonSecondary>
      </div>
    </div>
  );
}
