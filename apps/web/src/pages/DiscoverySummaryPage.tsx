import { Link, Navigate } from "react-router-dom";
import { DiscoverySummarySection } from "../components/DiscoverySummarySection";
import { PageContainer } from "../components/PageContainer";
import { PageIntro } from "../components/PageIntro";
import { PlainLanguageNote } from "../components/PlainLanguageNote";
import { RecommendationList } from "../components/RecommendationList";
import { useDiscovery } from "../discovery/DiscoveryContext";
import "./DiscoverySummaryPage.css";

export function DiscoverySummaryPage() {
  const { runStatus, summary, profile } = useDiscovery();

  if (runStatus !== "complete" || !summary) {
    return <Navigate to="/discover" replace />;
  }

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Discovery summary"
        title="A calm first look at where to focus."
        description={
          <p>
            Here is what SEO AutoPilot noticed for {profile.businessName}. This is
            guidance to help you decide — not a score and not a long list of problems.
          </p>
        }
      />

      <PlainLanguageNote>
        <p>
          These notes use placeholder discovery findings until live website analysis is
          connected. The shape of this summary will stay the same when real results arrive.
        </p>
      </PlainLanguageNote>

      <DiscoverySummarySection
        title="What you're doing well"
        description="Strengths worth protecting while you grow."
      >
        {summary.strengths.map((item) => (
          <article key={item.id} className="discovery-summary-item">
            <h3 className="discovery-summary-item__title">{item.title}</h3>
            <p className="discovery-summary-item__text">{item.explanation}</p>
          </article>
        ))}
      </DiscoverySummarySection>

      <DiscoverySummarySection
        title="Biggest opportunities"
        description="A short view of where clearer pages or trust could help more customers choose you."
      >
        {summary.opportunities.map((item) => (
          <article key={item.id} className="discovery-summary-item">
            <h3 className="discovery-summary-item__title">{item.title}</h3>
            <p className="discovery-summary-item__text">{item.explanation}</p>
          </article>
        ))}
      </DiscoverySummarySection>

      <DiscoverySummarySection
        title="Recommended first steps"
        description="No more than three priorities. Start with one if that feels calmer."
      >
        <RecommendationList recommendations={summary.recommendations} />
      </DiscoverySummarySection>

      <div className="discovery-summary__actions">
        <Link className="discovery-summary__cta" to="/workspace">
          Open your workspace
        </Link>
        <Link className="discovery-summary__secondary" to="/learn">
          Continue learning
        </Link>
      </div>
    </PageContainer>
  );
}
