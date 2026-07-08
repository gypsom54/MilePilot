const QUALITY_CARDS = [
  {
    title: 'Documentation',
    description:
      'Product information sheets and batch records supplied with every compound for clear laboratory reference.',
  },
  {
    title: 'Storage Guidance',
    description:
      'Storage conditions and handling notes provided to support proper research compound management.',
  },
  {
    title: 'Batch Records',
    description:
      'Traceable batch documentation available for each product to support research record-keeping.',
  },
  {
    title: 'Support',
    description:
      'Responsive customer support for product enquiries, documentation requests and order assistance.',
  },
] as const;

export function QualitySection() {
  return (
    <section className="quality" id="quality" aria-labelledby="quality-heading">
      <div className="quality__inner">
        <div className="quality__header">
          <h2 id="quality-heading" className="section-title">
            Clear Standards. No Guesswork.
          </h2>
          <p className="section-subtitle">
            Transparent information at every step — from documentation to dispatch.
          </p>
        </div>

        <div className="quality__grid">
          {QUALITY_CARDS.map((card) => (
            <article
              key={card.title}
              className="quality-card"
              id={card.title === 'Documentation' ? 'documentation' : undefined}
            >
              <h3 className="quality-card__title">{card.title}</h3>
              <p className="quality-card__description">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
