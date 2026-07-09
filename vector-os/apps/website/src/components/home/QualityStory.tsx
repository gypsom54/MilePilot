import { Reveal } from '@/components/effects/Reveal';

const PILLARS = [
  {
    title: 'Independent Testing',
    description:
      'Every batch verified through rigorous analytical testing for research integrity.',
  },
  {
    title: 'Full Transparency',
    description:
      'Documentation and batch records supplied with every compound.',
  },
  {
    title: 'Research Focused',
    description:
      'Supplied strictly for laboratory research. Not for human or veterinary use.',
  },
  {
    title: 'Quality Assured',
    description:
      'Quality control release documentation included with each batch.',
  },
] as const;

export function QualityStory() {
  return (
    <section className="quality-story section--dark section--cinematic" id="quality" aria-labelledby="quality-title">
      <div className="quality-story__inner">
        <Reveal className="quality-story__header">
          <p className="section-eyebrow">Quality Assurance</p>
          <h2 id="quality-title" className="section-headline">
            Verify Every Detail.
          </h2>
          <p className="section-lead" id="documentation">
            Traceability from manufacture to your laboratory bench.
          </p>
        </Reveal>

        <div className="quality-story__grid">
          <Reveal delay={0}>
            <div className="quality-story__qr" aria-hidden="true">
              <div className="quality-story__qr-frame">
                <div className="quality-story__qr-grid">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <span
                      key={i}
                      className={`quality-story__qr-cell${(i + Math.floor(i / 8)) % 2 === 0 ? ' quality-story__qr-cell--on' : ''}`}
                    />
                  ))}
                </div>
                <span className="quality-story__qr-label">Scan to verify authenticity</span>
              </div>
            </div>
          </Reveal>

          <div className="quality-story__pillars">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 100}>
                <article className="quality-pillar">
                  <span className="quality-pillar__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="quality-pillar__title">{pillar.title}</h3>
                  <p className="quality-pillar__text">{pillar.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
