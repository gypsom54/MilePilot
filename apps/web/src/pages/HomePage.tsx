import { Link } from "react-router-dom";
import { GrowthPillar } from "../components/GrowthPillar";
import { PageContainer } from "../components/PageContainer";
import "./HomePage.css";

const GROWTH_PILLARS = [
  {
    title: "Strong Foundations",
    explanation:
      "Make sure your website is easy to use, reliable and ready to support growth.",
  },
  {
    title: "Visibility",
    explanation: "Help more of the right people discover your business online.",
  },
  {
    title: "Acceleration",
    explanation: "Use paid advertising carefully when faster enquiries are important.",
  },
  {
    title: "Reputation",
    explanation: "Build the trust that helps customers choose your business.",
  },
  {
    title: "Sustainable Growth",
    explanation:
      "Keep improving steadily so progress continues over the long term.",
  },
] as const;

export function HomePage() {
  return (
    <PageContainer>
      <section className="home-hero" aria-labelledby="home-brand">
        <p className="home-hero__brand" id="home-brand">
          SEO AutoPilot
        </p>
        <h1 className="home-hero__headline">A trusted growth adviser for your business.</h1>
        <p className="home-hero__support">
          SEO AutoPilot helps make online growth easier to understand. It explains what
          matters in plain English and helps business owners make confident decisions
          without needing to become marketing experts.
        </p>
        <div className="home-hero__actions">
          <Link className="home-hero__cta" to="/learn">
            Explore the Learning Centre
          </Link>
        </div>
        <p className="home-hero__note">
          Personalised business guidance will become available after your business
          workspace is connected in a later phase. That workspace is not operational yet.
        </p>
      </section>

      <section className="home-pillars" aria-labelledby="pillars-heading">
        <div className="home-pillars__intro">
          <h2 id="pillars-heading">Five ways growth comes together</h2>
          <p>
            Online progress is rarely one single action. These five pillars help keep
            the full picture clear — without scores, dashboards or technical jargon.
          </p>
        </div>
        <div className="home-pillars__list">
          {GROWTH_PILLARS.map((pillar) => (
            <GrowthPillar
              key={pillar.title}
              title={pillar.title}
              explanation={pillar.explanation}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
