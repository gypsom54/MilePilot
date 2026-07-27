"use client";

import { useEffect, useRef } from "react";
import { AskRankAuraActionButton } from "@/components/ask-rankaura/AskRankAuraAction";
import { AskRankAuraAnswerSectionView } from "@/components/ask-rankaura/AskRankAuraAnswerSection";
import { AskRankAuraSourceNotice } from "@/components/ask-rankaura/AskRankAuraSourceNotice";
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
    <div
      className="mt-5 border-t border-[#e8ecf1] pt-5"
      aria-live="polite"
    >
      <p className="text-xs font-medium text-[#8b95a5]">You asked</p>
      <h3
        ref={headingRef}
        tabIndex={-1}
        id="ask-rankaura-answer-heading"
        className="mt-1 text-base font-semibold text-[#080f1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
      >
        {answer.questionText}
      </h3>

      <p className="mt-4 text-base leading-relaxed text-[#080f1a] sm:text-lg">
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

      {answer.availabilityNotice ||
      answer.sources.some(
        (source) =>
          source.availability === "unavailable" ||
          source.availability === "incomplete",
      ) ? (
        <div className="mt-5">
          <AskRankAuraSourceNotice
            sources={answer.sources}
            availabilityNotice={answer.availabilityNotice}
          />
        </div>
      ) : (
        <div className="mt-5">
          <AskRankAuraSourceNotice sources={answer.sources} />
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {answer.action ? (
          <AskRankAuraActionButton action={answer.action} />
        ) : null}
        <button
          type="button"
          onClick={onAskAnother}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#080f1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
        >
          Ask another question
        </button>
      </div>
    </div>
  );
}
