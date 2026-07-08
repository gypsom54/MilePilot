const FEATURES = [
  {
    anchor: 'products',
    title: 'Research Products',
    description:
      'High-purity peptides and research compounds with rigorous quality standards and transparent documentation.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3L4 9V21H20V9L12 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 21V13H15V21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    anchor: 'platform',
    title: 'AI Platform',
    description:
      'Laboratory intelligence software that connects research workflows, inventory, and compliance in one unified system.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 2V5M12 19V22M2 12H5M19 12H22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M4.93 19.07L7.05 16.95M16.95 7.05L19.07 4.93"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    anchor: undefined,
    title: 'Developer API',
    description:
      'Programmatic access to catalog data, order management, and platform integrations with clear, versioned endpoints.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 9L4 12L8 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 9L20 12L16 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 6L11 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

export function FeatureCards() {
  return (
    <section className="features" id="research" aria-labelledby="features-heading">
      <div className="features__inner">
        <div className="features__header">
          <h2 id="features-heading" className="features__title">
            Built for modern research teams
          </h2>
          <p className="features__subtitle">
            Three integrated pillars that power discovery from bench to business.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="feature-card"
              id={feature.anchor}
            >
              <div className="feature-card__glow" aria-hidden="true" />
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
