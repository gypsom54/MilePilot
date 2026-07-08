import { ComplianceBanner } from '@/components/home/ComplianceBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { PackagingSection } from '@/components/home/PackagingSection';
import { QualitySection } from '@/components/home/QualitySection';
import { TrustStrip } from '@/components/home/TrustStrip';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <FeaturedProducts />
      <PackagingSection />
      <QualitySection />
      <ComplianceBanner />
    </main>
  );
}
