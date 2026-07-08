const TRUST_ITEMS = [
  { title: 'Research Use Only' },
  { title: 'Batch Documentation' },
  { title: 'Premium Packaging' },
  { title: 'Secure UK Fulfilment' },
] as const;

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Trust indicators">
      <div className="trust-strip__inner">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="trust-strip__card">
            <span className="trust-strip__icon" aria-hidden="true" />
            <h3 className="trust-strip__title">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
