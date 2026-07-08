const TRUST_ITEMS = [
  {
    title: 'Research Use Only',
    description: 'Supplied strictly for laboratory research purposes.',
  },
  {
    title: 'Batch Documentation',
    description: 'Clear records provided with every order.',
  },
  {
    title: 'Secure UK Fulfilment',
    description: 'Professional dispatch from the United Kingdom.',
  },
  {
    title: 'Premium Packaging',
    description: 'Presentation-grade boxes with protective inlays.',
  },
] as const;

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Trust indicators">
      <div className="trust-strip__inner">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="trust-strip__card">
            <h3 className="trust-strip__title">{item.title}</h3>
            <p className="trust-strip__description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
