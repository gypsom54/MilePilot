import { IconVerify } from '@/components/icons/PremiumIcons';
import {
  IconDocument,
  IconLab,
  IconQr,
  IconResearch,
} from '@/components/icons/PackagingIcons';

const FEATURES = [
  { title: 'Independent HPLC verification', Icon: IconLab },
  { title: 'Full batch documentation', Icon: IconDocument },
  { title: 'QR authentication', Icon: IconQr },
  { title: 'Research use only', Icon: IconResearch },
] as const;

export function QualityStory() {
  return (
    <section className="quality-story section--dark" id="quality" aria-labelledby="quality-title">
      <div className="quality-story__inner">
        <div className="quality-story__left">
          <p className="section-eyebrow">Quality Assurance</p>
          <h2 id="quality-title" className="section-headline">
            Verify Every Detail.
          </h2>
          <p className="section-lead" id="documentation">
            Traceability from manufacture to your laboratory bench.
          </p>

          <article className="quality-story__scan-card" aria-label="Batch authentication">
            <p className="quality-story__scan-label">Scan to Verify</p>
            <div className="quality-story__qr" aria-hidden="true">
              <div className="quality-story__qr-grid">
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
                      className={`quality-story__qr-cell${on ? ' quality-story__qr-cell--on' : ''}`}
                    />
                  );
                })}
              </div>
            </div>
            <p className="quality-story__batch-label">Batch Reference</p>
            <p className="quality-story__batch-id">VP-UK-2026-0847</p>
            <p className="quality-story__verified">
              <IconVerify />
              Authenticity Verified
            </p>
          </article>
        </div>

        <ul className="quality-story__features">
          {FEATURES.map(({ title, Icon }) => (
            <li key={title} className="quality-story__feature">
              <span className="quality-story__feature-icon" aria-hidden="true">
                <Icon />
              </span>
              <span>{title}</span>
            </li>
          ))}
        </ul>

        <div className="quality-story__seal" aria-hidden="true">
          <div className="quality-story__pedestal" />
          <div className="quality-story__seal-disc">
            <span className="quality-story__seal-ring" />
            <span className="quality-story__seal-text">VECTOR</span>
            <span className="quality-story__seal-sub">PEPTIDES</span>
            <span className="quality-story__seal-badge">VERIFIED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
