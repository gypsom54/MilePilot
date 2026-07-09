import { CinematicHero } from '@/components/home/CinematicHero';
import { PackagingStory } from '@/components/home/PackagingStory';
import { PurchaseCta } from '@/components/home/PurchaseCta';
import { QualityStory } from '@/components/home/QualityStory';
import { ResearchSeries } from '@/components/home/ResearchSeries';
import { TrustRibbon } from '@/components/home/TrustRibbon';

export default function HomePage() {
  return (
    <main className="cinematic-page">
      <CinematicHero />
      <TrustRibbon />
      <ResearchSeries />
      <PackagingStory />
      <QualityStory />
      <PurchaseCta />
    </main>
  );
}
