import { Link } from "react-router-dom";
import { ContextualLearning } from "../components/ContextualLearning";
import { DailyBriefingHero } from "../components/DailyBriefingHero";
import { PageContainer } from "../components/PageContainer";
import { PlainLanguageNote } from "../components/PlainLanguageNote";
import { RecentProgress } from "../components/RecentProgress";
import { TodaysPriorityCard } from "../components/TodaysPriorityCard";
import { WorkspaceSection } from "../components/WorkspaceSection";
import { useDiscovery } from "../discovery/DiscoveryContext";
import { useDailyBriefing } from "../discovery/useDailyBriefing";
import "./WorkspacePage.css";

const SECTION_LINKS = [
  { href: "#business", label: "Your Business" },
  { href: "#website", label: "Your Website" },
  { href: "#opportunities", label: "Your Opportunities" },
  { href: "#learn", label: "Learn" },
] as const;

export function WorkspacePage() {
  const { profile, summary, runStatus } = useDiscovery();
  const briefing = useDailyBriefing();
  const hasSummary = runStatus === "complete" && summary !== null;
  const recommendations = summary?.recommendations.slice(0, 3) ?? [];

  return (
    <PageContainer>
      <DailyBriefingHero
        greeting={briefing.greeting}
        statusLines={briefing.statusLines}
      />

      <TodaysPriorityCard
        priority={briefing.priority}
        allClearMessage={briefing.allClearMessage}
      />

      <RecentProgress events={briefing.recentProgress} />

      {briefing.contextualGuide ? (
        <ContextualLearning guide={briefing.contextualGuide} />
      ) : null}

      <nav className="workspace-nav" aria-label="Workspace sections">
        {SECTION_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      {!hasSummary ? (
        <PlainLanguageNote>
          <p>
            Website discovery has not been completed in this session yet. You can{" "}
            <Link to="/discover">start discovery</Link> to prepare your first summary,
            or explore the Learning Centre anytime.
          </p>
        </PlainLanguageNote>
      ) : (
        <PlainLanguageNote>
          <p>
            Business details below use placeholder discovery data until live onboarding
            and website analysis are connected. The workspace layout is ready for those
            results.
          </p>
        </PlainLanguageNote>
      )}

      <WorkspaceSection
        id="business"
        title="Your Business"
        description="Who you are and who you help — kept in plain English."
      >
        <div className="workspace-fact">
          <p className="workspace-fact__label">Business name</p>
          <p className="workspace-fact__value">{profile.businessName}</p>
        </div>
        <div className="workspace-fact">
          <p className="workspace-fact__label">What you offer</p>
          <p className="workspace-fact__value">{profile.offering}</p>
        </div>
        <div className="workspace-fact">
          <p className="workspace-fact__label">Where you serve</p>
          <p className="workspace-fact__value">{profile.location}</p>
        </div>
      </WorkspaceSection>

      <WorkspaceSection
        id="website"
        title="Your Website"
        description="A simple record of the site discovery is learning from."
      >
        <div className="workspace-fact">
          <p className="workspace-fact__label">Website</p>
          <p className="workspace-fact__value">{profile.websiteUrl}</p>
        </div>
        <div className="workspace-fact">
          <p className="workspace-fact__label">Discovery status</p>
          <p className="workspace-fact__value">
            {hasSummary
              ? "First discovery summary is ready"
              : "Waiting for website discovery"}
          </p>
        </div>
        {!hasSummary ? (
          <p className="workspace-page__action">
            <Link to="/discover">Start website discovery</Link>
          </p>
        ) : (
          <p className="workspace-page__action">
            <Link to="/discover/summary">Review discovery summary</Link>
          </p>
        )}
      </WorkspaceSection>

      <WorkspaceSection
        id="opportunities"
        title="Your Opportunities"
        description="A short list of calm first steps — never an overwhelming issue dump."
      >
        {recommendations.length > 0 ? (
          <ul className="workspace-opportunity-list">
            {recommendations.map((item) => (
              <li key={item.id} className="workspace-fact">
                <p className="workspace-fact__value">{item.title}</p>
                <p className="workspace-page__muted">{item.explanation}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="workspace-page__muted">
            Opportunities will appear here after discovery prepares your first three
            priorities.
          </p>
        )}
      </WorkspaceSection>

      <WorkspaceSection
        id="learn"
        title="Learn"
        description="Plain-English answers whenever you want more context."
      >
        <p className="workspace-page__muted">
          The Learning Centre stays available beside your workspace so growth guidance
          never depends on jargon.
        </p>
        <p className="workspace-page__action">
          <Link to="/learn">Open the Learning Centre</Link>
        </p>
        <p className="workspace-page__action">
          <Link to="/learn/what-will-seo-autopilot-do-for-my-business">
            What will SEO AutoPilot do for my business?
          </Link>
        </p>
      </WorkspaceSection>
    </PageContainer>
  );
}
