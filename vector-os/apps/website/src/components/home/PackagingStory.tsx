import { PackagingRender } from '@/components/brand/PackagingRender';
import { Reveal } from '@/components/effects/Reveal';
import { VECTOR_ASSETS } from '@/lib/vector-assets';

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
            Matte navy presentation box. Silver Vector identity. Premium research
            pen. Side label. QC card. Information booklet. Hologram authenticity
            seal — every element designed as one cohesive system.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <PackagingRender
            src={VECTOR_ASSETS.packagingSystem}
            alt="Vector Peptides complete packaging system — presentation box, research pen, side label, QC card, information booklet and hologram seal"
            accent="neutral"
            variant="system"
          />
        </Reveal>
      </div>
    </section>
  );
}
