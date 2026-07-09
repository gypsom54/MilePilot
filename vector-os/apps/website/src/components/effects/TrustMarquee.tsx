'use client';

const TRUST_MESSAGES = [
  'Research Use Only',
  'Batch Documentation Available',
  'HPLC & Mass Spec Verified',
  'Secure UK Fulfilment',
  'Independent Laboratory Testing',
  'Premium Presentation Packaging',
  'QR Authentication',
  'Transparent Batch Information',
] as const;

export function TrustMarquee() {
  const items = [...TRUST_MESSAGES, ...TRUST_MESSAGES];

  return (
    <section className="trust-marquee section--light" aria-label="Trust indicators">
      <div className="trust-marquee__fade trust-marquee__fade--left" aria-hidden="true" />
      <div className="trust-marquee__fade trust-marquee__fade--right" aria-hidden="true" />
      <div className="trust-marquee__track">
        {items.map((message, index) => (
          <span key={`${message}-${index}`} className="trust-marquee__item">
            <span className="trust-marquee__mark" aria-hidden="true">
              ✓
            </span>
            {message}
          </span>
        ))}
      </div>
    </section>
  );
}
