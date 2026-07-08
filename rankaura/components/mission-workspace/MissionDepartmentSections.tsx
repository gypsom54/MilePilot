import { DepartmentCard } from "@/components/mission-workspace/DepartmentCard";
import { FindingCard } from "@/components/mission-workspace/FindingCard";
import type { ArchitectReview, GuardianReview, ScoutReport, WriterDraft } from "@/types/mission";

export function ScoutSection({ report, delay = 80 }: { report: ScoutReport; delay?: number }) {
  return (
    <DepartmentCard
      departmentId="scout"
      departmentName="Scout"
      title="Research findings"
      subtitle={report.marketOpportunity}
      confidence={report.confidence}
      delay={delay}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <FindingCard label="Customer demand" value={`${report.monthlySearches} searches/mo`} detail={report.customerIntent} />
        <FindingCard label="Competition" value={report.competitionLabel} detail="Market gap identified" />
        <FindingCard label="Intent" value={report.intentLabel} detail={`Angle: ${report.suggestedAngle}`} />
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <FindingCard
          label="Competitor insight"
          value="3 gaps found"
          detail={report.competitorObservations[0]}
        />
        <FindingCard
          label="Top customer question"
          value="Storage conditions"
          detail={report.customerQuestions[0]}
        />
      </div>
    </DepartmentCard>
  );
}

export function WriterSection({ draft, delay = 120 }: { draft: WriterDraft; delay?: number }) {
  return (
    <DepartmentCard
      departmentId="writer"
      departmentName="Writer"
      title="Draft content"
      subtitle="Prepared in plain English for your customers"
      delay={delay}
    >
      <article className="mx-auto max-w-2xl">
        <h3 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text-primary)]">
          {draft.title}
        </h3>
        <p className="mt-8 text-base leading-[1.8] text-[var(--color-text-secondary)]">
          {draft.introduction}
        </p>
        {draft.sections.map((section) => (
          <div key={section.heading} className="mt-12">
            <h4 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
              {section.heading}
            </h4>
            <p className="mt-4 text-base leading-[1.8] text-[var(--color-text-secondary)]">
              {section.body}
            </p>
          </div>
        ))}
        <p className="mt-14 text-center text-sm font-semibold text-[var(--color-midnight)]">
          {draft.callToAction}
        </p>
      </article>
    </DepartmentCard>
  );
}

export function ArchitectSection({ review, delay = 160 }: { review: ArchitectReview; delay?: number }) {
  return (
    <DepartmentCard
      departmentId="architect"
      departmentName="Architect"
      title="Information architecture"
      subtitle="Structure and discoverability recommendations"
      confidence={review.structureScore}
      delay={delay}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <FindingCard
          label="Page structure"
          value={`${review.pageStructure.length} sections`}
          detail={review.pageStructure.join(" → ")}
        />
        <FindingCard
          label="Internal linking"
          value={`${review.internalLinks.length} links`}
          detail={review.internalLinks.join(", ")}
        />
      </div>
      <div className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          Structure recommendations
        </p>
        <ul className="mt-4 space-y-3">
          {review.checklist.map((item) => (
            <li key={item.id} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-emerald)]">{item.passed ? "✓" : "–"}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </DepartmentCard>
  );
}

export function GuardianSection({ review, delay = 200 }: { review: GuardianReview; delay?: number }) {
  return (
    <DepartmentCard
      departmentId="guardian"
      departmentName="Guardian"
      title="Quality assurance"
      subtitle="Compliance, brand voice, and readability"
      confidence={review.score}
      delay={delay}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {review.checks.map((check) => (
          <div
            key={check.id}
            className="flex items-center gap-3 rounded-xl bg-[var(--color-background)] px-5 py-4"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-emerald-muted)] text-sm font-bold text-emerald-700">
              ✓
            </span>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">{check.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        Quality score:{" "}
        <span className="text-lg font-semibold text-[var(--color-text-primary)]">
          {review.scoreLabel}
        </span>
      </p>
    </DepartmentCard>
  );
}
