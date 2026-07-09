import { Button } from '@vector-platform/ui';
import { PackagingRender } from '@/components/brand/PackagingRender';
import {
  IconBooklet,
  IconBox,
  IconHologram,
  IconNeedles,
  IconPen,
  IconQcCard,
} from '@/components/icons/PackagingIcons';
import { VECTOR_ASSETS } from '@/lib/vector-assets';

const PACKAGING_ITEMS = [
  { label: 'Matte Navy Presentation Box', Icon: IconBox },
  { label: 'Research Pen', Icon: IconPen },
  { label: '12 Needles', Icon: IconNeedles },
  { label: 'QC Batch Card', Icon: IconQcCard },
  { label: 'Information Booklet', Icon: IconBooklet },
  { label: 'Hologram Seal', Icon: IconHologram },
] as const;

export function PackagingStory() {
  return (
    <section className="packaging-story section--light" id="packaging" aria-labelledby="packaging-title">
      <div className="packaging-story__inner">
        <div className="packaging-story__copy">
          <p className="section-eyebrow section-eyebrow--dark">The Vector System</p>
          <h2 id="packaging-title" className="section-headline section-headline--dark">
            Packaging That
            <br />
            Commands Respect.
          </h2>
          <p className="section-lead section-lead--dark">
            Matte navy presentation box. Silver Vector identity. Premium research pen.
            Side label. QC card. Information booklet. Hologram authenticity seal — every
            element designed as one cohesive system.
          </p>
          <Button variant="primary" size="lg" className="c-btn c-btn--primary c-btn--dark packaging-story__cta">
            Explore Packaging
          </Button>
        </div>

        <div className="packaging-story__visual">
          <PackagingRender
            src={VECTOR_ASSETS.packagingSystem}
            alt="Vector Peptides complete packaging system — presentation box, research pen, QC card, information booklet and hologram seal"
            accent="neutral"
            variant="system"
          />
        </div>
      </div>

      <div className="packaging-story__icons" aria-label="Packaging components">
        {PACKAGING_ITEMS.map(({ label, Icon }) => (
          <div key={label} className="packaging-story__icon-item">
            <span className="packaging-story__icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="packaging-story__icon-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
