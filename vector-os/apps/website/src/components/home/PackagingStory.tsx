import { Reveal } from '@/components/effects/Reveal';

export function PackagingStory() {
  return (
    <section className="packaging-story section--light" id="packaging" aria-labelledby="packaging-title">
      <div className="packaging-story__inner">
        <Reveal className="packaging-story__copy">
          <p className="section-eyebrow section-eyebrow--dark">The Vector System</p>
          <h2 id="packaging-title" className="section-headline section-headline--dark">
            Packaging That
            <br />
            Commands Respect.
          </h2>
          <p className="section-lead section-lead--dark">
            Every detail considered — from the matte navy presentation box to the
            holographic authenticity seal. Designed for research environments
            that demand clarity and confidence.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="packaging-story__stage" aria-hidden="true">
            <div className="packaging-story__box">
              <div className="packaging-story__box-front">
                <span className="packaging-story__logo">VECTOR</span>
                <span className="packaging-story__logo-sub">PEPTIDES</span>
              </div>
              <div className="packaging-story__box-edge" />
            </div>

            <div className="packaging-story__pen" />
            <div className="packaging-story__hologram" />
            <div className="packaging-story__qc">
              <span className="packaging-story__qc-label">Batch / QC</span>
            </div>
            <div className="packaging-story__booklet" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
