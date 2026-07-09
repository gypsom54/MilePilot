import Link from 'next/link';
import { LivingHeroVisual } from '@/components/effects/LivingHeroVisual';

export function CinematicHero() {
  return (
    <section className="c-hero section--dark">
      <div className="c-hero__glow" aria-hidden="true" />
      <div className="c-hero__inner">
        <div className="c-hero__copy">
          <p className="c-hero__label">Vector Precision Research</p>
          <h1 className="c-hero__title">
            Research
            <br />
            Without <span className="c-hero__accent">Compromise.</span>
          </h1>
          <p className="c-hero__lead">
            Purity, identity and potency verified through rigorous independent testing.
            Premium research peptides presented with the documentation your laboratory demands.
          </p>
          <div className="c-hero__actions">
            <Link href="#research-series" className="c-btn c-btn--primary c-btn--lg">
              View Research Series
              <span className="c-btn__arrow" aria-hidden="true">›</span>
            </Link>
            <Link href="#quality" className="c-btn c-btn--ghost c-btn--lg">
              Quality Assurance
            </Link>
          </div>
        </div>

        <LivingHeroVisual />
      </div>
    </section>
  );
}
