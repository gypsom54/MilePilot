'use client';

const TRUST_MESSAGES = [
  'Premium Presentation Packaging',
  'Independent Laboratory Testing',
  'QR Authentication',
  'Batch Documentation Available',
  'HPLC & Mass Spec Verified',
  'Secure UK Fulfilment',
] as const;

export function TrustMarquee() {
  const items = [...TRUST_MESSAGES, ...TRUST_MESSAGES];

  return (
    <div className="trust-marquee" aria-label="Trust indicators">
      <div className="trust-marquee__track">
        {items.map((message, index) => (
          <span key={`${message}-${index}`} className="trust-marquee__item">
            <span className="trust-marquee__dot" aria-hidden="true" />
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}
