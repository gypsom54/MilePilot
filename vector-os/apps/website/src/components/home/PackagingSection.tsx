export function PackagingSection() {
  return (
    <section className="packaging" id="packaging" aria-labelledby="packaging-heading">
      <div className="packaging__inner">
        <div className="packaging__header">
          <h2 id="packaging-heading" className="section-title">
            Packaging That Builds Confidence.
          </h2>
          <p className="section-subtitle">
            A cohesive rebrand system designed for research environments.
          </p>
        </div>

        <div className="packaging__showcase" aria-hidden="true">
          <div className="packaging__item packaging__item--box">
            <div className="packaging__box-front">
              <span className="packaging__box-logo">VECTOR</span>
              <span className="packaging__box-sub">PEPTIDES</span>
            </div>
            <span className="packaging__item-label">Full-front overlay</span>
          </div>

          <div className="packaging__item packaging__item--pen">
            <div className="packaging__pen-label">
              <span>Research Pen</span>
              <span className="packaging__pen-strength">40 mg</span>
            </div>
            <span className="packaging__item-label">Pen label</span>
          </div>

          <div className="packaging__item packaging__item--hologram">
            <div className="packaging__hologram-disc" />
            <span className="packaging__item-label">Hologram seal</span>
          </div>

          <div className="packaging__item packaging__item--qc">
            <div className="packaging__qc-card">
              <span className="packaging__qc-line" />
              <span className="packaging__qc-line packaging__qc-line--short" />
              <span className="packaging__qc-badge">QC</span>
            </div>
            <span className="packaging__item-label">Batch / QC card</span>
          </div>

          <div className="packaging__item packaging__item--booklet">
            <div className="packaging__booklet">
              <span className="packaging__booklet-title">Information</span>
              <span className="packaging__booklet-line" />
              <span className="packaging__booklet-line" />
            </div>
            <span className="packaging__item-label">Information booklet</span>
          </div>
        </div>
      </div>
    </section>
  );
}
