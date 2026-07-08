const TRUST_ITEMS = [
  'Precision Manufactured',
  'Lab Tested',
  'Transparent Batch Information',
  'Secure Packaging',
  'Research Use Only',
] as const;

export function TrustRibbon() {
  return (
    <section className="trust-ribbon section--light" aria-label="Trust indicators">
      <div className="trust-ribbon__inner">
        {TRUST_ITEMS.map((item) => (
          <div key={item} className="trust-ribbon__item">
            <span className="trust-ribbon__line" aria-hidden="true" />
            <span className="trust-ribbon__label">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
