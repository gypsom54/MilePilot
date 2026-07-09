import { Reveal } from '@/components/effects/Reveal';
import { IconVerify } from '@/components/icons/PremiumIcons';

const DETAILS = [
  'Independent HPLC & Mass Spec verification',
  'Full batch documentation supplied',
  'QR authentication on every package',
  'Research use only — laboratory compounds',
] as const;

export function QualityStory() {
  return (
    <section className="verification section--dark section--cinematic" id="quality" aria-labelledby="quality-title">
      <div className="verification__inner">
        <Reveal className="verification__header">
          <p className="section-eyebrow">Quality Assurance</p>
          <h2 id="quality-title" className="section-headline">
            Verify Every Detail.
          </h2>
          <p className="section-lead" id="documentation">
            Traceability from manufacture to your laboratory bench.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="verification__showcase">
            <article className="verification__card" aria-label="Batch authentication card">
              <div className="verification__card-glow" aria-hidden="true" />
              <div className="verification__card-top">
                <span className="verification__brand">VECTOR</span>
                <div className="verification__hologram" aria-hidden="true" />
              </div>

              <div className="verification__qr" aria-hidden="true">
                <div className="verification__qr-grid">
                  {Array.from({ length: 121 }).map((_, i) => {
                    const row = Math.floor(i / 11);
                    const col = i % 11;
                    const on =
                      (row < 3 && col < 3) ||
                      (row < 3 && col > 7) ||
                      (row > 7 && col < 3) ||
                      (row + col) % 3 === 0 ||
                      (row * col) % 5 === 0;
                    return (
                      <span
                        key={i}
                        className={`verification__qr-cell${on ? ' verification__qr-cell--on' : ''}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="verification__batch">
                <p className="verification__batch-label">Batch Reference</p>
                <p className="verification__batch-id">VP-UK-2026-0847</p>
              </div>

              <div className="verification__card-footer">
                <span className="verification__status">
                  <IconVerify />
                  Authenticity Verified
                </span>
                <span className="verification__scan">Scan to verify</span>
              </div>
            </article>

            <ul className="verification__details">
              {DETAILS.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
