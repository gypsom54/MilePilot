export function PackagingSection() {
  return (
    <section className="packaging" id="packaging" aria-labelledby="packaging-heading">
      <div className="packaging__inner">
        <div className="packaging__content">
          <h2 id="packaging-heading" className="section-title">
            Packaging That Builds Confidence.
          </h2>
          <p className="section-subtitle packaging__intro">
            Every order arrives in a presentation-grade box designed for research
            environments — structured, labelled and ready for the laboratory.
          </p>

          <ul className="packaging__features">
            <li>Magnetic-style presentation box</li>
            <li>Protective foam inlay</li>
            <li>Dedicated research pen space</li>
            <li>12 organised needle spaces</li>
            <li>Information booklet included</li>
            <li>Consistent product labelling</li>
          </ul>
        </div>

        <div className="packaging__visual" aria-hidden="true">
          <div className="packaging__box-open">
            <div className="packaging__box-lid" />
            <div className="packaging__box-base">
              <div className="packaging__foam">
                <div className="packaging__pen-channel" />
                <div className="packaging__needle-rows">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="packaging__needle-hole" />
                  ))}
                </div>
              </div>
              <div className="packaging__booklet" />
            </div>
            <div className="packaging__box-side-label">
              <span>Vector Peptides</span>
              <span>Research Use Only</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
