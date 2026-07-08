const VERIFICATION_ITEMS = [
  {
    title: 'QR Authentication',
    description: 'Scan to verify product authenticity and access batch records.',
  },
  {
    title: 'Batch Record',
    description: 'Traceable documentation supplied with every research compound.',
  },
  {
    title: 'Documentation Available',
    description: 'Product information sheets provided for laboratory reference.',
  },
  {
    title: 'Quality Release',
    description: 'Quality control release documentation included with each batch.',
  },
] as const;

export function BatchVerification() {
  return (
    <section
      className="verification"
      id="verification"
      aria-labelledby="verification-heading"
    >
      <div className="verification__inner">
        <div className="verification__header">
          <h2 id="verification-heading" className="section-title">
            Verify Every Detail.
          </h2>
          <p className="section-subtitle" id="documentation">
            Transparent traceability from batch to laboratory.
          </p>
        </div>

        <div className="verification__layout">
          <div className="verification__qr-panel" aria-hidden="true">
            <div className="verification__qr-frame">
              <div className="verification__qr-code">
                {Array.from({ length: 49 }).map((_, i) => (
                  <span
                    key={i}
                    className={`verification__qr-cell${(i + Math.floor(i / 7)) % 3 === 0 ? ' verification__qr-cell--filled' : ''}`}
                  />
                ))}
              </div>
              <span className="verification__qr-caption">Scan to verify</span>
            </div>
          </div>

          <div className="verification__cards">
            {VERIFICATION_ITEMS.map((item) => (
              <article key={item.title} className="verification-card">
                <h3 className="verification-card__title">{item.title}</h3>
                <p className="verification-card__description">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
