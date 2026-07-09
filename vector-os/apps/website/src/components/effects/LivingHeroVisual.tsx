'use client';

import { PackagingRender } from '@/components/brand/PackagingRender';
import { CascadeItem, CascadeReveal } from '@/components/effects/CascadeReveal';
import { VECTOR_ASSETS } from '@/lib/vector-assets';

export function LivingHeroVisual() {
  return (
    <div className="c-hero__visual c-hero__visual--living">
      <div className="c-hero__visual-ambient" aria-hidden="true" />
      <CascadeReveal className="c-hero__visual-cascade">
        <CascadeItem index={4}>
          <PackagingRender
            src={VECTOR_ASSETS.hero}
            alt="Vector Peptides premium packaging — matte navy presentation box, research pen and hologram authenticity seal"
            accent="blue"
            variant="hero"
            priority
            living
          />
        </CascadeItem>
      </CascadeReveal>
    </div>
  );
}
