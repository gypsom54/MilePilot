"use client";

import { mockMissionDocument } from "@/lib/mock-mission-mode";
import type { Mission } from "@/types/mission";

interface MissionDocumentProps {
  mission: Mission;
}

export function MissionDocument({ mission }: MissionDocumentProps) {
  const doc = mockMissionDocument;

  return (
    <div className="mission-mode-doc-enter flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--mm-border)] px-6 py-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--mm-text-muted)]">
            Mission Document
          </p>
          <p className="mt-1 text-sm text-[var(--mm-text-secondary)]">
            {mission.confidence}% confidence · {mission.reviewTimeMinutes} min review
          </p>
        </div>
        <span className="rounded-full border border-[var(--mm-border)] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--mm-text-muted)]">
          Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 mission-mode-scroll">
        <article className="mission-mode-document mx-auto max-w-2xl rounded-2xl bg-[#fafbfc] px-10 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-14 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8b95a5]">
            Research Library
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#080f1a] sm:text-4xl sm:leading-tight">
            {doc.title}
          </h1>
          <p className="mt-3 text-sm text-[#4a5568]">{doc.subtitle}</p>

          <div className="mt-14 space-y-14">
            {doc.sections.map((section, index) => (
              <section
                key={section.id}
                className="mission-mode-section-enter scroll-mt-8"
                style={{ animationDelay: `${200 + index * 100}ms` }}
                id={section.id}
              >
                <h2 className="text-xl font-semibold tracking-tight text-[#080f1a]">
                  {section.title}
                </h2>
                <p className="mt-4 text-base leading-[1.8] text-[#4a5568]">{section.content}</p>
                {section.items && (
                  <ul className="mt-5 space-y-2.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-[#4a5568]"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#2f6fed]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-[#eaedf3] pt-10">
            <button
              type="button"
              className="mission-mode-cta rounded-xl bg-[#080f1a] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              Request documentation
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
