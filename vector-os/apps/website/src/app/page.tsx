import { BatchVerification } from '@/components/home/BatchVerification';
import { ComplianceBanner } from '@/components/home/ComplianceBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { PackagingSection } from '@/components/home/PackagingSection';
import { TrustStrip } from '@/components/home/TrustStrip';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <FeaturedProducts />
      <PackagingSection />
      <BatchVerification />
      <ComplianceBanner />
    </main>
  );
}
